import { guides, levelConfig } from '@/lib/guides';
import Link from 'next/link';

export default function GuidesPage() {
  const levels = ['초급', '중급', '심화'] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12 text-center sm:text-left">
        <div className="badge badge-orange mb-3">단계별 가이드</div>
        <h1 className="text-4xl font-black text-white mb-4">AI 학습 로드맵</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          초급부터 심화까지 — 나의 수준에 맞는 가이드를 골라 따라해 보세요.
        </p>
      </div>

      {/* 단계 안내 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {levels.map((level) => {
          const cfg = levelConfig[level];
          const count = guides.filter((g) => g.level === level).length;
          return (
            <a key={level} href={`#${level}`}
              className="glass-card p-5 flex items-center gap-4 group cursor-pointer hover:no-underline">
              <span className="text-3xl group-hover:scale-110 transition-transform">{cfg.emoji}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge ${cfg.color} text-xs`}>{cfg.label}</span>
                  <span className="text-xs text-gray-600">{count}개</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{cfg.desc}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* 단계별 섹션 */}
      <div className="space-y-20">
        {levels.map((level) => {
          const cfg = levelConfig[level];
          const levelGuides = guides.filter((g) => g.level === level);

          return (
            <section key={level} id={level}>
              {/* 섹션 헤더 */}
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                <span className="text-4xl">{cfg.emoji}</span>
                <div>
                  <span className={`badge ${cfg.color} text-sm mb-1 block w-fit`}>{cfg.label}</span>
                  <p className="text-sm text-gray-500">{cfg.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levelGuides.map((guide, i) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="glass-card p-6 flex flex-col group cursor-pointer relative overflow-hidden"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {/* 배경 이모지 */}
                    <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 select-none">
                      {guide.icon}
                    </div>

                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left relative z-10">
                      {guide.icon}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors relative z-10">
                      {guide.title}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1 relative z-10">
                      {guide.description}
                    </p>

                    {/* 하단 메타 */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto relative z-10">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="badge badge-gray text-xs bg-black/40">⏱ {guide.readTime}분</span>
                        <span className="text-xs text-gray-600">
                          {'⭐'.repeat(guide.difficulty)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-orange-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        읽기 →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
