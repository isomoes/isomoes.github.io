'use client'

import { createElement, useEffect, useId, useRef, useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { locales, type Locale } from '@/lib/i18n/config'
import { withLocalePath } from '@/lib/i18n/paths'

const localeNames: Record<Locale, string> = { en: 'English', zh: '中文' }

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
        'flex items-center gap-1 text-sm font-medium text-gray-900 transition hover:text-primary-500 focus:outline-none dark:text-gray-100 dark:hover:text-primary-400',
      onClick: () => setIsOpen((open) => !open),
    },
    [
      createElement('span', { key: 'label' }, localeNames[currentLocale]),
      createElement(ChevronDownIcon, {
        key: 'icon',
        className: 'h-4 w-4',
        'aria-hidden': 'true',
      }),
    ]
  )

  const menu = isOpen
    ? createElement(
        'div',
        {
          id: menuId,
          role: 'menu',
          className:
            'absolute right-0 z-50 mt-2 w-32 rounded-lg bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800',
        },
        links.map((link) =>
          createElement(
            NextLink,
            {
              key: link.locale,
              href: link.href,
              role: 'menuitem',
              'aria-current': link.isActive ? 'page' : undefined,
              className: `${link.isActive ? 'text-primary-600 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200'} flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-medium hover:bg-primary-600 hover:text-white`,
              onClick: () => setIsOpen(false),
            },
            [
              createElement('span', { key: `label-${link.locale}` }, localeNames[link.locale]),
              link.isActive
                ? createElement(CheckIcon, {
                    key: `active-${link.locale}`,
                    className: 'h-4 w-4',
                    'aria-hidden': 'true',
                  })
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
