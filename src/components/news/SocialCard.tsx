import { Bookmark, BookmarkCheck, ExternalLink, Camera, MessageCircle } from 'lucide-react';
import { platforms, topics, type SocialPost } from '@/lib/social/catalog';

type Props = { readonly post: SocialPost; readonly saved: boolean; readonly onSave: () => void };
export function SocialCard({ post, saved, onSave }: Props) {
  const Icon = post.platform === 'instagram' ? Camera : MessageCircle;
  const freeClaim = post.topics.includes('offers');
  return <article className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-2 text-sm text-purple-300"><Icon size={16} aria-hidden="true" />{platforms[post.platform]}</span>
      <button type="button" aria-label={`${post.title} ${saved ? '저장 해제' : '저장'}`} aria-pressed={saved} onClick={onSave}
        className="min-h-11 px-2 inline-flex items-center gap-1 text-sm text-gray-200 hover:text-purple-300 focus-visible:outline-2 focus-visible:outline-purple-300 rounded-lg">
        {saved ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}{saved ? '저장됨' : '저장'}
      </button>
    </div>
    <div><p className="text-xs text-gray-400 mb-2">{post.author ? `@${post.author}` : '작성자 미확인'}</p><h2 className="font-semibold text-lg leading-relaxed text-white break-words">{post.title}</h2></div>
    <p className="text-xs text-cyan-300">{post.origin === 'search' ? '자동 수집 · 검색 발췌' : '직접 선별한 글'}</p>
    <p className="text-sm text-gray-300 leading-relaxed break-words">{post.summary}</p>
    <ul aria-label="활용 분야" className="flex flex-wrap gap-2">
      {post.topics.map((topic) => <li key={topic} className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-300">{topics[topic]}</li>)}
    </ul>
    <div className={`rounded-xl border p-3 text-xs leading-relaxed ${freeClaim ? 'border-amber-400/20 bg-amber-400/5 text-amber-200' : 'border-white/10 text-gray-400'}`}>
      <p className="font-medium mb-1">{freeClaim ? 'SNS 무료 언급 · 현재 조건 미확인' : post.origin === 'search' ? '검색 발췌 · 원문 전체 미확인' : '게시 내용 확인 · 성능·가격 검증 아님'}</p>
      <p>{post.caveat}</p>
    </div>
    <div className="mt-auto pt-2 border-t border-white/10 space-y-2">
      <p className="text-xs text-gray-400">게시 {post.publishedOn?.replaceAll('-', '.') ?? '미확인'} · {post.origin === 'search' ? '검색 확인' : '원문 확인'} {post.checkedOn.replaceAll('-', '.')}</p>
      <a href={post.url} target="_blank" rel="noopener noreferrer" className="min-h-11 inline-flex items-center gap-2 text-sm text-cyan-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-cyan-300 rounded">
        {platforms[post.platform]} 원문 보기<ExternalLink size={14} aria-hidden="true" />
      </a>
    </div>
  </article>;
}
