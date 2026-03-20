import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const appDir = path.join(import.meta.dirname, '..', '..', 'app')

describe('localized app layouts', () => {
  it('lets the locale segment own the document lang attribute', () => {
    const localizedLayoutSource = readFileSync(
      path.join(appDir, '(localized)', '[locale]', 'layout.tsx'),
      'utf8'
    )
    const legacyLayoutSource = readFileSync(path.join(appDir, '(legacy)', 'layout.tsx'), 'utf8')

    expect(localizedLayoutSource).toContain('<RootDocument lang={locale}>')
    expect(legacyLayoutSource).toContain('<RootDocument lang="en">')
  })
})
