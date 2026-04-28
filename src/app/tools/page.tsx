// Server Component — 'use client' 없음
// Product Hunt 데이터를 서버에서 미리 가져와 초기 HTML에 포함시킴
import { fetchNewTools } from '@/lib/newtools';
import ToolsClient from './ToolsClient';

export const revalidate = 3600; // 1시간마다 재검증

export default async function ToolsPage() {
  let initialNewTools = [];
  let fetchFailed = false;

  try {
    initialNewTools = await fetchNewTools(12);
  } catch (e) {
    console.error('[ToolsPage] Product Hunt fetch failed:', e);
    fetchFailed = true;
  }

  return (
    <ToolsClient
      initialNewTools={initialNewTools}
      fetchFailed={fetchFailed}
    />
  );
}
