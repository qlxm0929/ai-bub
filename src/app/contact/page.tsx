'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'done' | 'error';
type Type = '링크 오류' | '설명 오류' | '도구 제보' | '기타';

const TYPES: Type[] = ['링크 오류', '설명 오류', '도구 제보', '기타'];

export default function ContactPage() {
  const [type, setType] = useState<Type>('도구 제보');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <div className="badge badge-green mb-3">문의 · 제보</div>
        <h1 className="text-4xl font-black text-white mb-4">의견을 보내주세요</h1>
        <p className="text-gray-400 leading-relaxed">
          링크가 깨졌거나 설명이 틀렸거나, 넣었으면 하는 도구가 있으면 알려주세요.
          작은 피드백이 사이트를 더 좋게 만듭니다.
        </p>
      </div>

      {status === 'done' ? (
        <div className="glass-card p-10 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-white mb-2">제보해주셔서 감사합니다!</h2>
          <p className="text-gray-400 text-sm mb-6">빠르게 검토하고 반영할게요.</p>
          <button
            onClick={() => { setStatus('idle'); setContent(''); }}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors"
          >
            한 건 더 보내기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          {/* 유형 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">유형</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    type === t
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              내용
            </label>
            <textarea
              id="content"
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={
                type === '링크 오류' ? '어떤 도구의 링크가 깨졌는지 알려주세요.'
                : type === '설명 오류' ? '어떤 설명이 잘못됐는지, 올바른 내용은 무엇인지 알려주세요.'
                : type === '도구 제보' ? '추가했으면 하는 도구 이름과 링크를 알려주세요.'
                : '자유롭게 의견을 남겨주세요.'
              }
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
              required
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-400">전송에 실패했습니다. 잠시 후 다시 시도해주세요.</p>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || !content.trim()}
            className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold text-white transition-colors"
          >
            {status === 'sending' ? '전송 중...' : '보내기'}
          </button>

          <p className="text-xs text-gray-600 text-center">
            이름·이메일은 수집하지 않습니다. 익명으로 전달됩니다.
          </p>
        </form>
      )}
    </div>
  );
}
