import { unstable_cache } from 'next/cache';
import { fetchNewsSnapshot } from '@/lib/rss';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
const getNews = unstable_cache(async (minute: number) => {
  void minute;
  return fetchNewsSnapshot(100);
}, ['news-with-source-status-v1'], { revalidate: 60 });

export async function GET() {
  try {
    const result = await getNews(Math.floor(Date.now() / 60000));
    return Response.json(result, {
      status: result.sources.some((source) => source.ok) ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Failed to fetch news:', error instanceof Error ? error.name : 'UnknownError');
    return Response.json({ error: '뉴스 수집에 실패했습니다.' }, { status: 503 });
  }
}
