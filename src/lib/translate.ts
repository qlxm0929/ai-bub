// 구글 번역 비공개 API (무료, API 키 불필요)
// 소량 사용에 적합 — 뉴스 제목/요약 번역용
export async function translateToKorean(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return text;

  // 이미 한국어가 많이 포함된 경우 번역 스킵
  const koreanCharCount = (text.match(/[\uAC00-\uD7AF]/g) || []).length;
  if (koreanCharCount / text.length > 0.3) return text;

  try {
    const encoded = encodeURIComponent(text.slice(0, 400)); // 길이 제한
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encoded}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      signal: AbortSignal.timeout(4000), // 4초 타임아웃
    });

    if (!res.ok) return text;

    const data = await res.json();
    
    // 구글 번역 응답 구조: [[["번역결과", "원문", ...], ...], ...]
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0]
        .map((chunk: unknown[]) => (Array.isArray(chunk) ? chunk[0] : ''))
        .join('');
      return translated || text;
    }

    return text;
  } catch {
    return text; // 번역 실패 시 원문 반환
  }
}

export async function translateBatch(texts: string[]): Promise<string[]> {
  // 병렬 번역 (최대 5개 동시)
  const results: string[] = [];
  const batchSize = 5;

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const translated = await Promise.all(batch.map((t) => translateToKorean(t)));
    results.push(...translated);
  }

  return results;
}
