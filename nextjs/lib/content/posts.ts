import { locales, type Locale } from '@/lib/i18n/config'

type LocalizedPost = {
  slug: string
  locale: string
  translationKey: string
  draft?: boolean
}

type ContentlayerLikePost = {
  _raw: {
    flattenedPath: string
  }
  locale: string
  translationKey: string
}

type LocalizedBlogSourceFile = {
  flattenedPath: string
  sourceFilePath: string
  frontmatter: {
    locale?: unknown
    translationKey?: unknown
  }
}

type ParsedBlogFlattenedPath = {
  locale: Locale
  slug: string
}

function isSupportedLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function parseBlogFlattenedPath(flattenedPath: string): ParsedBlogFlattenedPath {
  const segments = flattenedPath.split('/')

  if (segments.length < 3 || segments[0] !== 'blog') {
    throw new Error(`Expected blog/<locale>/<slug...> flattened path, received "${flattenedPath}"`)
  }

  const [, localeSegment, ...slugSegments] = segments

  if (!isSupportedLocale(localeSegment)) {
    throw new Error(`Unsupported blog locale "${localeSegment}" in flattened path "${flattenedPath}"`)
  }

  if (slugSegments.length === 0 || slugSegments.some((segment) => segment.length === 0)) {
    throw new Error(`Expected blog/<locale>/<slug...> flattened path, received "${flattenedPath}"`)
  }

  return {
    locale: localeSegment,
    slug: slugSegments.join('/'),
  }
}

export function filterPostsByLocale<T extends LocalizedPost>(posts: T[], locale: string) {
  return posts.filter((post) => post.locale === locale)
}

export function findTranslatedPost<T extends LocalizedPost>(posts: T[], post: T, locale: string) {
  return posts.find(
    (candidate) => candidate.translationKey === post.translationKey && candidate.locale === locale,
  )
}

export function getPostSlugFromFlattenedPath(flattenedPath: string) {
  return parseBlogFlattenedPath(flattenedPath).slug
}

export function getPathLocale(flattenedPath: string) {
  return parseBlogFlattenedPath(flattenedPath).locale
}

export function assertLocalizedBlogSourceFiles(files: LocalizedBlogSourceFile[]) {
  for (const file of files) {
    const parsedPath = parseBlogFlattenedPath(file.flattenedPath)
    const missingFields = ['locale', 'translationKey'].filter((field) => {
      const value = file.frontmatter[field as keyof typeof file.frontmatter]
      return typeof value !== 'string' || value.trim().length === 0
    })

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required localized blog frontmatter (${missingFields.join(', ')}) in ${file.sourceFilePath}`
      )
    }

    if (file.frontmatter.locale !== parsedPath.locale) {
      throw new Error(
        `Blog source locale "${String(file.frontmatter.locale)}" does not match path locale "${parsedPath.locale}" for ${file.sourceFilePath}`
      )
    }
  }
}

export function assertLocalizedPosts(posts: ContentlayerLikePost[]) {
  const seen = new Set<string>()

  for (const post of posts) {
    const pathLocale = getPathLocale(post._raw.flattenedPath)

    if (pathLocale !== post.locale) {
      throw new Error(
        `Post path locale "${pathLocale}" does not match frontmatter locale "${post.locale}" for ${post._raw.flattenedPath}`,
      )
    }

    const key = `${post.translationKey}:${post.locale}`

    if (seen.has(key)) {
      throw new Error(`Duplicate localized post for translation key "${post.translationKey}" and locale "${post.locale}"`)
    }

    seen.add(key)
  }
}
