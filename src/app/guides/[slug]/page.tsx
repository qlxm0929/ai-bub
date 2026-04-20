import { guides } from '@/lib/guides';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link href="/guides" className="text-purple-400 hover:text-purple-300 text-sm font-medium mb-6 inline-block transition-colors">
          ← 가이드 목록으로 돌아가기
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl">{guide.icon}</div>
          <div>
            <div className="flex gap-2 mb-2">
              <span className="badge badge-purple text-xs">난이도 {'⭐'.repeat(guide.difficulty)}</span>
              <span className="badge badge-gray text-xs">⏱ {guide.readTime}분 소요</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{guide.title}</h1>
            <p className="text-gray-400 text-lg">{guide.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {guide.steps.map((step, index) => (
          <div key={index} className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm">
                {index + 1}
              </span>
              {step.title}
            </h2>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed ml-11">
              {step.content}
            </div>
            {step.tip && (
              <div className="mt-6 ml-11 p-4 rounded-xl bg-purple-900/20 border border-purple-500/20">
                <div className="flex gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <strong className="text-purple-300 block mb-1 text-sm">에디터의 팁</strong>
                    <p className="text-sm text-purple-200/80 leading-relaxed">{step.tip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
