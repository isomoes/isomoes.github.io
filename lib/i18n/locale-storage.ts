import type { Locale } from './config'
import { isLocale, withLocalePath } from './paths'

export const LOCALE_STORAGE_KEY = 'preferred-locale'

export function storeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Ignore storage failures (private mode, disabled storage, unavailable window).
  }
}

export function readStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    return value && isLocale(value) ? value : null
  } catch {
    return null
  }
}

/**
 * Re-maps the locale prefix of `target` to the reader's stored preference when
 * enabled. Only safe for paths that exist in every locale (the home page and
 * section listings), so callers opt in explicitly.
 */
export function resolveStoredLocaleTarget(target: string, respectStoredLocale: boolean): string {
  if (!respectStoredLocale) {
    return target
  }

  const storedLocale = readStoredLocale()

  return storedLocale ? withLocalePath(storedLocale, target) : target
}
