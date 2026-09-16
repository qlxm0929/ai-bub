import type { SocialSnapshot } from './schema';

export function mergeSocial(previous: SocialSnapshot | null, incoming: SocialSnapshot): SocialSnapshot {
  const failed = incoming.sources.filter((source) => source.status !== 'success').map((source) => source.platform);
  return { ...incoming,
    posts: [...incoming.posts, ...(previous?.posts.filter((post) => failed.includes(post.platform)) ?? [])],
    sources: incoming.sources.map((source) => source.status === 'success' ? source : {
      ...source, lastSuccessAt: previous?.sources.find((old) => old.platform === source.platform)?.lastSuccessAt ?? null,
    }),
  };
}
