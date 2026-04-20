import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <img src="/aiel-logo.png" alt="AI.EL Logo" className="w-8 h-8 rounded-md group-hover:scale-105 transition-transform opacity-80 group-hover:opacity-100" />
              <span className="font-bold text-lg text-white tracking-widest">AI.EL</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              사라지지 않는 전생의 기억.<br/>
              무한한 기술의 흐름 속에서도 변치 않는 영감과 지혜를 전달하는 AI 아카이브입니다.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">바로가기</h3>
            <ul className="space-y-3">
              <li><Link href="/news" className="text-sm text-gray-400 hover:text-white transition-colors">AI 뉴스</Link></li>
              <li><Link href="/tools" className="text-sm text-gray-400 hover:text-white transition-colors">필수 도구</Link></li>
              <li><Link href="/guides" className="text-sm text-gray-400 hover:text-white transition-colors">초보자 가이드</Link></li>
              <li><Link href="/community" className="text-sm text-gray-400 hover:text-white transition-colors">커뮤니티</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">추천 링크</h3>
            <ul className="space-y-3">
              <li><a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">ChatGPT</a></li>
              <li><a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Claude</a></li>
              <li><a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">GitHub Copilot</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} AI.EL. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-gray-600">Made with 💜 using Next.js & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
