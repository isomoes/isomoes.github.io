import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/seo'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { filterPostsByLocale } from '@/lib/content/posts'
import { isLocale } from '@/lib/i18n/paths'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

function getTagCounts(posts: { tags?: string[] }[]) {
  return posts.reduce<Record<string, number>>((counts, post) => {
    for (const tag of post.tags ?? []) {
      counts[tag] = (counts[tag] ?? 0) + 1
    }

    return counts
  }, {})
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params

  if (!isLocale(locale)) {
    return
  }

  const dictionary = getDictionary(locale)

  return genPageMetadata({
    title: dictionary.navigation.blog,
    locale,
    pathname: `/${locale}/blog`,
  })
}

export default async function LocalizedBlogPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params

  if (!isLocale(locale)) {
    notFound()
  }

  const posts = allCoreContent(sortPosts(filterPostsByLocale(allBlogs, locale)))
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={posts.slice(0, POSTS_PER_PAGE)}
      pagination={{ currentPage: 1, totalPages }}
      title={getDictionary(locale).blog.title}
      locale={locale}
      tagCounts={getTagCounts(posts)}
    />
  )
}
