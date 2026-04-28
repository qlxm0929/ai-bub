import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* 브랜드 + 비공식 큐레이션 안내 */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image src="/aiel-logo.png" alt="AI.EL Logo" width={32} height={32} className="rounded-md group-hover:scale-105 transition-transform opacity-80 group-hover:opacity-100" />
              <span className="font-bold text-lg text-white tracking-widest">AI.EL</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-3">
              무한한 기술의 흐름 속에서도 변치 않는 영감과 지혜를 전달하는 AI 아카이브입니다.
            </p>
            {/* 비공식 큐레이션 면책 */}
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm border-l-2 border-white/10 pl-3">
              본 사이트는 <strong className="text-gray-500">비공식 AI 도구 큐레이션</strong>이며 각 서비스와 제휴 관계가 없습니다.
              소개된 서비스의 기능·요금·무료 여부는 수시로 변동될 수 있으니{' '}
              <strong className="text-gray-500">사용 전 공식 사이트를 반드시 확인하세요.</strong>
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <h3 className="font-semibold text-white mb-4">바로가기</h3>
            <ul className="space-y-3">
              <li><Link href="/news" className="text-sm text-gray-400 hover:text-white transition-colors">AI 뉴스</Link></li>
              <li><Link href="/tools" className="text-sm text-gray-400 hover:text-white transition-colors">필수 도구</Link></li>
              <li><Link href="/guides" className="text-sm text-gray-400 hover:text-white transition-colors">초보자 가이드</Link></li>
              <li><Link href="/community" className="text-sm text-gray-400 hover:text-white transition-colors">커뮤니티</Link></li>
            </ul>
          </div>

          {/* 문의 / 제보 */}
          <div>
            <h3 className="font-semibold text-white mb-4">문의 · 제보</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:feedback@ai-el.kr"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  ✉️ 이메일 문의
                </a>
              </li>
              <li>
                <a
                  href="https://forms.gle/your-form-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  📋 도구 제보하기
                </a>
              </li>
              <li>
                <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">ChatGPT</a>
              </li>
              <li>
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Claude</a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} AI.EL. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center">
            {/* 개인정보 안내 */}
            <span className="text-xs text-gray-600">
              🔒 개인정보를 직접 수집하지 않습니다
            </span>
            <span className="hidden sm:block text-gray-700">·</span>
            <span className="text-xs text-gray-600">Made with 💜 using Next.js</span>
          </div>
        </div>

        {/* 은밀한 디테일 */}
        <div className="mt-6 text-center select-none">
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-20 hover:opacity-40 transition-opacity duration-700 font-mono text-purple-400">
            ∴ v0.∞ · since eon · <span className="not-italic">記憶は消えない</span> · archive://aiel
          </p>
        </div>
      </div>
    </footer>
  );
}
