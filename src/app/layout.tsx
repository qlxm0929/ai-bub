import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'AI 쉽게 - 초보자를 위한 AI 입문 가이드',
  description: 'AI가 처음인 분들을 위한 최신 뉴스, 도구, 가이드, 커뮤니티 리소스를 제공합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
