import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/rss';

// 30분마다 자동 갱신
export const revalidate = 1800;

export async function GET() {
  try {
    const news = await fetchNews(60); // 전체 뉴스 페이지용
    return NextResponse.json({ 
      news,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json({ news: [], error: 'Failed to fetch news' }, { status: 500 });
  }
}
