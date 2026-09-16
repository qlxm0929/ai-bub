import type { Snapshot } from '@/lib/discovery/schema';
import { displayDate } from './DiscoveryCard';

export function SourcePanel({ snapshot, historical }: { readonly snapshot: Snapshot; readonly historical: boolean }) {
  const success = snapshot.sources.filter((source) => source.status === 'success' && source.id !== 'korean-summary');
  const failed = snapshot.sources.filter((source) => source.status === 'failed');
  const disconnected = snapshot.sources.filter((source) => source.status === 'unconnected');
  const latest = snapshot.sources.filter((s) => s.id !== 'korean-summary').flatMap((s) => s.lastSuccessAt ? [s.lastSuccessAt] : []).sort().at(-1) ?? null;
  return <details className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm">
    <summary className="cursor-pointer text-gray-200 focus-visible:outline-2 focus-visible:outline-cyan-300 min-h-11 leading-relaxed">
      {historical ? '이전 수집 상태' : '수집 상태'} · 성공 {success.length} · 실패 {failed.length} · 미연결 {disconnected.length}
      <span className="block text-xs text-gray-400 mt-1">마지막 성공: {displayDate(latest)}{latest ? ' KST' : ''} · 소스별 상세 보기</span>
    </summary>
    <ul className="mt-4 divide-y divide-white/10">
      {snapshot.sources.map((source) => <li key={source.id} className="py-3 flex flex-col gap-1">
        <p><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-4">{source.name}</a>
          <span className={`ml-3 ${source.status === 'success' ? 'text-emerald-300' : source.status === 'failed' ? 'text-amber-300' : 'text-gray-400'}`}>
            {source.status === 'success' ? `성공 · ${source.count}개` : source.status === 'failed' ? '조회 실패' : '미연결'}
          </span></p>
        <p className="text-xs text-gray-300">{source.message}</p>
        {source.attemptedAt && <p className="text-xs text-gray-400">최근 시도: {displayDate(source.attemptedAt)} · 마지막 성공: {displayDate(source.lastSuccessAt)} KST</p>}
      </li>)}
    </ul>
  </details>;
}
