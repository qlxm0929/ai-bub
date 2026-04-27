'use client';

import React, { useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react';
import { Code, Eye, Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';

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

export default function AppGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [sandpackKey, setSandpackKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    // 결과물 생성 시 무조건 미리보기 모드로 전환
    setViewMode('preview');
    
    try {
      const res = await fetch('/api/generate-ui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        const rawMsg: string = typeof data.error === 'object'
          ? JSON.stringify(data.error)
          : (data.error || 'Failed to generate UI');
        // Detect quota/rate-limit errors and show a friendly message
        if (rawMsg.includes('quota') || rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429')) {
          throw new Error('QUOTA_EXCEEDED');
        }
        if (rawMsg.includes('UNAVAILABLE') || rawMsg.includes('503')) {
          throw new Error('SERVICE_UNAVAILABLE');
        }
        throw new Error(rawMsg);
      }
      
      setCode(data.code);
      setSandpackKey(k => k + 1);  // force remount so preview refreshes
    } catch (err: any) {
      const msg: string = err.message || '';
      if (msg === 'QUOTA_EXCEEDED') {
        setError('__QUOTA__');
      } else if (msg === 'SERVICE_UNAVAILABLE') {
        setError('__UNAVAILABLE__');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans text-slate-800">
      {/* Sidebar / Input Area */}
      <div className="w-full md:w-[380px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm h-full shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold tracking-wider mb-3 uppercase">
            <Sparkles className="w-3 h-3" /> Beta
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AI 앱 메이커
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            만들고 싶은 화면을 말해주세요. AI가 코드를 작성하고 즉시 보여줍니다.
          </p>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="flex-1 flex flex-col min-h-[250px]">
            <label className="text-sm font-semibold text-slate-700 mb-2">프롬프트 입력</label>
            <textarea
              className="w-full flex-1 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 text-slate-700 text-sm leading-relaxed"
              placeholder="예시: 다크 모드가 적용된 대시보드를 만들어줘. 왼쪽에는 메뉴 바가 있고, 중앙에는 통계를 보여주는 3개의 카드가 있어야 해."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleGenerate();
                }
              }}
            />
            <div className="text-[11px] text-slate-400 text-right mt-2">
              Cmd + Enter (또는 Ctrl + Enter) 로 생성
            </div>
          </div>
          
          {error === '__QUOTA__' && (
            <div className="p-4 bg-amber-50 rounded-xl text-sm border border-amber-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                API 무료 할당량 소진
              </div>
              <p className="text-amber-700 leading-relaxed">
                오늘의 Gemini 무료 요청 횟수를 모두 사용했습니다.
              </p>
              <p className="text-amber-600 text-xs leading-relaxed">
                ① 내일(자정 후) 다시 시도하거나<br/>
                ② <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google AI Studio</a>에서 결제를 활성화하면 즉시 사용 가능합니다.
              </p>
            </div>
          )}
          {error === '__UNAVAILABLE__' && (
            <div className="p-4 bg-orange-50 rounded-xl text-sm border border-orange-200 shadow-sm space-y-1">
              <div className="flex items-center gap-2 font-bold text-orange-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                AI 서버 일시 혼잡
              </div>
              <p className="text-orange-700 leading-relaxed">잠시 후 다시 시도해 주세요. (보통 1분 이내에 해소됩니다)</p>
            </div>
          )}
          {error && error !== '__QUOTA__' && error !== '__UNAVAILABLE__' && (
            <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2.5 shadow-sm">
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
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                UI 생성하기
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Area / Sandpack */}
      <div className="flex-1 h-full bg-slate-100 flex flex-col min-w-0 relative">
        {/* Top Bar for View Toggle */}
        <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'preview' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              결과물 미리보기
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'code' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Code className="w-4 h-4" />
              코드 보기
            </button>
          </div>
          
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            {viewMode === 'preview' ? 'Live Preview' : 'React Code (Tailwind CSS)'}
          </div>
        </div>

        {/* Sandpack Provider & Layout */}
        <div className="flex-1 relative overflow-hidden bg-white">
          <SandpackProvider
            key={sandpackKey}
            template="react-ts"
            theme="light"
            files={{
              '/App.tsx': code,
              '/index.tsx': INDEX_TSX,
            }}
            customSetup={{
              dependencies: {
                "react": "^18.0.0",
                "react-dom": "^18.0.0",
                "lucide-react": "latest"
              }
            }}
          >
            <SandpackLayout className="!border-0 !rounded-none !h-full bg-transparent flex flex-col">
              {viewMode === 'preview' ? (
                <SandpackPreview 
                  showNavigator={true} 
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                  className="flex-1 w-full" 
                />
              ) : (
                <SandpackCodeEditor 
                  showTabs={false} 
                  showLineNumbers={true}
                  showReadOnly={false}
                  className="flex-1 w-full text-sm" 
                />
              )}
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
    </div>
  );
}
