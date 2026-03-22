import { describe, expect, it } from 'vitest'
import {
  getAllTagSlugs,
  getLocalizedTagPaginationParams,
  getLocalizedTagPosts,
  getTagCounts,
} from '@/lib/content/tags'

const posts = [
  { locale: 'zh', tags: ['AI', 'workflow'], title: 'A' },
  { locale: 'zh', tags: ['ai'], title: 'B' },
  { locale: 'zh', tags: ['AI'], title: 'C' },
  { locale: 'zh', tags: ['AI'], title: 'D' },
  { locale: 'zh', tags: ['AI'], title: 'E' },
  { locale: 'zh', tags: ['AI'], title: 'F' },
  { locale: 'en', tags: ['AI'], title: 'G' },
]

describe('tag content helpers', () => {
  it('builds slugged tag counts for a locale', () => {
    expect(getTagCounts(posts.filter((post) => post.locale === 'zh'))).toEqual({
      ai: 6,
      workflow: 1,
    })
  })

  it('filters localized posts by tag slug', () => {
    expect(getLocalizedTagPosts(posts, 'zh', 'ai')).toHaveLength(6)
    expect(getLocalizedTagPosts(posts, 'en', 'ai')).toHaveLength(1)
  })

  it('creates pagination params only for additional tag pages', () => {
    expect(getLocalizedTagPaginationParams(posts, ['zh', 'en'], 5)).toEqual([
      { locale: 'zh', tag: 'ai', page: '2' },
    ])
  })

  it('collects unique slugged tags across posts', () => {
    expect(getAllTagSlugs(posts)).toEqual(['ai', 'workflow'])
  })
})
