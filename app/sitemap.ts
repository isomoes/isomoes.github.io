import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { locales } from '@/lib/i18n/config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}${post.url}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = locales.flatMap((locale) =>
    ['', 'blog', 'tags'].map((route) => ({
      url: route ? `${siteUrl}/${locale}/${route}` : `${siteUrl}/${locale}`,
      lastModified: new Date().toISOString().split('T')[0],
    }))
  )

  return [...routes, ...blogRoutes]
}
