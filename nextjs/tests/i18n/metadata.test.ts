import { describe, expect, it } from 'vitest'

import { genPageMetadata } from '../../app/seo'
import { buildLocaleAlternates } from '@/lib/i18n/metadata'

describe('buildLocaleAlternates', () => {
  it('builds localized alternates metadata', () => {
    const metadata = buildLocaleAlternates({
      locale: 'zh',
      pathname: '/blog/ide/ai-code',
      availableLocales: ['en', 'zh'],
    })

    expect(metadata.canonical).toBe('/zh/blog/ide/ai-code')
    expect(metadata.languages.en).toBe('/en/blog/ide/ai-code')
    expect(metadata.languages.zh).toBe('/zh/blog/ide/ai-code')
  })

  it('normalizes already-localized paths when building alternates', () => {
    const metadata = buildLocaleAlternates({
      locale: 'en',
      pathname: '/zh/blog/ide/ai-code',
      availableLocales: ['en', 'zh'],
    })

    expect(metadata.canonical).toBe('/en/blog/ide/ai-code')
    expect(metadata.languages.en).toBe('/en/blog/ide/ai-code')
    expect(metadata.languages.zh).toBe('/zh/blog/ide/ai-code')
  })

  it('keeps languages limited to the provided locale subset', () => {
    const metadata = buildLocaleAlternates({
      locale: 'en',
      pathname: '/blog/ide/ai-code',
      availableLocales: ['en'] as const,
    })

    expect(metadata.languages.en).toBe('/en/blog/ide/ai-code')
    expect(metadata.languages).not.toHaveProperty('zh')
  })
})

describe('genPageMetadata', () => {
  it('builds zh open graph locale data for blog pages', () => {
    const metadata = genPageMetadata({
      locale: 'zh',
      pathname: '/blog/ide/ai-code',
      title: 'AI Code',
      availableLocales: ['en', 'zh'],
    })

    expect(metadata.openGraph?.locale).toBe('zh_CN')
    expect(metadata.alternates?.canonical).toBe('/zh/blog/ide/ai-code')
  })

  it('derives locale from a localized pathname when locale is omitted', () => {
    const metadata = genPageMetadata({
      pathname: '/zh/blog/ide/ai-code',
      title: 'AI Code',
      availableLocales: ['en', 'zh'],
    })

    expect(metadata.openGraph?.locale).toBe('zh_CN')
    expect(metadata.alternates?.canonical).toBe('/zh/blog/ide/ai-code')
  })

  it('falls back to the default locale for supported unlocalized pathnames', () => {
    const metadata = genPageMetadata({
      pathname: '/about',
      title: 'About',
      availableLocales: ['en', 'zh'],
    })

    expect(metadata.openGraph?.locale).toBe('en_US')
    expect(metadata.alternates?.canonical).toBe('/en/about')
  })
})
