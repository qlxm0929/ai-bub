import ky from 'ky';
import Parser from 'rss-parser';
import { z } from 'zod';
import type { SocialPost } from './catalog';
import type { SocialSnapshot } from './schema';
import { toSocialPost } from './normalize';

const feedUrlSchema = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === 'https:' && url.hostname === 'www.google.com' && !url.port && !url.username && !url.password
    && /^\/alerts\/feeds\/\d+\/\d+$/.test(url.pathname) && !url.search && !url.hash;
});
const feedSchema = z.object({ items: z.array(z.unknown()).max(1000) });
const entrySchema = z.object({ title: z.string(), link: z.string(), content: z.string().optional(), contentSnippet: z.string().optional() });
export function googleAlertsPosts(feed: unknown, checkedAt: string): SocialPost[] {
  const parsed = feedSchema.parse(feed);
  const unique = new Map<string, SocialPost>();
  for (const item of parsed.items) {
    const entry = entrySchema.safeParse(item);
    if (!entry.success) continue;
    let url: URL;
    try {
      url = new URL(entry.data.link);
      if (url.protocol === 'https:' && (url.hostname === 'www.google.com' || url.hostname === 'google.com') && url.pathname === '/url') {
        url = new URL(url.searchParams.get('url') ?? url.searchParams.get('q') ?? '');
      }
    } catch { continue; }
    const platform = /^(www\.)?threads\.(com|net)$/.test(url.hostname) ? 'threads' : 'instagram';
    const post = toSocialPost({ title: entry.data.title, url: url.href,
      content: entry.data.contentSnippet || entry.data.content || 'Google 알리미에서 발견한 게시글입니다. 원문에서 내용을 확인하세요.' }, platform, checkedAt);
    if (post) unique.set(post.id, { ...post, caveat: 'Google 알리미 검색 발췌입니다. RSS 전달일은 원문 게시일이 아닙니다. 게시일·현재 무료 조건·성능은 원문과 공식 페이지에서 확인하세요.' });
  }
  return [...unique.values()].slice(0, 100);
}
export async function collectGoogleAlerts(feedUrl: string): Promise<SocialSnapshot> {
  const collectedAt = new Date().toISOString();
  const base = { provider: 'google-alerts', collectedAt, nextRefreshAt: new Date(Date.now() + 600000).toISOString() } as const;
  const platforms = ['threads', 'instagram'] as const;
  try {
    const validatedUrl = feedUrlSchema.parse(feedUrl);
    const xml = await ky.get(validatedUrl, { timeout: 18000, retry: 0, redirect: 'error' }).text();
    if (xml.length > 2_000_000 || /<!DOCTYPE/i.test(xml)) throw new Error('InvalidFeed');
    const feed: unknown = await new Parser().parseString(xml);
    const checkedAt = new Date().toISOString();
    const posts = googleAlertsPosts(feed, checkedAt);
    return { ...base, posts, sources: platforms.map((platform) => {
      const count = posts.filter((post) => post.platform === platform).length;
      return { platform, status: 'success', count, attemptedAt: collectedAt, lastSuccessAt: checkedAt,
        message: count ? `Google 알리미 RSS · AI 게시글 ${count}개` : 'RSS 조회 성공 · 아직 전달된 AI 게시글이 없습니다.' };
    }) };
  } catch (error) {
    console.warn('Google Alerts RSS failed', error instanceof Error ? error.name : 'UnknownError');
    return { ...base, posts: [], sources: platforms.map((platform) => ({ platform, status: 'failed', count: 0,
      attemptedAt: collectedAt, lastSuccessAt: null, message: 'Google 알리미 RSS를 읽지 못했습니다. 이전 결과가 있으면 유지합니다.' })) };
  }
}
