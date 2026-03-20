import { defaultLocale, type Locale, locales } from './config'

const LEGACY_PUBLIC_PREFIXES = ['/about', '/blog', '/tags'] as const

function getLocalePrefixPattern() {
  return new RegExp(
    `^/(${locales.map((locale) => locale.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?=/|$)`,
  )
}

function normalizePathname(pathname: string) {
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

function stripLocalePrefix(pathname: string) {
  return normalizePathname(pathname).replace(getLocalePrefixPattern(), '') || '/'
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function withLocalePath(locale: Locale, pathname: string) {
  const stripped = stripLocalePrefix(pathname)

  return stripped === '/' ? `/${locale}` : `/${locale}${stripped}`
}

export function toLegacyEnglishPath(pathname: string) {
  return withLocalePath(defaultLocale, pathname)
}

export function getLegacyRedirectTarget(pathname: string) {
  const normalized = normalizePathname(pathname)

  if (stripLocalePrefix(normalized) !== normalized) {
    return null
  }

  if (normalized === '/') {
    return toLegacyEnglishPath(normalized)
  }

  if (LEGACY_PUBLIC_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) {
    return toLegacyEnglishPath(normalized)
  }

  return null
}
