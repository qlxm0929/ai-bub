import ky, { HTTPError } from 'ky';
import { z } from 'zod';
import type { Platform, SocialPost, Topic } from './catalog';
import type { SocialSnapshot, SocialSource } from './schema';

export const SOCIAL_WINDOW = 10 * 60 * 1000;
const resultSchema = z.object({ title: z.string(), url: z.string(), content: z.string(), published_date: z.string().nullish() });
const searchSchema = z.object({ results: z.array(z.unknown()).max(100) });
const aiTerms = /\b(ai|chatgpt|openai|claude|gemini|llm|midjourney|notebooklm|perplexity|comfyui)\b|인공지능|생성형|챗지피티|클로드|제미나이|미드저니|노트북엘엠/i;
const categoryTerms: readonly [Topic, RegExp][] = [
  ['workflow', /자동화|업무|코딩|에이전트|automation|workflow|coding|agent/i],
  ['research', /문서|리서치|연구|자료|논문|research|document|notebooklm/i],
  ['image', /이미지|영상|사진|그림|음성|image|video|photo|audio|midjourney/i],
  ['offers', /무료|체험|\bfree\b|\btrial\b/i],
];
function clean(text: string, limit: number): string {
  return text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, limit);
}
export function toSocialPost(value: unknown, platform: Platform, checkedAt: string): SocialPost | null {
  const parsed = resultSchema.safeParse(value);
  if (!parsed.success) return null;
  const result = parsed.data;
  let url: URL;
  try { url = new URL(result.url); } catch { return null; }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  const host = url.hostname.replace(/^www\./, '');
  const match = platform === 'threads'
    ? /^(?:threads\.com|threads\.net)$/.test(host) && url.pathname.match(/^\/@([\w.]+)\/post\/([\w-]+)\/?$/)
    : host === 'instagram.com' && url.pathname.match(/^\/(?:(\w[\w.]+)\/)?(?:p|reel)\/([\w-]+)\/?$/);
  if (!match) return null;
  const title = clean(result.title, 180);
  const summary = clean(result.content, 600);
  if (!title || !summary || !aiTerms.test(`${title} ${summary}`)) return null;
  const topics: Topic[] = categoryTerms.filter(([, pattern]) => pattern.test(`${title} ${summary}`)).map(([topic]) => topic);
  if (!topics.length) topics.push('tools');
  const timestamp = result.published_date ? Date.parse(result.published_date) : NaN;
  const publishedOn = Number.isFinite(timestamp) && timestamp <= Date.parse(checkedAt) ? new Date(timestamp).toISOString().slice(0, 10) : null;
  const code = match[2];
  return {
    id: `${platform === 'threads' ? 'th' : 'ig'}-${code}`, platform, author: match[1] ?? '',
    title, summary, topics, publishedOn, checkedOn: checkedAt.slice(0, 10), origin: 'search',
    url: platform === 'threads' ? `https://www.threads.com/@${match[1]}/post/${code}` : `https://www.instagram.com/${url.pathname.includes('/reel/') ? 'reel' : 'p'}/${code}/`,
    caveat: '검색에 공개된 발췌입니다. 원문 전체·성능·가격은 별도 확인하지 않았습니다. 무료 언급의 현재 조건은 미확인입니다.',
  };
}
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
  const key = process.env.TAVILY_API_KEY?.trim();
  const collectedAt = new Date().toISOString();
  if (!key) return { collectedAt, nextRefreshAt: collectedAt, posts: [], sources: (['threads', 'instagram'] as const).map((platform) => ({ platform, status: 'unconnected', message: '자동 수집 연결을 준비 중입니다. 선별 글과 공개글 검색을 이용할 수 있습니다.', count: 0, attemptedAt: null, lastSuccessAt: null })) };
  const results = await Promise.all([collectPlatform('threads', key), collectPlatform('instagram', key)]);
  return { collectedAt, nextRefreshAt: new Date(Date.now() + SOCIAL_WINDOW).toISOString(),
    posts: results.flatMap((result) => result.posts).sort((a, b) => (b.publishedOn ?? '').localeCompare(a.publishedOn ?? '')),
    sources: results.map((result) => result.source) };
}
