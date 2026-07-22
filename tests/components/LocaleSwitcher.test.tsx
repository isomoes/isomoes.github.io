import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

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
      { href: '/en/blog', locale: 'en', label: 'en', isActive: true },
      { href: '/zh/blog', locale: 'zh', label: 'zh', isActive: false },
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
      { href: '/en/blog/ide/ai-code', locale: 'en', label: 'en', isActive: true },
      { href: '/zh/blog', locale: 'zh', label: 'zh', isActive: false },
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
      { href: '/en/blog/ide/ai-code', locale: 'en', label: 'en', isActive: true },
      { href: '/zh/blog/ide/ai-code', locale: 'zh', label: 'zh', isActive: false },
    ])
  })
})

describe('LocaleSwitcher', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    mockedPathname = '/en/about'
    container = document.createElement('div')
    document.body.innerHTML = ''
    document.body.appendChild(container)
    root = createRoot(container)
  })

  it('renders a button-triggered locale menu with active locale state', async () => {
    await act(async () => {
      root.render(createElement(LocaleSwitcher, { currentLocale: 'en' }))
    })

    const trigger = container.querySelector('button[aria-haspopup="menu"]')

    expect(trigger).not.toBeNull()
    expect(trigger).toHaveTextContent('en')
    expect(container.querySelector('[role="menu"]')).toBeNull()

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    const menu = container.querySelector('[role="menu"]')
    const items = container.querySelectorAll('a[role="menuitem"]')
    const activeItem = container.querySelector('a[aria-current="page"]')

    expect(menu).not.toBeNull()
    expect(items).toHaveLength(2)
    expect(container.innerHTML).toContain('href="/en/about"')
    expect(container.innerHTML).toContain('href="/zh/about"')
    expect(menu).toHaveTextContent('en')
    expect(menu).toHaveTextContent('zh')
    expect(activeItem).toHaveTextContent('en')
  })

  it('closes the locale menu on Escape and outside click', async () => {
    await act(async () => {
      root.render(createElement(LocaleSwitcher, { currentLocale: 'en' }))
    })

    const trigger = container.querySelector('button[aria-haspopup="menu"]')

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(container.querySelector('[role="menu"]')).not.toBeNull()

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })

    expect(container.querySelector('[role="menu"]')).toBeNull()

    await act(async () => {
      trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(container.querySelector('[role="menu"]')).not.toBeNull()

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    })

    expect(container.querySelector('[role="menu"]')).toBeNull()
  })

  it('uses a theme-switch style trigger with compact locale text', async () => {
    await act(async () => {
      root.render(createElement(LocaleSwitcher, { currentLocale: 'en' }))
    })

    const trigger = container.querySelector('button[aria-haspopup="menu"]')

    expect(trigger?.className).not.toContain('rounded-full')
    expect(trigger?.textContent).toContain('en')
    expect(trigger?.textContent).not.toContain('zh')
  })
})
