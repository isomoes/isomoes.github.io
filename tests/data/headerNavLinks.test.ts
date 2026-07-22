import { describe, expect, it } from 'vitest'

import { getHeaderNavLinks } from '@/data/headerNavLinks'

describe('getHeaderNavLinks', () => {
  it('omits the removed projects page from localized navigation', () => {
    expect(getHeaderNavLinks('en')).toEqual([
      { href: '/en', title: 'Home' },
      { href: '/en/blog', title: 'Blog' },
      { href: '/en/tags', title: 'Tags' },
      { href: '/en/about', title: 'About' },
    ])

    expect(getHeaderNavLinks('zh')).toEqual([
      { href: '/zh', title: '首页' },
      { href: '/zh/blog', title: '博客' },
      { href: '/zh/tags', title: '标签' },
      { href: '/zh/about', title: '关于' },
    ])
  })
})
