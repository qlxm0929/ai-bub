import { communityResources, resourceTypes } from '@/lib/community';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="badge badge-cyan mb-3">GitHub 커뮤니티</div>
        <h1 className="text-4xl font-black text-white mb-4">개발자들의 AI 리소스</h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          전 세계 개발자들이 공유하는 유용한 프롬프트, AI 에이전트, CI/CD 워크플로우를 모았습니다.<br />
          복사해서 바로 프로젝트에 적용해보세요.
        </p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-white/5 pb-4 overflow-x-auto whitespace-nowrap">
        {resourceTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              type === '전체'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communityResources.map((resource) => (
          <div key={resource.id} className="glass-card p-6 flex flex-col relative group">
            {resource.stars && (
              <div className="absolute top-4 right-4 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                {resource.stars}
              </div>
            )}
            
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center text-3xl font-bold flex-shrink-0 shadow-lg`}>
                {resource.icon}
              </div>
              <div className="pr-12">
                <span className="badge badge-purple text-[10px] mb-2">{resource.typeLabel}</span>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  {resource.titleKo}
                </h3>
                <p className="text-xs text-gray-500 font-mono">{resource.title}</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-4 flex-1">
              {resource.descriptionKo}
            </p>

            <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-5 relative">
              <div className="text-xs font-medium text-gray-400 mb-2">💡 사용 방법</div>
              <p className="text-sm text-gray-300">{resource.usageKo}</p>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
              <a
                href={resource.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs px-4 py-2 flex items-center gap-2 group-hover:bg-purple-600 group-hover:border-purple-600 transition-all"
              >
                GitHub 가기 <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
