import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import Main from 'app/Main'
import { genPageMetadata } from 'app/seo'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { filterPostsByLocale } from '@/lib/content/posts'
import { isLocale } from '@/lib/i18n/paths'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params

  if (!isLocale(locale)) {
    return
  }

  const dictionary = getDictionary(locale)

  return genPageMetadata({
    title: dictionary.navigation.home,
    description: dictionary.siteDescription,
    locale,
    pathname: `/${locale}`,
  })
}

export default async function LocalizedHomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params

  if (!isLocale(locale)) {
    notFound()
  }

  const posts = allCoreContent(sortPosts(filterPostsByLocale(allBlogs, locale)))

  return <Main posts={posts} locale={locale} />
}
