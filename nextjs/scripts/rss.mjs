import { writeFileSync, mkdirSync, rmSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import tagData from '../app/tag-data.json' with { type: 'json' }
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'
import { prepareTagFeedDirectory } from './rss-utils.mjs'

const outputFolder = process.env.EXPORT ? 'out' : 'public'
const localeLanguages = {
  en: 'en-us',
  zh: 'zh-cn',
}

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}${post.url}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}${post.url}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, locale, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/${locale}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${localeLanguages[locale] ?? config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      ${posts[0] ? `<lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>` : ''}
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  rmSync(path.join(outputFolder, page), { force: true })

  for (const locale of config.locales ?? [config.defaultLocale ?? 'en']) {
    const localePosts = sortPosts(
      allBlogs.filter((post) => post.locale === locale && post.draft !== true)
    )
    const localeOutputPath = path.join(outputFolder, locale)

    mkdirSync(localeOutputPath, { recursive: true })
    writeFileSync(
      path.join(localeOutputPath, page),
      generateRss(config, localePosts, locale, `${locale}/${page}`)
    )

    for (const tag of Object.keys(tagData)) {
      const filteredPosts = localePosts.filter((post) =>
        post.tags?.map((t) => slug(t)).includes(tag)
      )
      const rssPath = path.join(localeOutputPath, 'tags', tag)

      prepareTagFeedDirectory(rssPath)
      writeFileSync(
        path.join(rssPath, page),
        generateRss(config, filteredPosts, locale, `${locale}/tags/${tag}/${page}`)
      )
    }
  }
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs)
  console.log('RSS feed generated...')
}
export default rss
