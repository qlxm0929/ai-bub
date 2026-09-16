import type { DiscoveryItem, Snapshot } from './schema';

export function canonicalUrl(value: string): string {
  const url = new URL(value);
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith('utm_') || ['ref', 'source', 'fbclid'].includes(key)) url.searchParams.delete(key);
  }
  return url.toString();
}

export function groupItems(items: readonly DiscoveryItem[]): DiscoveryItem[] {
  const groups = new Map<string, DiscoveryItem>();
  const ordered = [...items].sort((a, b) => (b.evidence[0].publishedAt ?? '').localeCompare(a.evidence[0].publishedAt ?? ''));
  for (const item of ordered) {
    const previous = groups.get(item.id);
    if (!previous) { groups.set(item.id, item); continue; }
    const evidence = [...new Map([...previous.evidence, ...item.evidence].map((entry) => [entry.url, entry])).values()];
    groups.set(item.id, {
      ...previous, evidence,
      uses: [...new Set([...previous.uses, ...item.uses])],
      price: item.price.checkedAt ? item.price : previous.price,
    });
  }
  return [...groups.values()];
}

export function restoreFailedSources(current: Snapshot, previous: Snapshot | null): Snapshot {
  if (!previous) return current;
  const failed = new Set(current.sources.filter((s) => s.status === 'failed').map((s) => s.id));
  const retained = previous.items.flatMap((item) => {
    const evidence = item.evidence.filter((entry) => failed.has(entry.sourceId));
    return evidence.length ? [{ ...item, evidence }] : [];
  });
  return {
    ...current,
    sources: current.sources.map((source) => ({ ...source,
      lastSuccessAt: source.status === 'failed'
        ? previous.sources.find((old) => old.id === source.id)?.lastSuccessAt ?? null : source.lastSuccessAt,
    })),
    items: groupItems([...current.items, ...retained]),
  };
}

export function matchesFilter(item: DiscoveryItem, query: string, category: string, use: string): boolean {
  const text = [item.product, item.title, item.summary, ...item.uses, ...item.evidence.map((e) => e.title)].join(' ').toLocaleLowerCase();
  return text.includes(query.trim().toLocaleLowerCase()) && (use === 'all' || item.uses.includes(use)) &&
    (category === 'all' || (category === 'free' || category === 'trial' ? item.price.kind === category : item.category === category));
}
