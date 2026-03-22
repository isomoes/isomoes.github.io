import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import os from 'os'
import path from 'path'
import { prepareTagFeedDirectory } from '@/scripts/rss-utils.mjs'

describe('prepareTagFeedDirectory', () => {
  let tempDir: string | undefined

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true })
      tempDir = undefined
    }
  })

  it('preserves exported tag pages while replacing the feed file', () => {
    tempDir = mkdtempSync(path.join(os.tmpdir(), 'rss-test-'))
    const tagDirectory = path.join(tempDir, 'en', 'tags', 'ai')

    mkdirSync(tagDirectory, { recursive: true })
    writeFileSync(path.join(tagDirectory, 'index.html'), '<html>tag page</html>')
    writeFileSync(path.join(tagDirectory, 'feed.xml'), 'old feed')

    prepareTagFeedDirectory(tagDirectory)

    expect(readFileSync(path.join(tagDirectory, 'index.html'), 'utf8')).toBe('<html>tag page</html>')
    expect(() => readFileSync(path.join(tagDirectory, 'feed.xml'), 'utf8')).toThrow()
  })
})
