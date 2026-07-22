'use client'

import { createElement, useEffect, useId, useRef, useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n/config'
import { withLocalePath } from '@/lib/i18n/paths'

type LocaleSwitcherAlternates = Partial<Record<Locale, string>>

type BuildLocaleSwitcherLinksInput = {
  currentLocale: Locale
  pathname: string
  postAlternates?: LocaleSwitcherAlternates
}

type LocaleSwitcherProps = {
  currentLocale: Locale
  postAlternates?: LocaleSwitcherAlternates
}

export function buildLocaleSwitcherLinks({
  currentLocale,
  pathname,
  postAlternates,
}: BuildLocaleSwitcherLinksInput) {
  const normalizedPathname = withLocalePath(currentLocale, pathname)

  return locales.map((locale) => ({
    href: postAlternates
      ? (postAlternates[locale] ?? withLocalePath(locale, '/blog'))
      : withLocalePath(locale, normalizedPathname),
    locale,
    label: locale,
    isActive: locale === currentLocale,
  }))
}

export default function LocaleSwitcher({ currentLocale, postAlternates }: LocaleSwitcherProps) {
  const pathname = usePathname() ?? withLocalePath(currentLocale, '/')
  const links = buildLocaleSwitcherLinks({ currentLocale, pathname, postAlternates })
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isOpen])

  const trigger = createElement(
    'button',
    {
      type: 'button',
      'aria-label': 'Switch language',
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
      'aria-controls': menuId,
      className:
        'flex items-center gap-1 text-sm font-medium uppercase tracking-[0.18em] text-gray-900 transition hover:text-primary-500 focus:outline-none dark:text-gray-100 dark:hover:text-primary-400',
      onClick: () => setIsOpen((open) => !open),
    },
    [
      createElement('span', { key: 'label' }, currentLocale),
      createElement(
        'svg',
        {
          key: 'icon',
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 20 20',
          fill: 'currentColor',
          className: 'h-4 w-4',
          'aria-hidden': 'true',
        },
        createElement('path', {
          fillRule: 'evenodd',
          d: 'M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z',
          clipRule: 'evenodd',
        })
      ),
    ]
  )

  const menu = isOpen
    ? createElement(
        'div',
        {
          id: menuId,
          role: 'menu',
          className:
            'absolute right-0 z-50 mt-2 w-20 rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800',
        },
        links.map((link) =>
          createElement(
            NextLink,
            {
              key: link.locale,
              href: link.href,
              role: 'menuitem',
              'aria-current': link.isActive ? 'page' : undefined,
              className: `${link.isActive ? 'text-primary-600 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200'} flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium uppercase tracking-[0.18em] hover:bg-primary-600 hover:text-white`,
              onClick: () => setIsOpen(false),
            },
            [
              createElement('span', { key: `label-${link.locale}` }, link.label),
              link.isActive
                ? createElement(
                    'svg',
                    {
                      key: `active-${link.locale}`,
                      xmlns: 'http://www.w3.org/2000/svg',
                      viewBox: '0 0 20 20',
                      fill: 'currentColor',
                      className: 'h-4 w-4',
                      'aria-hidden': 'true',
                    },
                    createElement('path', {
                      fillRule: 'evenodd',
                      d: 'M16.704 5.29a1 1 0 010 1.42l-7.002 7a1 1 0 01-1.414 0l-3.002-3a1 1 0 111.414-1.42l2.295 2.294 6.295-6.294a1 1 0 011.414 0z',
                      clipRule: 'evenodd',
                    })
                  )
                : createElement(
                    'span',
                    { key: `inactive-${link.locale}`, className: 'sr-only' },
                    'Inactive locale'
                  ),
            ]
          )
        )
      )
    : null

  return createElement(
    'div',
    { ref: containerRef, className: 'relative inline-block text-left' },
    trigger,
    menu
  )
}
