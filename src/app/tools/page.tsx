import { tools, categories } from '@/lib/tools';
import Link from 'next/link';

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="badge badge-green mb-3">AI 도구 모음</div>
        <h1 className="text-4xl font-black text-white mb-4">어떤 도구가 필요하신가요?</h1>
        <p className="text-gray-400 text-lg">
          초보자도 쓰기 좋은 검증된 AI 도구들을 모아두었어요.
        </p>
      </div>

      <div className="space-y-16">
        {categories.map((category) => {
          const categoryTools = tools.filter((t) => t.category === category);
          
          return (
            <section key={category}>
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <h2 className="text-2xl font-bold text-white">{category}</h2>
                <span className="badge badge-gray">{categoryTools.length}개</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryTools.map((tool, i) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-6 group cursor-pointer relative overflow-hidden"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                        {tool.categoryIcon}
                      </div>
                      <div className="text-right">
                        <span className={`badge text-xs mb-1 ${tool.hasFree ? 'badge-green' : 'badge-orange'}`}>
                          {tool.hasFree ? '무료 플랜 있음' : '유료만 있음'}
                        </span>
                        <div className="flex justify-end text-xs text-yellow-400 tracking-widest">
                          {'⭐'.repeat(tool.difficulty)}
                          <span className="text-gray-600 ml-1">난이도</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                      {tool.name} <span className="text-sm text-gray-500 font-normal ml-1">({tool.nameKo})</span>
                    </h3>
                    
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                      {tool.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {tool.tags.map((tag) => (
                        <span key={tag} className="badge badge-gray text-xs bg-black/40">#{tag}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
