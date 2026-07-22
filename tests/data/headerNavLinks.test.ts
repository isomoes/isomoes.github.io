import { describe, expect, it } from 'vitest'

import { getHeaderNavLinks } from '@/data/headerNavLinks'

describe('getHeaderNavLinks', () => {
  it('labels the home tab as the blog list and omits the separate blog index', () => {
    expect(getHeaderNavLinks('en')).toEqual([
      { href: '/en', title: 'Blog' },
      { href: '/en/tags', title: 'Tags' },
      { href: '/en/about', title: 'About' },
    ])

    expect(getHeaderNavLinks('zh')).toEqual([
      { href: '/zh', title: '博客' },
      { href: '/zh/tags', title: '标签' },
      { href: '/zh/about', title: '关于' },
    ])
  })
})
