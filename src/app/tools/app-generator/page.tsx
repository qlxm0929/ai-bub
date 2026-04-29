'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Code, Eye, Sparkles, Send, Loader2, AlertCircle, Key, X, CheckCircle, Copy, Check } from 'lucide-react';
import LoadingEKG from '@/components/ui/LoadingEKG';

// ── 기본 코드 ─────────────────────────────────────────────────────
const DEFAULT_CODE = `function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white/5 backdrop-blur rounded-3xl border border-white/10 p-10 max-w-md w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✨</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">AI App Generator</h1>
        <p className="text-slate-400 mb-8 leading-relaxed text-sm">
          왼쪽에 원하는 UI를 설명해주세요. AI가 코드를 작성하고 즉시 보여줍니다.
        </p>
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
          시작하기
        </button>
      </div>
    </div>
  );
}`;

/** iframe srcdoc 생성 — React + Tailwind + Babel standalone CDN */
function buildSrcdoc(code: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <style>
    body { margin:0; padding:0; font-family: system-ui, sans-serif; }
    #error { display:none; padding:16px; background:#fef2f2; color:#b91c1c; font-size:13px; font-family:monospace; white-space:pre-wrap; }
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="error"></div>
  <script type="text/babel" data-presets="react">
    try {
      ${code}
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch(e) {
      document.getElementById('error').style.display = 'block';
      document.getElementById('error').textContent = '⚠ 렌더링 오류: ' + e.message;
    }
  <\/script>
</body>
</html>`;
}

const LS_KEY = 'aiel_gemini_api_key';

// ── API 키 패널 ───────────────────────────────────────────────────
function ApiKeyPanel({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setInput(localStorage.getItem(LS_KEY) || '');
  }, []);

  const handleSave = () => {
    const v = input.trim();
    if (!v) return;
    localStorage.setItem(LS_KEY, v);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
          <Key className="w-4 h-4" /> 내 Gemini API 키 설정
        </div>
        <button onClick={onClose} className="text-blue-400 hover:text-blue-600"><X className="w-4 h-4" /></button>
      </div>
      <p className="text-xs text-blue-700 leading-relaxed">
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
          Google AI Studio
        </a>에서 무료로 발급. 브라우저에만 저장됩니다.
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
        {input && <button onClick={() => { localStorage.removeItem(LS_KEY); setInput(''); }} className="px-2 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>}
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
  const [srcdoc, setSrcdoc] = useState(() => buildSrcdoc(DEFAULT_CODE));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [showKeyPanel, setShowKeyPanel] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHasKey(!!localStorage.getItem(LS_KEY));
  }, [showKeyPanel]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const apiKey = localStorage.getItem(LS_KEY);
    if (!apiKey) { setShowKeyPanel(true); setError('__NO_KEY__'); return; }

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
        const rawMsg: string = typeof data.error === 'object' ? JSON.stringify(data.error) : (data.error || 'Failed');
        if (rawMsg.includes('quota') || rawMsg.includes('429')) throw new Error('QUOTA_EXCEEDED');
        if (rawMsg.includes('API_KEY') || rawMsg.includes('401')) throw new Error('INVALID_KEY');
        if (rawMsg.includes('503') || rawMsg.includes('UNAVAILABLE')) throw new Error('SERVICE_UNAVAILABLE');
        throw new Error(rawMsg);
      }

      const generated = (data.code || '').replace(/^```[a-z]*\n?/i, '').replace(/```\s*$/i, '').trim();
      if (!generated) throw new Error('AI가 코드를 반환하지 않았습니다. 다시 시도해보세요.');

      setCode(generated);
      setSrcdoc(buildSrcdoc(generated));
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

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans text-slate-800">
      {/* 사이드바 */}
      <div className="w-full md:w-[360px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm h-full shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold tracking-wider mb-3 uppercase">
            <Sparkles className="w-3 h-3" /> Beta
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI 앱 메이커</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            만들고 싶은 화면을 설명하면 AI가 즉시 코드로 만들어줍니다.
          </p>
        </div>

        <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
          {/* API 키 */}
          {showKeyPanel ? (
            <ApiKeyPanel onClose={() => { setShowKeyPanel(false); setError(''); }} />
          ) : (
            <button
              onClick={() => setShowKeyPanel(true)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm border transition-colors ${
                hasKey ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                {hasKey ? 'API 키 설정됨 ✓' : 'API 키 설정 필요'}
              </div>
              <span className="text-xs opacity-60">변경</span>
            </button>
          )}

          {/* 프롬프트 */}
          <div className="flex-1 flex flex-col min-h-[180px]">
            <label className="text-sm font-semibold text-slate-700 mb-2">프롬프트 입력</label>
            <textarea
              className="w-full flex-1 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 text-slate-700 text-sm leading-relaxed"
              placeholder="예: 다크 모드 주식 차트 대시보드를 만들어줘"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
            />
            <div className="text-[11px] text-slate-400 text-right mt-1.5">Cmd+Enter로 생성</div>
          </div>

          {/* 에러 */}
          {error === '__NO_KEY__' && (
            <div className="p-3 bg-amber-50 rounded-xl text-sm border border-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-800"><Key className="w-4 h-4" /> API 키가 필요합니다</div>
              <p className="text-amber-700 mt-1 text-xs">위에서 Gemini API 키를 먼저 설정해주세요.</p>
            </div>
          )}
          {error === '__INVALID_KEY__' && (
            <div className="p-3 bg-red-50 rounded-xl text-sm border border-red-200">
              <div className="flex items-center gap-2 font-bold text-red-800"><AlertCircle className="w-4 h-4" /> 키가 올바르지 않습니다</div>
              <p className="text-red-700 mt-1 text-xs">키를 다시 확인해주세요.</p>
            </div>
          )}
          {error === '__QUOTA__' && (
            <div className="p-3 bg-amber-50 rounded-xl text-sm border border-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-800"><AlertCircle className="w-4 h-4" /> 할당량 초과</div>
              <p className="text-amber-600 mt-1 text-xs">
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google AI Studio</a>에서 결제 활성화 후 사용하세요.
              </p>
            </div>
          )}
          {error === '__UNAVAILABLE__' && (
            <div className="p-3 bg-orange-50 rounded-xl text-sm border border-orange-200">
              <div className="flex items-center gap-2 font-bold text-orange-800"><AlertCircle className="w-4 h-4" /> AI 서버 혼잡</div>
              <p className="text-orange-700 mt-1 text-xs">잠시 후 다시 시도해주세요.</p>
            </div>
          )}
          {error && !['__NO_KEY__','__QUOTA__','__UNAVAILABLE__','__INVALID_KEY__'].includes(error) && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all flex justify-center items-center gap-2 shadow-md"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />AI 생성 중...</> : <><Send className="w-4 h-4" />UI 생성하기</>}
          </button>
        </div>
      </div>

      {/* 미리보기 / 코드 영역 */}
      <div className="flex-1 h-full flex flex-col min-w-0 relative">
        {/* 탭 바 */}
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
          {viewMode === 'code' && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> 복사됨</> : <><Copy className="w-3.5 h-3.5" /> 코드 복사</>}
            </button>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 relative overflow-hidden">
          {/* EKG 로딩 오버레이 */}
          {loading && (
            <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
              <LoadingEKG width={340} height={90} color="cyan" showLabel={false} />
              <div className="text-center space-y-1">
                <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">AI가 코드를 생성하는 중...</p>
                <p className="text-slate-500 text-xs">잠시만 기다려주세요</p>
              </div>
            </div>
          )}

          {/* 미리보기 iframe */}
          {viewMode === 'preview' && (
            <iframe
              key={srcdoc}
              srcDoc={srcdoc}
              title="AI Generated Preview"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
            />
          )}

          {/* 코드 뷰어 */}
          {viewMode === 'code' && (
            <div className="h-full overflow-auto bg-slate-950 p-6">
              <pre className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
                {code}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
