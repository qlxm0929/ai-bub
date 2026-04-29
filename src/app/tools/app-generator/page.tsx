'use client';

import React, { useState, useEffect } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react';
import { Code, Eye, Sparkles, Send, Loader2, AlertCircle, Key, X, CheckCircle } from 'lucide-react';
import LoadingEKG from '@/components/ui/LoadingEKG';

const DEFAULT_CODE = `import React from 'react';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          AI App Generator
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
          좌측에 원하는 UI를 설명해주세요.
          AI가 Tailwind CSS가 적용된 코드를 생성하여 이곳에 즉시 보여줍니다.
        </p>
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}`;

const INDEX_TSX = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const script = document.createElement('script');
script.src = 'https://cdn.tailwindcss.com';
document.head.appendChild(script);

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(React.createElement(App));
`;

const LS_KEY = 'aiel_gemini_api_key';

// ── API 키 설정 패널 ──────────────────────────────────────────────
function ApiKeyPanel({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(LS_KEY) || '';
    setInput(existing);
  }, []);

  const handleSave = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    localStorage.setItem(LS_KEY, trimmed);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  const handleDelete = () => {
    localStorage.removeItem(LS_KEY);
    setInput('');
  };

  return (
    <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
          <Key className="w-4 h-4" />
          내 Gemini API 키 설정
        </div>
        <button onClick={onClose} className="text-blue-400 hover:text-blue-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-blue-700 leading-relaxed">
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
          className="underline font-semibold">Google AI Studio</a>에서 무료로 발급받은 키를 입력하세요.
        키는 브라우저에만 저장되며 서버로 전송 후 즉시 폐기됩니다.
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="AIza..."
          className="flex-1 px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/30"
        />
        {input && (
          <button onClick={handleDelete} className="px-2 text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button
        onClick={handleSave}
        disabled={!input.trim()}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {saved ? <><CheckCircle className="w-4 h-4" /> 저장됨</> : '저장하고 사용하기'}
      </button>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────
export default function AppGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [sandpackKey, setSandpackKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [showKeyPanel, setShowKeyPanel] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  // localStorage는 클라이언트에서만 접근 가능
  useEffect(() => {
    setHasKey(!!localStorage.getItem(LS_KEY));
  }, [showKeyPanel]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const apiKey = localStorage.getItem(LS_KEY);
    if (!apiKey) {
      setShowKeyPanel(true);
      setError('__NO_KEY__');
      return;
    }

    setLoading(true);
    setError('');
    setViewMode('preview');

    try {
      const res = await fetch('/api/generate-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        const rawMsg: string = typeof data.error === 'object'
          ? JSON.stringify(data.error)
          : (data.error || 'Failed to generate UI');
        if (rawMsg.includes('quota') || rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429')) {
          throw new Error('QUOTA_EXCEEDED');
        }
        if (rawMsg.includes('API_KEY') || rawMsg.includes('invalid') || rawMsg.includes('401')) {
          throw new Error('INVALID_KEY');
        }
        if (rawMsg.includes('UNAVAILABLE') || rawMsg.includes('503')) {
          throw new Error('SERVICE_UNAVAILABLE');
        }
        throw new Error(rawMsg);
      }

      if (!data.code?.trim()) {
        throw new Error('AI가 코드를 반환하지 않았습니다. 프롬프트를 좀 더 구체적으로 작성하고 다시 시도해보세요.');
      }

      setCode(data.code);
      setSandpackKey(k => k + 1);
    } catch (err: any) {
      const msg: string = err.message || '';
      if (msg === 'QUOTA_EXCEEDED') setError('__QUOTA__');
      else if (msg === 'SERVICE_UNAVAILABLE') setError('__UNAVAILABLE__');
      else if (msg === 'INVALID_KEY') setError('__INVALID_KEY__');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans text-slate-800">
      {/* 사이드바 */}
      <div className="w-full md:w-[380px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm h-full shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold tracking-wider mb-3 uppercase">
            <Sparkles className="w-3 h-3" /> Beta
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI 앱 메이커</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            만들고 싶은 화면을 말해주세요. AI가 코드를 작성하고 즉시 보여줍니다.
          </p>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
          {/* API 키 상태 표시 */}
          <div>
            {showKeyPanel ? (
              <ApiKeyPanel onClose={() => { setShowKeyPanel(false); setError(''); }} />
            ) : (
              <button
                onClick={() => setShowKeyPanel(true)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm border transition-colors ${
                  hasKey
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  {hasKey ? 'API 키 설정됨 ✓' : 'API 키 설정 필요'}
                </div>
                <span className="text-xs opacity-60">변경</span>
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-[200px]">
            <label className="text-sm font-semibold text-slate-700 mb-2">프롬프트 입력</label>
            <textarea
              className="w-full flex-1 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 text-slate-700 text-sm leading-relaxed"
              placeholder="예시: 다크 모드 대시보드를 만들어줘. 왼쪽에 메뉴 바, 중앙에 통계 카드 3개."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
            />
            <div className="text-[11px] text-slate-400 text-right mt-2">Cmd+Enter로 생성</div>
          </div>

          {/* 에러 메시지 */}
          {error === '__NO_KEY__' && (
            <div className="p-4 bg-amber-50 rounded-xl text-sm border border-amber-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <Key className="w-4 h-4" /> API 키가 필요합니다
              </div>
              <p className="text-amber-700">위에서 Gemini API 키를 먼저 설정해주세요.</p>
            </div>
          )}
          {error === '__INVALID_KEY__' && (
            <div className="p-4 bg-red-50 rounded-xl text-sm border border-red-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-red-800">
                <AlertCircle className="w-4 h-4" /> API 키가 올바르지 않습니다
              </div>
              <p className="text-red-700">키를 다시 확인하고 업데이트해주세요.</p>
            </div>
          )}
          {error === '__QUOTA__' && (
            <div className="p-4 bg-amber-50 rounded-xl text-sm border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4" /> 할당량 초과
              </div>
              <p className="text-amber-700">해당 키의 무료 할당량을 모두 사용했습니다.</p>
              <p className="text-amber-600 text-xs">
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                  className="underline font-semibold">Google AI Studio</a>에서 결제를 활성화하거나 다른 키를 사용해보세요.
              </p>
            </div>
          )}
          {error === '__UNAVAILABLE__' && (
            <div className="p-4 bg-orange-50 rounded-xl text-sm border border-orange-200">
              <div className="flex items-center gap-2 font-bold text-orange-800">
                <AlertCircle className="w-4 h-4" /> AI 서버 일시 혼잡
              </div>
              <p className="text-orange-700 mt-1">잠시 후 다시 시도해주세요. (보통 1분 이내 해소)</p>
            </div>
          )}
          {error && !['__NO_KEY__', '__QUOTA__', '__UNAVAILABLE__', '__INVALID_KEY__'].includes(error) && (
            <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all flex justify-center items-center gap-2 shadow-md shadow-slate-900/10"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />AI 생성 중...</>
            ) : (
              <><Send className="w-4 h-4" />UI 생성하기</>
            )}
          </button>
        </div>
      </div>

      {/* 미리보기 영역 */}
      <div className="flex-1 h-full bg-slate-100 flex flex-col min-w-0 relative">
        <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" /> 결과물 미리보기
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'code' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Code className="w-4 h-4" /> 코드 보기
            </button>
          </div>
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            {viewMode === 'preview' ? 'Live Preview' : 'React Code (Tailwind CSS)'}
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-white">
          {/* 생성 중 EKG 오버레이 */}
          {loading && (
            <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
              <LoadingEKG width={340} height={90} color="cyan" showLabel={false} />
              <div className="text-center space-y-1">
                <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">
                  AI가 코드를 생성하는 중...
                </p>
                <p className="text-slate-500 text-xs">잠시만 기다려주세요</p>
              </div>
            </div>
          )}
          <SandpackProvider
            key={sandpackKey}
            template="react-ts"
            theme="light"
            files={{ '/App.tsx': code, '/index.tsx': INDEX_TSX }}
            customSetup={{ dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0', 'lucide-react': 'latest' } }}
          >
            <SandpackLayout className="!border-0 !rounded-none !h-full bg-transparent flex flex-col">
              {viewMode === 'preview' ? (
                <SandpackPreview showNavigator={true} showOpenInCodeSandbox={false} showRefreshButton={true} className="flex-1 w-full" />
              ) : (
                <SandpackCodeEditor showTabs={false} showLineNumbers={true} showReadOnly={false} className="flex-1 w-full text-sm" />
              )}
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
    </div>
  );
}
