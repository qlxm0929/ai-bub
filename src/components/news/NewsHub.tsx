'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
const DiscoveryFeed = dynamic(() => import('./DiscoveryFeed').then((module) => module.DiscoveryFeed), { ssr: false, loading: () => <p role="status" className="p-8 text-gray-300">AI 소식·무료 혜택을 불러오는 중입니다.</p> });

const SocialFeed = dynamic(() => import('./SocialFeed').then((module) => module.SocialFeed), { ssr: false, loading: () => <p role="status" className="p-8 text-gray-300">SNS AI 게시글을 불러오는 중입니다.</p> });

const LegacyNews = dynamic(() => import('./LegacyNews'), { loading: () => <p role="status" className="p-8 text-gray-300">뉴스 화면을 불러오는 중입니다.</p> });
export function NewsHub() {
  const params = useSearchParams();
  const tab = params.get('tab');
  const legacy = tab === 'news' || tab === 'youtube';
  const social = tab === 'social';
  const links = [
    { href: '/news', name: 'AI 소식·무료 혜택', active: !legacy && !social },
    { href: '/news?tab=social', name: 'SNS AI', active: social },
    { href: '/news?tab=news', name: 'AI 뉴스', active: tab === 'news' },
    { href: '/news?tab=youtube', name: 'YouTube', active: tab === 'youtube' },
  ];
  return <div className="news-hub max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <nav aria-label="뉴스 메뉴" className="flex flex-wrap gap-2 border-b border-white/10 pb-5 mb-8">
      {links.map((link) => <Link key={link.href} href={link.href} aria-current={link.active ? 'page' : undefined}
        className={`min-h-11 inline-flex items-center rounded-lg px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-purple-300 ${link.active ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}>{link.name}</Link>)}
    </nav>
    {social ? <SocialFeed /> : legacy ? <LegacyNews key={tab} /> : <DiscoveryFeed />}
  </div>;
}
