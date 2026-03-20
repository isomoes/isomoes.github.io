import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { allBlogs } from '../.contentlayer/generated/index.mjs'
import tagData from '../app/tag-data.json' with { type: 'json' }

const DEFAULT_LOCALE = 'en'
const POSTS_PER_PAGE = 5
const outputPath = path.join(process.cwd(), 'lib', 'generated', 'legacy-redirects.json')

function generateLegacyRedirects() {
  const englishPosts = allBlogs.filter(
    (post) => post.locale === DEFAULT_LOCALE && post.draft !== true
  )
  const totalPages = Math.ceil(englishPosts.length / POSTS_PER_PAGE)
  const legacyRedirects = {
    blogPages: Array.from({ length: totalPages }, (_, index) => ({
      page: String(index + 1),
    })),
    blogSlugs: englishPosts.map((post) => ({
      slug: post.slug.split('/').map((segment) => decodeURI(segment)),
    })),
    tags: Object.keys(tagData).map((tag) => ({ tag })),
  }

  mkdirSync(path.dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(legacyRedirects, null, 2)}\n`)
  console.log('Legacy redirects generated...')
}

generateLegacyRedirects()
