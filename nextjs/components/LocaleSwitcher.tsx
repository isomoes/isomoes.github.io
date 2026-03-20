'use client'

import { createElement } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
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
    label: getDictionary(locale).languageLabel,
    isActive: locale === currentLocale,
  }))
}

export default function LocaleSwitcher({ currentLocale, postAlternates }: LocaleSwitcherProps) {
  const pathname = usePathname() ?? withLocalePath(currentLocale, '/')
  const links = buildLocaleSwitcherLinks({ currentLocale, pathname, postAlternates })

  return createElement(
    'nav',
    { 'aria-label': 'Switch language', className: 'flex items-center gap-2 text-sm font-medium' },
    links.map((link) =>
      createElement(
        NextLink,
        {
          key: link.locale,
          href: link.href,
          'aria-current': link.isActive ? 'page' : undefined,
          className: link.isActive
            ? 'text-primary-500'
            : 'text-gray-500 hover:text-primary-500 dark:text-gray-300',
        },
        link.label
      )
    )
  )
}
