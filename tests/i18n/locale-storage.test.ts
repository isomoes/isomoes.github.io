import { afterEach, describe, expect, it } from 'vitest'

import {
  LOCALE_STORAGE_KEY,
  readStoredLocale,
  resolveStoredLocaleTarget,
  storeLocale,
} from '@/lib/i18n/locale-storage'

describe('locale-storage', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('persists and restores a chosen locale', () => {
    storeLocale('zh')

    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('zh')
    expect(readStoredLocale()).toBe('zh')
  })

  it('round-trips the english locale', () => {
    storeLocale('en')

    expect(readStoredLocale()).toBe('en')
  })

  it('returns null when nothing has been stored', () => {
    expect(readStoredLocale()).toBeNull()
  })

  it('ignores unknown stored values', () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, 'fr')

    expect(readStoredLocale()).toBeNull()
  })
})

describe('resolveStoredLocaleTarget', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('keeps the default target when preference honoring is disabled', () => {
    storeLocale('zh')

    expect(resolveStoredLocaleTarget('/en/about', false)).toBe('/en/about')
  })

  it('keeps the default target when no locale is stored', () => {
    expect(resolveStoredLocaleTarget('/en', true)).toBe('/en')
  })

  it('re-maps the target to the stored locale for the home page', () => {
    storeLocale('zh')

    expect(resolveStoredLocaleTarget('/en', true)).toBe('/zh')
  })

  it('re-maps the target to the stored locale for section listings', () => {
    storeLocale('zh')

    expect(resolveStoredLocaleTarget('/en/tags', true)).toBe('/zh/tags')
  })

  it('leaves an already-matching english target unchanged', () => {
    storeLocale('en')

    expect(resolveStoredLocaleTarget('/en/about', true)).toBe('/en/about')
  })
})
