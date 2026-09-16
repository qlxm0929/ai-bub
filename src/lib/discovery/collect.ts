import ky from 'ky';
import { summarizeItems } from './summarize';
import Parser from 'rss-parser';
import { z } from 'zod';
import { translateToKorean } from '../translate';
import { disconnected, feeds, offers, type Feed } from './catalog';
import { canonicalUrl, groupItems } from './merge';
import { httpUrl, unknownPrice, type DiscoveryItem, type Snapshot, type SourceStatus } from './schema';

const parser = new Parser();
const rssItems = z.array(z.object({
  title: z.string().optional(), link: z.string().optional(), pubDate: z.string().optional(),
  isoDate: z.string().optional(), contentSnippet: z.string().optional(), summary: z.string().optional(),
}));
const http = ky.create({ timeout: 10000, retry: 0, headers: { 'User-Agent': 'AI.EL news reader (+https://ai-bub.vercel.app/news)' } });
export const COLLECTION_WINDOW = 5 * 60 * 1000;

type SourceResult = { readonly status: SourceStatus; readonly items: readonly DiscoveryItem[] };
type Source = { readonly id: string; readonly name: string; readonly url: string };

function plainText(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}
function knownDate(value: string | undefined): string | null {
  if (!value || !Number.isFinite(Date.parse(value))) return null;
  return new Date(value).toISOString();
}
function productFor(feed: Feed, title: string, url: string): { id: string; name: string; home: string } {
  if (feed.product) return { id: feed.id, name: feed.product, home: feed.home };
  const products = [
    { pattern: /\bchatgpt\b/i, id: 'chatgpt', name: 'ChatGPT', home: 'https://chatgpt.com/' },
    { pattern: /\bcodex\b/i, id: 'codex', name: 'Codex', home: 'https://openai.com/codex/' },
    { pattern: /\bcopilot\b/i, id: 'github-copilot', name: 'GitHub Copilot', home: 'https://github.com/features/copilot' },
    { pattern: /\bgemini\b.*\bapi\b|\bapi\b.*\bgemini\b/i, id: 'gemini-api', name: 'Gemini API', home: 'https://ai.google.dev/' },
    { pattern: /\bgemini\b/i, id: 'gemini', name: 'Gemini', home: 'https://gemini.google.com/' },
  ];
  const product = products.find((candidate) => candidate.pattern.test(title));
  return product ?? { id: canonicalUrl(url), name: feed.name.replace(' 공식 소식', '').replace(' 공식 블로그', '').replace(' 블로그', ''), home: feed.home };
}
async function fetchFeed(feed: Feed): Promise<readonly DiscoveryItem[]> {
  const xml = await http.get(feed.url, { cache: 'no-store' }).text();
  const parsed = rssItems.parse((await parser.parseString(xml)).items);
  const fetchedAt = new Date().toISOString();
  const valid = parsed.filter((item) => httpUrl.safeParse(item.link).success && item.title);
  if (!valid.length) throw new SourceReadError('피드에서 유효한 항목을 찾지 못했습니다.');
  return Promise.all(valid.slice(0, 5).map(async (item): Promise<DiscoveryItem> => {
    const url = canonicalUrl(httpUrl.parse(item.link));
    const title = item.title ?? '제목 미확인';
    const product = productFor(feed, title, url);
    const community = feed.id === 'huggingface' && new URL(url).pathname.split('/').filter(Boolean).length > 2;
    const excerpt = plainText(`${title}. ${item.contentSnippet ?? item.summary ?? ''}`).slice(0, 360);
    const translated = await translateToKorean(excerpt);
    const summaryKind = /[가-힣]/.test(translated) ? 'translated' : 'original';
    return {
      id: product.id, product: product.name, title,
      summary: translated, summaryKind, uses: [...feed.uses],
      category: /\b(introducing|launching|announcing|introduce|launches)\b/i.test(title) ? 'new' : feed.kind === 'developer' || /\b(update|release|upgrade|improve|new feature)\b/i.test(title) ? 'update' : 'news',
      officialUrl: product.home, openSource: '라이선스 미확인', price: unknownPrice,
      evidence: [{ sourceId: feed.id, sourceName: community ? 'Hugging Face 커뮤니티 게시글' : feed.name, kind: community ? 'discovery' : feed.kind, title, url,
        publishedAt: knownDate(item.isoDate ?? item.pubDate), fetchedAt }],
    };
  }));
}
class SourceReadError extends Error {}
async function fetchOffer(offer: typeof offers[number]): Promise<readonly DiscoveryItem[]> {
  const html = await http.get(offer.url, { cache: 'no-store' }).text();
  const text = plainText(html);
  const confirmed = offer.required.every((pattern) => pattern.test(text));
  if (!confirmed) throw new SourceReadError('공식 페이지의 무료 조건 문구가 변경되었거나 확인되지 않았습니다.');
  const checkedAt = new Date().toISOString();
  return [{
    id: offer.productId, product: offer.product, title: offer.kind === 'trial' ? '공식 무료 체험 조건 확인' : '공식 무료 플랜 조건 확인',
    summary: offer.summary, summaryKind: 'korean', uses: [...offer.uses], category: 'offer',
    officialUrl: offer.home, openSource: '라이선스 미확인',
    price: { kind: offer.kind, scope: offer.scope, card: offer.card, expiry: offer.expiry, extra: offer.extra,
      evidenceUrl: offer.url, evidenceQuote: offer.quote, checkedAt },
    evidence: [{ sourceId: offer.id, sourceName: offer.name, kind: 'official', title: offer.name,
      url: offer.url, publishedAt: null, fetchedAt: checkedAt }],
  }];
}
async function readSource(source: Source, read: () => Promise<readonly DiscoveryItem[]>): Promise<SourceResult> {
  const attemptedAt = new Date().toISOString();
  try {
    const items = await read();
    return { items, status: { id: source.id, name: source.name, url: source.url, status: 'success', message: '원본 조회 성공', attemptedAt,
      lastSuccessAt: new Date().toISOString(), count: items.length } };
  } catch (error) {
    const message = error instanceof SourceReadError ? error.message
      : error instanceof Error && error.name === 'TimeoutError' ? '응답 시간 초과 · 이전 결과가 있으면 표시합니다.'
      : '원본 조회 실패 · 연결 상태 또는 원문 응답을 확인해야 합니다.';
    console.warn('Discovery source failed', source.id, error instanceof Error ? error.name : 'UnknownError');
    return { items: [], status: { ...source, status: 'failed', message, attemptedAt, lastSuccessAt: null, count: 0 } };
  }
}
export async function collectSnapshot(bucket: number): Promise<Snapshot> {
  const collectedAt = new Date().toISOString();
  const results = await Promise.all([
    ...feeds.map((feed) => readSource(feed, () => fetchFeed(feed))),
    ...offers.map((offer) => readSource(offer, () => fetchOffer(offer))),
  ]);
  const summarized = await summarizeItems(groupItems(results.flatMap((result) => result.items)));
  return {
    version: 1, collectedAt, nextRefreshAt: new Date((bucket + 1) * COLLECTION_WINDOW).toISOString(),
    items: summarized.items,
    sources: [summarized.status, ...results.map((result) => result.status), ...disconnected.map((source): SourceStatus => ({
      ...source, status: 'unconnected', attemptedAt: null, lastSuccessAt: null, count: 0,
    }))],
  };
}
