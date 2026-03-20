import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let mockedPathname = '/en/blog'

vi.mock('next/navigation', () => ({
  usePathname: () => mockedPathname,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }) => createElement('a', { href, ...props }, children),
}))

import LocaleSwitcher, { buildLocaleSwitcherLinks } from '@/components/LocaleSwitcher'

describe('buildLocaleSwitcherLinks', () => {
  it('preserves equivalent shared routes across locales', () => {
    expect(
      buildLocaleSwitcherLinks({
        currentLocale: 'en',
        pathname: '/en/blog',
      })
    ).toEqual([
      { href: '/en/blog', locale: 'en', label: 'English', isActive: true },
      { href: '/zh/blog', locale: 'zh', label: '\u4e2d\u6587', isActive: false },
    ])
  })

  it('falls back to the target locale blog index when a translated post is unavailable', () => {
    expect(
      buildLocaleSwitcherLinks({
        currentLocale: 'en',
        pathname: '/en/blog/ide/ai-code',
        postAlternates: {
          en: '/en/blog/ide/ai-code',
        },
      })
    ).toEqual([
      { href: '/en/blog/ide/ai-code', locale: 'en', label: 'English', isActive: true },
      { href: '/zh/blog', locale: 'zh', label: '\u4e2d\u6587', isActive: false },
    ])
  })

  it('uses translated sibling post routes when available', () => {
    expect(
      buildLocaleSwitcherLinks({
        currentLocale: 'en',
        pathname: '/en/blog/ide/ai-code',
        postAlternates: {
          en: '/en/blog/ide/ai-code',
          zh: '/zh/blog/ide/ai-code',
        },
      })
    ).toEqual([
      { href: '/en/blog/ide/ai-code', locale: 'en', label: 'English', isActive: true },
      { href: '/zh/blog/ide/ai-code', locale: 'zh', label: '\u4e2d\u6587', isActive: false },
    ])
  })
})

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    mockedPathname = '/en/projects'
  })

  it('renders locale links for the current pathname', () => {
    const html = renderToStaticMarkup(createElement(LocaleSwitcher, { currentLocale: 'en' }))

    expect(html).toContain('href="/en/projects"')
    expect(html).toContain('href="/zh/projects"')
    expect(html).toContain('English')
    expect(html).toContain('\u4e2d\u6587')
  })
})
