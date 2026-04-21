import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SpaceBackground from '@/components/SpaceBackground';

export const metadata: Metadata = {
  title: 'AI.EL - 최신 AI 아카이브',
  description: '무한한 기술의 흐름 속에서도 변치 않는 영감과 지혜를 전달하는 AI 아카이브입니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-black text-white min-h-screen flex flex-col relative">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
