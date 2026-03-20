import { Metadata } from 'next'
import { slug as slugify } from 'github-slugger'
import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/seo'
import { filterPostsByLocale } from '@/lib/content/posts'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale } from '@/lib/i18n/paths'
import { locales } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 5

function getTagCounts(posts: { tags?: string[] }[]) {
  return posts.reduce<Record<string, number>>((counts, post) => {
    for (const tag of post.tags ?? []) {
      const tagSlug = slugify(tag)
      counts[tagSlug] = (counts[tagSlug] ?? 0) + 1
    }

    return counts
  }, {})
}

function getAllTagSlugs() {
  return Array.from(
    new Set(allBlogs.flatMap((post) => (post.tags ?? []).map((tag) => slugify(tag))))
  )
}

export function generateStaticParams() {
  const tags = getAllTagSlugs()

  return locales.flatMap((locale) => tags.map((tag) => ({ locale, tag })))
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; tag: string }>
}): Promise<Metadata | undefined> {
  const { locale, tag } = await props.params

  if (!isLocale(locale)) {
    return
  }

  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    locale,
    pathname: `/${locale}/tags/${tag}`,
    alternates: {
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/${locale}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export default async function LocalizedTagPage(props: {
  params: Promise<{ locale: string; tag: string }>
}) {
  const { locale, tag } = await props.params

  if (!isLocale(locale)) {
    notFound()
  }

  const localizedPosts = filterPostsByLocale(allBlogs, locale)
  const filteredPosts = allCoreContent(
    sortPosts(
      localizedPosts.filter(
        (post) => post.tags && post.tags.map((value) => slugify(value)).includes(tag)
      )
    )
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const title = tag[0] ? tag[0].toUpperCase() + tag.slice(1) : tag

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={filteredPosts.slice(0, POSTS_PER_PAGE)}
      pagination={{ currentPage: 1, totalPages }}
      title={title}
      locale={locale}
      tagCounts={getTagCounts(localizedPosts)}
    />
  )
}
