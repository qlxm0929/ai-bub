import { z } from 'zod';

export const socialPostSchema = z.object({
  id: z.string(), platform: z.enum(['threads', 'instagram']), author: z.string(),
  title: z.string(), summary: z.string(),
  topics: z.array(z.enum(['tools', 'workflow', 'research', 'image', 'offers'])).readonly(),
  url: z.url().refine((value) => /^https:\/\/(www\.)?(threads\.(com|net)|instagram\.com)\//.test(value)),
  publishedOn: z.iso.date().nullable(), checkedOn: z.iso.date(), caveat: z.string(),
  origin: z.literal('search').optional(),
});
export const socialSourceSchema = z.object({
  platform: z.enum(['threads', 'instagram']),
  status: z.enum(['success', 'failed', 'unconnected']),
  message: z.string(), count: z.number().int().nonnegative(),
  attemptedAt: z.iso.datetime().nullable(), lastSuccessAt: z.iso.datetime().nullable(),
});
export const socialSnapshotSchema = z.object({
  provider: z.enum(['tavily', 'google-alerts']).optional(),
  collectedAt: z.iso.datetime(), nextRefreshAt: z.iso.datetime(),
  posts: z.array(socialPostSchema).max(200), sources: z.array(socialSourceSchema).length(2),
});
export const socialResponseSchema = z.object({
  snapshot: socialSnapshotSchema, delivery: z.enum(['collected', 'cached', 'unconnected']),
});
export type SocialSnapshot = z.infer<typeof socialSnapshotSchema>;
export type SocialSource = z.infer<typeof socialSourceSchema>;
