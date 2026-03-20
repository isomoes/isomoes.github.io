import { describe, expect, it } from 'vitest'
import {
  assertLocalizedBlogSourceFiles,
  assertLocalizedPosts,
  filterPostsByLocale,
  findTranslatedPost,
  getPostPathFromFlattenedPath,
  getPathLocale,
  getPostSlugFromFlattenedPath,
} from '@/lib/content/posts'

const posts = [
  { slug: 'ide/ai-code', locale: 'en', translationKey: 'ai-code', draft: false },
  { slug: 'ide/ai-code', locale: 'zh', translationKey: 'ai-code', draft: false },
  { slug: 'misc/tools', locale: 'en', translationKey: 'tools', draft: false },
]

describe('localized posts helpers', () => {
  it('filters posts by locale', () => {
    expect(filterPostsByLocale(posts, 'zh')).toHaveLength(1)
  })

  it('finds a translated sibling by translation key', () => {
    const target = findTranslatedPost(posts, posts[0], 'zh')
    expect(target?.slug).toBe('ide/ai-code')
  })

  it('throws when translation key and locale pairs are duplicated', () => {
    expect(() =>
      assertLocalizedPosts([
        {
          _raw: { flattenedPath: 'blog/en/ide/ai-code' },
          locale: 'en',
          translationKey: 'ai-code',
        },
        {
          _raw: { flattenedPath: 'blog/en/misc/ai-code-copy' },
          locale: 'en',
          translationKey: 'ai-code',
        },
      ])
    ).toThrow(/Duplicate localized post/)
  })

  it('throws when the path locale and frontmatter locale disagree', () => {
    expect(() =>
      assertLocalizedPosts([
        {
          _raw: { flattenedPath: 'blog/en/ide/ai-code' },
          locale: 'zh',
          translationKey: 'ai-code',
        },
      ])
    ).toThrow(/does not match frontmatter locale/)
  })

  it('extracts the slug from a canonical blog path', () => {
    expect(getPostSlugFromFlattenedPath('blog/en/ide/ai-code')).toBe('ide/ai-code')
  })

  it('builds a canonical localized blog path for navigation and search', () => {
    expect(getPostPathFromFlattenedPath('blog/en/ide/great-ai-ide')).toBe('en/blog/ide/great-ai-ide')
  })

  it('throws when extracting a slug from a malformed blog path', () => {
    expect(() => getPostSlugFromFlattenedPath('blog/en')).toThrow(/Expected blog\/<locale>\/<slug/)
    expect(() => getPostSlugFromFlattenedPath('notes/en/ai-code')).toThrow(/Expected blog\/<locale>\/<slug/)
  })

  it('returns a supported locale from a canonical blog path', () => {
    expect(getPathLocale('blog/zh/ide/ai-code')).toBe('zh')
  })

  it('throws when extracting an unsupported locale from a blog path', () => {
    expect(() => getPathLocale('blog/fr/ide/ai-code')).toThrow(/Unsupported blog locale/)
  })

  it('throws when localized source files are missing required frontmatter', () => {
    expect(() =>
      assertLocalizedBlogSourceFiles([
        {
          flattenedPath: 'blog/en/ide/ai-code',
          sourceFilePath: 'blog/en/ide/ai-code.mdx',
          frontmatter: {},
        },
      ])
    ).toThrow(/Missing required localized blog frontmatter.*locale.*translationKey/)
  })

  it('throws when localized source files use malformed or unsupported paths', () => {
    expect(() =>
      assertLocalizedBlogSourceFiles([
        {
          flattenedPath: 'blog/tools/ai-code',
          sourceFilePath: 'blog/tools/ai-code.mdx',
          frontmatter: { locale: 'en', translationKey: 'ai-code' },
        },
      ])
    ).toThrow(/Unsupported blog locale/)
  })
})
