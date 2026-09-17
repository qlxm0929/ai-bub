import { z } from 'zod';
import type { Platform, SocialPost, Topic } from './catalog';

const resultSchema = z.object({ title: z.string(), url: z.string(), content: z.string(), published_date: z.string().nullish() });
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
    ? /^(?:threads\.com|threads\.net)$/.test(host) && url.pathname.replace(/^\/%40/i, '/@').match(/^\/@([\w.]+)\/post\/([\w-]+)(?:\/[^/]*)?\/?$/)
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
