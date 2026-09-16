import { z } from 'zod';

export const httpUrl = z.url().refine((value) => /^https?:\/\//.test(value));
const date = z.iso.datetime();
export const priceSchema = z.object({
  kind: z.enum(['free', 'trial', 'unknown']),
  scope: z.string(),
  card: z.string(),
  expiry: z.string(),
  extra: z.string(),
  evidenceUrl: httpUrl.nullable(),
  evidenceQuote: z.string().nullable(),
  checkedAt: date.nullable(),
});
export const evidenceSchema = z.object({
  sourceId: z.string(),
  sourceName: z.string(),
  kind: z.enum(['official', 'developer', 'discovery']),
  title: z.string(),
  url: httpUrl,
  publishedAt: date.nullable(),
  fetchedAt: date,
});
export const itemSchema = z.object({
  id: z.string(),
  product: z.string(),
  title: z.string(),
  summary: z.string(),
  summaryKind: z.enum(['korean', 'translated', 'original', 'ai']),
  uses: z.array(z.string()),
  category: z.enum(['new', 'update', 'offer', 'news']),
  officialUrl: httpUrl,
  openSource: z.string(),
  price: priceSchema,
  evidence: z.array(evidenceSchema).min(1),
});
export const sourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: httpUrl,
  status: z.enum(['success', 'failed', 'unconnected']),
  message: z.string(),
  attemptedAt: date.nullable(),
  lastSuccessAt: date.nullable(),
  count: z.number().int().nonnegative(),
});
export const snapshotSchema = z.object({
  version: z.literal(1),
  collectedAt: date,
  nextRefreshAt: date,
  sources: z.array(sourceSchema),
  items: z.array(itemSchema),
});
export type DiscoveryItem = z.infer<typeof itemSchema>;
export type SourceStatus = z.infer<typeof sourceSchema>;
export type Snapshot = z.infer<typeof snapshotSchema>;
export type Price = z.infer<typeof priceSchema>;
export const unknownPrice: Price = {
  kind: 'unknown', scope: '무료 범위 미확인', card: '미확인', expiry: '미확인',
  extra: '별도 API·호스팅 비용 미확인', evidenceUrl: null, evidenceQuote: null, checkedAt: null,
};
