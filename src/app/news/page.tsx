import { Suspense } from 'react';
import type { Metadata } from 'next';
import { NewsHub } from '@/components/news/NewsHub';

export const metadata: Metadata = {
  title: 'AI 소식·무료 혜택 | AI.EL',
  description: '공식 발표와 개발자 릴리스, 무료 플랜 조건을 확인하고 관심 있는 AI 도구를 저장하세요.',
};
export default function NewsPage() {
  return <Suspense fallback={<p role="status" className="p-8 text-gray-300">AI 소식을 준비하고 있습니다.</p>}><NewsHub /></Suspense>;
}
