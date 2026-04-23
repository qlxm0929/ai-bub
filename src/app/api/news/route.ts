import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/rss';

// 1분마다 자동 갱신 (실시간 업데이트 용)
export const revalidate = 60;

export async function GET() {
  try {
    const news = await fetchNews(100); // 전체 뉴스 페이지용
    return NextResponse.json({ 
      news,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json({ news: [], error: 'Failed to fetch news' }, { status: 500 });
  }
}
