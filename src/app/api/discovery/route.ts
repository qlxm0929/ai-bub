import { unstable_cache } from 'next/cache';
import { collectSnapshot, COLLECTION_WINDOW } from '@/lib/discovery/collect';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
const cachedCollection = unstable_cache(collectSnapshot, ['ai-discovery-v1'], { revalidate: 300 });

export async function GET() {
  const requestedAt = Date.now();
  try {
    const snapshot = await cachedCollection(Math.floor(Date.now() / COLLECTION_WINDOW));
    const success = snapshot.sources.some((source) => source.status === 'success' && source.id !== 'korean-summary');
    return Response.json({ snapshot, delivery: Date.parse(snapshot.collectedAt) >= requestedAt ? 'collected' : 'cached' }, { status: success ? 200 : 503, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Discovery request failed', error instanceof Error ? error.name : 'UnknownError');
    return Response.json({ error: '수집 서버에 연결하지 못했습니다. 이전 결과를 확인하거나 다시 시도해주세요.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
