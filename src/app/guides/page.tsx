import { guides } from '@/lib/guides';
import Link from 'next/link';

export default function GuidesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="badge badge-orange mb-3">초보자 가이드</div>
        <h1 className="text-4xl font-black text-white mb-4">AI, 이렇게 시작하세요</h1>
        <p className="text-gray-400 text-lg">
          가입부터 첫 질문까지, 누구나 따라할 수 있게 단계별로 친절하게 알려드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, i) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="glass-card p-6 flex flex-col group cursor-pointer relative overflow-hidden"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
              {guide.icon}
            </div>
            
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">
              {guide.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
              {guide.title}
            </h3>
            
            <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1 relative z-10">
              {guide.description}
            </p>
            
            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto relative z-10">
              <div className="flex items-center gap-2">
                <span className="badge badge-gray text-xs bg-black/40">⏱ {guide.readTime}분 소요</span>
                <div className="flex text-[10px] text-yellow-400">
                  {'⭐'.repeat(guide.difficulty)}
                </div>
              </div>
              <span className="text-sm font-medium text-orange-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                읽어보기 →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
