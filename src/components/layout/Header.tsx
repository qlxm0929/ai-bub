'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: '홈' },
    { href: '/news', label: 'AI 뉴스' },
    { href: '/tools', label: '필수 도구' },
    { href: '/guides', label: '가이드' },
    { href: '/community', label: '🙌 게시판' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/aiel-logo.png" alt="AI.EL Logo" width={32} height={32} className="rounded-md group-hover:scale-105 transition-transform" />
          <span className="font-bold text-lg text-white tracking-widest">AI.EL</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex md:hidden items-center gap-4">
          <Link href="/news" className="text-sm font-medium text-gray-300">뉴스</Link>
          <Link href="/guides" className="text-sm font-medium text-gray-300">가이드</Link>
        </div>
      </div>
    </header>
  );
}
