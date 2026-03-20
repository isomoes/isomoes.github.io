import { afterEach, describe, expect, it, vi } from 'vitest'

async function importPathsModule() {
  return import('@/lib/i18n/paths')
}

afterEach(() => {
  vi.resetModules()
  vi.doUnmock('@/lib/i18n/config')
})

describe('withLocalePath', () => {
  it.each([
    ['prefixes a non-localized path with the default locale', 'en', '/blog/ide/ai-code', '/en/blog/ide/ai-code'],
    ['replaces an already-localized English path', 'zh', '/en/blog/ide/ai-code', '/zh/blog/ide/ai-code'],
    ['replaces an already-localized non-default path', 'en', '/zh/blog/ide/ai-code', '/en/blog/ide/ai-code'],
    ['localizes the root path', 'zh', '/', '/zh'],
    ['normalizes input without a leading slash', 'en', 'blog/ide/ai-code', '/en/blog/ide/ai-code'],
  ])('%s', async (_name, locale, pathname, expected) => {
    const { withLocalePath } = await importPathsModule()

    expect(withLocalePath(locale as 'en' | 'zh', pathname)).toBe(expected)
  })

  it('strips locales from the shared config, not a hardcoded regex', async () => {
    vi.resetModules()
    vi.doMock('@/lib/i18n/config', () => ({
      defaultLocale: 'fr',
      locales: ['fr', 'de'] as const,
    }))

    const { withLocalePath: withMockedLocalePath } = await import('@/lib/i18n/paths')

    expect((withMockedLocalePath as (locale: string, pathname: string) => string)('de', '/fr/blog')).toBe('/de/blog')
  })
})

describe('isLocale', () => {
  it.each([
    ['en', true],
    ['zh', true],
    ['fr', false],
    ['', false],
  ])('returns %s for %s', async (value, expected) => {
    const { isLocale } = await importPathsModule()

    expect(isLocale(value)).toBe(expected)
  })
})

describe('toLegacyEnglishPath', () => {
  it.each([
    ['/blog/ide/ai-code', '/en/blog/ide/ai-code'],
    ['/zh/blog/ide/ai-code', '/en/blog/ide/ai-code'],
    ['/', '/en'],
  ])('maps %s to %s', async (pathname, expected) => {
    const { toLegacyEnglishPath } = await importPathsModule()

    expect(toLegacyEnglishPath(pathname)).toBe(expected)
  })
})

describe('getLegacyRedirectTarget', () => {
  it('maps legacy root to english root', async () => {
    const { getLegacyRedirectTarget } = await importPathsModule()

    expect(getLegacyRedirectTarget('/')).toBe('/en')
  })

  it('maps legacy blog post paths to english blog post paths', async () => {
    const { getLegacyRedirectTarget } = await importPathsModule()

    expect(getLegacyRedirectTarget('/blog/ide/ai-code')).toBe('/en/blog/ide/ai-code')
  })

  it('maps legacy paginated blog paths to english blog pagination paths', async () => {
    const { getLegacyRedirectTarget } = await importPathsModule()

    expect(getLegacyRedirectTarget('/blog/page/2')).toBe('/en/blog/page/2')
  })

  it('maps supported legacy public pages to english localized pages', async () => {
    const { getLegacyRedirectTarget } = await importPathsModule()

    expect(getLegacyRedirectTarget('/about')).toBe('/en/about')
  })

  it('returns null for removed legacy projects page', async () => {
    const { getLegacyRedirectTarget } = await importPathsModule()

    expect(getLegacyRedirectTarget('/projects')).toBeNull()
  })

  it.each(['/en/blog/ide/ai-code', '/zh/blog/ide/ai-code'])(
    'returns null for non-legacy path %s',
    async (pathname) => {
      const { getLegacyRedirectTarget } = await importPathsModule()

      expect(getLegacyRedirectTarget(pathname)).toBeNull()
    },
  )
})
