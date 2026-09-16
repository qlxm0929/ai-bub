'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ky from 'ky';
import { z } from 'zod';
import { mergeSocial } from '@/lib/social/merge';
import { socialPosts, type SocialPost } from '@/lib/social/catalog';
import { socialPostSchema, socialResponseSchema, socialSnapshotSchema } from '@/lib/social/schema';

const snapshotKey = 'aiel-social-snapshot-v1';
const savedKey = 'aiel-social-saved-posts-v1';
function readStored() {
  try {
    const snapshot = socialSnapshotSchema.safeParse(JSON.parse(localStorage.getItem(snapshotKey) ?? 'null'));
    const stored = z.array(socialPostSchema).max(200).safeParse(JSON.parse(localStorage.getItem(savedKey) ?? '[]'));
    const legacy = z.array(z.string()).max(200).safeParse(JSON.parse(localStorage.getItem('aiel-social-saved-v1') ?? '[]'));
    const saved = new Map<string, SocialPost>((stored.success ? stored.data : []).map((post) => [post.id, post]));
    if (legacy.success) for (const id of legacy.data) { const post = socialPosts.find((post) => post.id === id); if (post) saved.set(id, post); }
    return { snapshot: snapshot.success ? snapshot.data : null, saved: [...saved.values()], error: null };
  } catch {
    return { snapshot: null, saved: [], error: '브라우저에 저장한 자료를 읽지 못했습니다.' };
  }
}
export function useSocial() {
  const [initial] = useState(readStored);
  const [snapshot, setSnapshot] = useState(initial.snapshot);
  const [saved, setSaved] = useState<SocialPost[]>(initial.saved);
  const [error, setError] = useState<string | null>(initial.error);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now);
  const current = useRef(snapshot);
  const busy = useRef(false);
  const refresh = useCallback(async () => {
    if (busy.current) return;
    busy.current = true; setLoading(true); setError(null);
    try {
      const response = await ky.get('/api/social', { timeout: 28000, retry: 0, throwHttpErrors: false }).json<unknown>();
      const parsed = socialResponseSchema.parse(response);
      const next = mergeSocial(current.current, parsed.snapshot);
      current.current = next; setSnapshot(next);
      const success = next.sources.filter((source) => source.status === 'success').length;
      setNotice(parsed.delivery === 'unconnected' ? '자동 수집 미연결 · 기존 선별 글을 표시합니다.'
        : success === 0 ? '새 수집에 실패했습니다. 이전 수집 결과와 선별 글을 표시합니다.'
        : success < 2 ? '일부 수집 실패 · 실패한 플랫폼은 이전 결과를 유지합니다.'
        : parsed.delivery === 'cached' ? '10분 수집 간격 안의 저장 결과입니다.' : '공개 검색 조회를 완료했습니다.');
      try { localStorage.setItem(snapshotKey, JSON.stringify(next)); }
      catch { setError('조회는 완료했지만 브라우저에 결과를 보관하지 못했습니다.'); }
    } catch {
      setNotice('새 수집에 실패했습니다. 이전 수집 결과를 표시합니다.');
      if (current.current) {
        const previous = { ...current.current, sources: current.current.sources.map((source) => ({ ...source, status: 'failed' as const, message: '수집 서버 응답을 확인하지 못했습니다.' })) };
        current.current = previous; setSnapshot(previous);
      }
      setError('새 수집에 실패했습니다. 화면에 남은 자료는 이전 결과입니다. 잠시 후 다시 시도해주세요.');
    } finally { busy.current = false; setLoading(false); setNow(Date.now()); }
  }, []);
  useEffect(() => { void refresh(); const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, [refresh]);
  function toggleSaved(post: SocialPost) {
    const next = saved.some((item) => item.id === post.id) ? saved.filter((item) => item.id !== post.id) : [...saved, post];
    if (next.length > 200) { setError('저장한 글이 200개입니다. 일부를 해제한 뒤 다시 저장해주세요.'); return; }
    try {
      localStorage.setItem(savedKey, JSON.stringify(next));
      localStorage.removeItem('aiel-social-saved-v1');
      setSaved(next); setError(null);
    } catch { setError('저장하지 못했습니다. 브라우저 저장 공간을 확인해주세요.'); }
  }
  const remaining = snapshot ? Math.max(0, Math.ceil((Date.parse(snapshot.nextRefreshAt) - now) / 1000)) : 0;
  return { snapshot, saved, error, notice, loading, remaining, refresh, toggleSaved };
}
