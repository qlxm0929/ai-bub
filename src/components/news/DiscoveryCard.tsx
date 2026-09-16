import { Bookmark, CheckCircle2, ExternalLink, FileQuestion } from 'lucide-react';
import type { DiscoveryItem } from '@/lib/discovery/schema';

export function displayDate(value: string | null): string {
  return value ? new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', year: 'numeric' }) : '미확인';
}
const linkStyle = 'inline-flex min-h-11 items-center gap-1 text-sm text-cyan-300 hover:underline focus-visible:outline-2 focus-visible:outline-cyan-300 rounded';
export function DiscoveryCard({ item, saved, stale, onSave }: {
  readonly item: DiscoveryItem; readonly saved: boolean; readonly stale: boolean; readonly onSave: () => void;
}) {
  const verified = item.price.checkedAt !== null;
  return (
    <article className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-purple-300 mb-2">{item.category === 'new' ? '신규 AI · 제목 기준 자동 분류' : item.category === 'offer' ? '무료 혜택' : item.category === 'news' ? 'AI 소식' : '기능 업데이트'}</p>
          <h2 className="text-xl font-bold break-words">{item.product}</h2>
        </div>
        <button onClick={onSave} aria-pressed={saved} aria-label={`${item.product} ${saved ? '저장 해제' : '저장'}`}
          className="shrink-0 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm text-purple-200 hover:bg-purple-500/20 focus-visible:outline-2 focus-visible:outline-purple-300">
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />{saved ? '저장됨' : '저장'}
        </button>
      </div>
      {stale && <p className="text-xs text-amber-300">이전 수집·저장 결과 · 현재 조건은 다시 확인해주세요.</p>}
      <h3 className="text-sm font-semibold leading-relaxed break-words">{item.title}</h3>
      <div>
        <p className="text-sm text-gray-300 leading-relaxed break-words">{item.summary}</p>
        <p className="mt-2 text-xs text-gray-400">{item.summaryKind === 'ai' ? 'AI 한국어 요약 · 세부 내용은 원문 확인' : item.summaryKind === 'translated' ? '원문 발췌 · 한국어 자동 번역' : item.summaryKind === 'original' ? '번역 미확인 · 원문 발췌' : '한국어 안내'}</p>
      </div>
      <p className="text-sm text-gray-300"><span className="text-gray-400">쓸 만한 용도</span> · {item.uses.join(' · ')} <span className="text-xs text-gray-400">(탐색용 분류)</span></p>
      <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-3 text-sm">
        <p className={`flex items-center gap-2 font-medium ${verified && !stale ? 'text-emerald-300' : 'text-amber-300'}`}>
          {verified ? <CheckCircle2 size={16} aria-hidden="true" /> : <FileQuestion size={16} aria-hidden="true" />}
          {verified ? stale ? '이전 공식 무료 조건 확인' : '공식 무료 조건 확인' : '가격 조건 미확인'}
        </p>
        <p className="text-gray-200 leading-relaxed">{item.price.scope}</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs leading-relaxed">
          <dt className="text-gray-400">카드 등록</dt><dd>{item.price.card}</dd>
          <dt className="text-gray-400">체험 종료</dt><dd>{item.price.expiry}</dd>
          <dt className="text-gray-400">추가 비용</dt><dd>{item.price.extra}</dd>
          <dt className="text-gray-400">오픈소스</dt><dd>{item.openSource}</dd>
        </dl>
        {item.price.evidenceUrl && <div className="text-xs text-gray-400">
          <a className={linkStyle} href={item.price.evidenceUrl} target="_blank" rel="noopener noreferrer">무료 조건 근거 <ExternalLink size={13} aria-hidden="true" /></a>
          <p>확인 문구: “{item.price.evidenceQuote}”</p>
          <p className="mt-1">가격 확인: {displayDate(item.price.checkedAt)} KST</p>
        </div>}
      </div>
      <details className="text-xs text-gray-300 mt-auto">
        <summary className="cursor-pointer min-h-11 py-3 focus-visible:outline-2 focus-visible:outline-cyan-300">출처·게시일·확인 상태 ({item.evidence.length}개 원문)</summary>
        <ul className="space-y-3 border-t border-white/10 pt-3">
          {item.evidence.map((entry) => <li key={entry.url} className="break-words">
            <p className="text-cyan-200">{entry.kind === 'official' ? '공식 발표·문서' : entry.kind === 'developer' ? '개발자 배포' : '소개글만 확인'} · {entry.sourceName}</p>
            <a href={entry.url} className={linkStyle} target="_blank" rel="noopener noreferrer">{entry.title}</a>
            <p>게시일: {displayDate(entry.publishedAt)}</p>
            <p>원문 확인: {displayDate(entry.fetchedAt)} KST</p>
          </li>)}
        </ul>
      </details>
      <div className="flex flex-wrap gap-x-5 border-t border-white/10 pt-2">
        <a className={linkStyle} href={item.evidence[0].url} target="_blank" rel="noopener noreferrer">원문 보기 <ExternalLink size={14} aria-hidden="true" /></a>
        <a className={linkStyle} href={item.officialUrl} target="_blank" rel="noopener noreferrer">공식 사이트 <ExternalLink size={14} aria-hidden="true" /></a>
      </div>
    </article>
  );
}
