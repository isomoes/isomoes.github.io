import { buildLocaleAlternates } from '../../lib/i18n/metadata'
import { expect, it } from 'vitest'

const metadata = buildLocaleAlternates({
  locale: 'en',
  pathname: '/blog/ide/ai-code',
  availableLocales: ['en'] as const,
})

buildLocaleAlternates({
  // @ts-expect-error locale must come from the provided locale subset
  locale: 'zh',
  pathname: '/blog/ide/ai-code',
  availableLocales: ['en'] as const,
})

metadata.languages.en satisfies string

// @ts-expect-error only requested locales should be exposed
metadata.languages.zh

it('keeps the requested locale available at runtime', () => {
  expect(metadata.languages.en).toBe('/en/blog/ide/ai-code')
})
