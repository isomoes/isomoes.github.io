import { slug as slugify } from 'github-slugger'

type PostWithLocaleAndTags = {
  locale: string
  tags?: string[]
}

export function getTagCounts(posts: { tags?: string[] }[]) {
  return posts.reduce<Record<string, number>>((counts, post) => {
    for (const tag of post.tags ?? []) {
      const tagSlug = slugify(tag)
      counts[tagSlug] = (counts[tagSlug] ?? 0) + 1
    }

    return counts
  }, {})
}

export function getAllTagSlugs(posts: { tags?: string[] }[]) {
  return Array.from(new Set(posts.flatMap((post) => (post.tags ?? []).map((tag) => slugify(tag))))).sort()
}

export function getLocalizedTagPosts<T extends PostWithLocaleAndTags>(posts: T[], locale: string, tag: string) {
  return posts.filter(
    (post) => post.locale === locale && post.tags && post.tags.map((value) => slugify(value)).includes(tag)
  )
}

export function getLocalizedTagPaginationParams<T extends PostWithLocaleAndTags>(
  posts: T[],
  locales: readonly string[],
  postsPerPage: number
) {
  return locales.flatMap((locale) => {
    const tagCounts = getTagCounts(posts.filter((post) => post.locale === locale))

    return Object.entries(tagCounts).flatMap(([tag, count]) => {
      const totalPages = Math.ceil(count / postsPerPage)

      return Array.from({ length: totalPages > 1 ? totalPages - 1 : 0 }, (_, index) => ({
        locale,
        tag,
        page: String(index + 2),
      }))
    })
  })
}
