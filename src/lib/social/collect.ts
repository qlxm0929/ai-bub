import ky, { HTTPError } from 'ky';
import { z } from 'zod';
import type { Platform, SocialPost } from './catalog';
import { toSocialPost } from './normalize';
import { collectGoogleAlerts } from './rss';
import type { SocialSnapshot, SocialSource } from './schema';

export const SOCIAL_WINDOW = 10 * 60 * 1000;
const searchSchema = z.object({ results: z.array(z.unknown()).max(100) });
async function collectPlatform(platform: Platform, key: string): Promise<{ posts: SocialPost[]; source: SocialSource }> {
  const attemptedAt = new Date().toISOString();
  try {
    const response = await ky.post('https://api.tavily.com/search', {
      headers: { Authorization: `Bearer ${key}` }, timeout: 18000, retry: 0,
      json: { query: platform === 'threads' ? 'AI 인공지능 도구 활용 자동화 (site:threads.com OR site:threads.net)' : 'AI 인공지능 도구 활용 이미지 자동화 site:instagram.com',
        include_domains: platform === 'threads' ? ['threads.com', 'threads.net'] : ['instagram.com'],
        search_depth: 'basic', topic: 'general', max_results: 20, time_range: 'month',
        include_published_date: true, include_answer: false, include_raw_content: false, auto_parameters: false, safe_search: true },
    }).json<unknown>();
    const data = searchSchema.parse(response);
    const checkedAt = new Date().toISOString();
    const unique = new Map<string, SocialPost>();
    for (const result of data.results) { const post = toSocialPost(result, platform, checkedAt); if (post) unique.set(post.id, post); }
    const posts = [...unique.values()];
    return { posts, source: { platform, status: 'success', attemptedAt, lastSuccessAt: checkedAt, count: posts.length,
      message: posts.length ? `AI 관련 게시글 ${posts.length}개 · 공개 검색 발췌` : '검색 성공 · 조건에 맞는 공개 게시글 0개' } };
  } catch (error) {
    const status = error instanceof HTTPError ? error.response.status : null;
    const message = status === 401 || status === 403 ? '검색 연결 인증을 확인해야 합니다.'
      : status === 429 || status === 432 || status === 433 ? '검색 한도에 도달했습니다. 잠시 후 다시 시도해주세요.' : '검색에 실패했습니다. 이전 결과가 있으면 유지합니다.';
    console.warn('Social search failed', platform, status ?? (error instanceof Error ? error.name : 'UnknownError'));
    return { posts: [], source: { platform, status: 'failed', message, count: 0, attemptedAt, lastSuccessAt: null } };
  }
}
export async function collectSocial(): Promise<SocialSnapshot> {
  if (process.env.GOOGLE_ALERTS_RSS_URL?.trim()) return collectGoogleAlerts(process.env.GOOGLE_ALERTS_RSS_URL.trim());
  const key = process.env.TAVILY_API_KEY?.trim();
  const collectedAt = new Date().toISOString();
  if (!key) return { collectedAt, nextRefreshAt: collectedAt, posts: [], sources: (['threads', 'instagram'] as const).map((platform) => ({ platform, status: 'unconnected', message: '자동 수집 연결을 준비 중입니다. 선별 글과 공개글 검색을 이용할 수 있습니다.', count: 0, attemptedAt: null, lastSuccessAt: null })) };
  const results = await Promise.all([collectPlatform('threads', key), collectPlatform('instagram', key)]);
  return { provider: 'tavily', collectedAt, nextRefreshAt: new Date(Date.now() + SOCIAL_WINDOW).toISOString(),
    posts: results.flatMap((result) => result.posts).sort((a, b) => (b.publishedOn ?? '').localeCompare(a.publishedOn ?? '')),
    sources: results.map((result) => result.source) };
}
