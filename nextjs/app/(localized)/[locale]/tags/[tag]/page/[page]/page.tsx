import { Metadata } from 'next'
import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/seo'
import {
  getLocalizedTagPosts,
  getLocalizedTagPaginationParams,
  getTagCounts,
} from '@/lib/content/tags'
import { filterPostsByLocale } from '@/lib/content/posts'
import { locales } from '@/lib/i18n/config'
import { isLocale } from '@/lib/i18n/paths'
import { notFound } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 5

export function generateStaticParams() {
  return getLocalizedTagPaginationParams(allBlogs, locales, POSTS_PER_PAGE)
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; tag: string; page: string }>
}): Promise<Metadata | undefined> {
  const { locale, tag, page } = await props.params

  if (!isLocale(locale)) {
    return
  }

  return genPageMetadata({
    title: `${tag} - Page ${page}`,
    description: `${siteMetadata.title} ${tag} tagged content - page ${page}`,
    locale,
    pathname: `/${locale}/tags/${tag}/page/${page}`,
    alternates: {
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/${locale}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export default async function LocalizedTagPaginationPage(props: {
  params: Promise<{ locale: string; tag: string; page: string }>
}) {
  const { locale, tag, page } = await props.params

  if (!isLocale(locale)) {
    notFound()
  }

  const localizedPosts = filterPostsByLocale(allBlogs, locale)
  const filteredPosts = allCoreContent(sortPosts(getLocalizedTagPosts(allBlogs, locale, tag)))
  const pageNumber = Number.parseInt(page, 10)
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  if (
    filteredPosts.length === 0 ||
    Number.isNaN(pageNumber) ||
    pageNumber <= 1 ||
    pageNumber > totalPages
  ) {
    notFound()
  }

  const title = tag[0] ? tag[0].toUpperCase() + tag.slice(1) : tag

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={filteredPosts.slice(
        POSTS_PER_PAGE * (pageNumber - 1),
        POSTS_PER_PAGE * pageNumber
      )}
      pagination={{ currentPage: pageNumber, totalPages }}
      title={title}
      locale={locale}
      tagCounts={getTagCounts(localizedPosts)}
    />
  )
}
