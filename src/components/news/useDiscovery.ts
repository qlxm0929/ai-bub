'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ky from 'ky';
import { z } from 'zod';
import { itemSchema, snapshotSchema, type DiscoveryItem, type Snapshot } from '@/lib/discovery/schema';
import { restoreFailedSources } from '@/lib/discovery/merge';

const SNAPSHOT_KEY = 'aiel-discovery-v1';
const SAVED_KEY = 'aiel-discovery-saved-v1';
const envelopeSchema = z.object({ snapshot: snapshotSchema, delivery: z.enum(['collected', 'cached']) });
const savedSchema = z.array(itemSchema).max(200);

function loadSnapshot(): Snapshot | null {
  const raw = localStorage.getItem(SNAPSHOT_KEY);
  if (!raw) return null;
  const parsed = snapshotSchema.safeParse(JSON.parse(raw));
  return parsed.success ? parsed.data : null;
}
function fingerprint(item: DiscoveryItem): string {
  return JSON.stringify([item.title, item.summary, item.price.scope, item.price.kind, item.evidence.map((e) => e.url)]);
}
export function useDiscovery() {
  const [initial] = useState(() => {
    try {
      const snapshot = loadSnapshot();
      const raw = localStorage.getItem(SAVED_KEY);
      const parsed = savedSchema.safeParse(raw ? JSON.parse(raw) : []);
      return { snapshot, saved: parsed.success ? parsed.data : [], error: parsed.success ? '' : '저장 항목의 형식을 읽을 수 없습니다.' };
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return { snapshot: null, saved: [], error: '브라우저 저장소를 읽지 못했습니다. 저장 기능이 제한될 수 있습니다.' };
    }
  });
  const [snapshot, setSnapshot] = useState<Snapshot | null>(initial.snapshot);
  const [saved, setSaved] = useState<DiscoveryItem[]>(initial.saved);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState('');
  const [storageError, setStorageError] = useState(initial.error);
  const [notice, setNotice] = useState('원본 소스를 확인하고 있습니다.');
  const [now, setNow] = useState(0);
  const previous = useRef<Snapshot | null>(initial.snapshot);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setNetworkError('');
    try {
      const response = await ky.get('/api/discovery', { timeout: 55000, retry: 0, cache: 'no-store', throwHttpErrors: false });
      const result = envelopeSchema.safeParse(await response.json());
      if (!result.success) throw new Error('수집 응답을 확인할 수 없습니다.');
      const { snapshot: incoming, delivery } = result.data;
      const old = previous.current;
      const merged = restoreFailedSources(incoming, old);
      const newCount = incoming.items.filter((item) => old && !old.items.some((entry) => entry.id === item.id)).length;
      const changedCount = incoming.items.filter((item) => {
        const prior = old?.items.find((entry) => entry.id === item.id);
        return prior && fingerprint(prior) !== fingerprint(item);
      }).length;
      const successes = incoming.sources.filter((source) => source.status === 'success' && source.id !== 'korean-summary').length;
      setNotice(successes === 0 ? '이번 수집에 성공한 소스가 없습니다.'
        : delivery === 'cached' ? '최근 수집 결과를 재사용했습니다. 아래 시각 이후 다시 원본을 조회합니다.'
        : `원본 조회 완료 · ${successes}개 소스 성공${old ? ` · 새 제품 ${newCount}개 · 변경 ${changedCount}개` : ''}`);
      previous.current = merged;
      setSnapshot(merged);
      try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(merged)); }
      catch (error) { if (error instanceof Error) setStorageError('이 브라우저에 수집 결과를 보관하지 못했습니다.'); else throw error; }
    } catch (error) {
      setNetworkError(error instanceof Error ? '수집 서버에 연결하지 못했습니다. 이전 수집 결과가 있으면 표시합니다.' : '수집 요청이 실패했습니다.');
      setNotice('최신 정보 확인 실패');
    } finally {
      inFlight.current = false;
      setLoading(false);
      setNow(Date.now());
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  function toggleSaved(item: DiscoveryItem) {
    const next = saved.some((entry) => entry.id === item.id) ? saved.filter((entry) => entry.id !== item.id) : [...saved, item];
    if (next.length > 200) { setStorageError('저장 항목은 최대 200개입니다. 기존 항목을 해제한 뒤 저장해주세요.'); return; }
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      setSaved(next);
      setStorageError('');
    } catch (error) {
      if (error instanceof Error) setStorageError('저장하지 못했습니다. 브라우저 저장 공간과 설정을 확인해주세요.');
      else throw error;
    }
  }
  const cooldown = snapshot ? Math.max(0, Math.ceil((Date.parse(snapshot.nextRefreshAt) - now) / 1000)) : 0;
  return { snapshot, saved, loading, networkError, storageError, notice, refresh, toggleSaved, cooldown };
}
