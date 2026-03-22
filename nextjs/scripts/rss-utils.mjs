import { mkdirSync, rmSync } from 'fs'
import path from 'path'

export function prepareTagFeedDirectory(tagDirectory) {
  mkdirSync(tagDirectory, { recursive: true })
  rmSync(path.join(tagDirectory, 'feed.xml'), { force: true })
}
