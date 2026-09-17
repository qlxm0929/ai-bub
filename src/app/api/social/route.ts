import { unstable_cache } from 'next/cache';
import { collectSocial, SOCIAL_WINDOW } from '@/lib/social/collect';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;
let pending: { bucket: number; value: ReturnType<typeof collectSocial> } | null = null;

export async function GET() {
  const requestedAt = Date.now();
  const bucket = Math.floor(requestedAt / SOCIAL_WINDOW);
  const headers = { 'Cache-Control': 'no-store' };
  if (!process.env.TAVILY_API_KEY?.trim() && !process.env.GOOGLE_ALERTS_RSS_URL?.trim()) {
    return Response.json({ snapshot: await collectSocial(), delivery: 'unconnected' }, { status: 503, headers });
  }
  try {
    if (!pending || pending.bucket !== bucket) {
      const cached = unstable_cache(collectSocial, ['sns-search-v2', String(bucket)], { revalidate: 600 });
      pending = { bucket, value: cached() };
    }
    const snapshot = await pending.value;
    const success = snapshot.sources.some((source) => source.status === 'success');
    return Response.json({ snapshot: { ...snapshot, nextRefreshAt: new Date((bucket + 1) * SOCIAL_WINDOW).toISOString() },
      delivery: Date.parse(snapshot.collectedAt) >= requestedAt ? 'collected' : 'cached' }, { status: success ? 200 : 503, headers });
  } catch (error) {
    pending = null;
    console.warn('Social request failed', error instanceof Error ? error.name : 'UnknownError');
    return Response.json({ error: '수집 서버에 연결하지 못했습니다.' }, { status: 503, headers });
  }
}
