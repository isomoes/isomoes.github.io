import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayout'
import { filterPostsByLocale } from '@/lib/content/posts'
import { locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale } from '@/lib/i18n/paths'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export function generateStaticParams() {
  return locales.flatMap((locale) => {
    const posts = filterPostsByLocale(allBlogs, locale)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

    return Array.from({ length: totalPages > 1 ? totalPages - 1 : 0 }, (_, index) => ({
      locale,
      page: String(index + 2),
    }))
  })
}

export default async function LocalizedBlogPaginationPage(props: {
  params: Promise<{ locale: string; page: string }>
}) {
  const { locale, page } = await props.params

  if (!isLocale(locale)) {
    notFound()
  }

  const posts = allCoreContent(sortPosts(filterPostsByLocale(allBlogs, locale)))
  const pageNumber = Number.parseInt(page, 10)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (Number.isNaN(pageNumber) || pageNumber <= 1 || pageNumber > totalPages) {
    notFound()
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={posts.slice(
        POSTS_PER_PAGE * (pageNumber - 1),
        POSTS_PER_PAGE * pageNumber
      )}
      pagination={{ currentPage: pageNumber, totalPages }}
      title={getDictionary(locale).blog.title}
      locale={locale}
    />
  )
}
