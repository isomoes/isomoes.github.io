import 'css/prism.css'
import 'katex/dist/katex.css'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allAuthors, allBlogs } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent, allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { components } from '@/components/MDXComponents'
import PostBanner from '@/layouts/PostBanner'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import { getMetadataLocale, getOpenGraphLocale } from 'app/seo'
import { buildLocaleAlternates } from '@/lib/i18n/metadata'
import { filterPostsByLocale, findTranslatedPost } from '@/lib/content/posts'
import { isLocale } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/config'
import siteMetadata from '@/data/siteMetadata'

const defaultLayout = 'PostSimple'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

function getLocalizedAuthor(slug: string, locale: Locale) {
  return (
    allAuthors.find((author) => author.slug === `${locale}/${slug}`) ??
    allAuthors.find((author) => author.slug === slug)
  )
}

function getPostAlternates(post: Blog) {
  return Object.fromEntries(
    (['en', 'zh'] as const)
      .map((locale) => {
        const translatedPost = findTranslatedPost(allBlogs, post, locale)

        return translatedPost ? [locale, translatedPost.url] : null
      })
      .filter(Boolean) as [Locale, string][]
  ) as Partial<Record<Locale, string>>
}

export function generateStaticParams() {
  return allBlogs.map((post) => ({
    locale: post.locale,
    slug: post.slug.split('/').map((segment) => decodeURI(segment)),
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string[] }>
}): Promise<Metadata | undefined> {
  const { locale, slug: slugParts } = await props.params

  if (!isLocale(locale)) {
    return
  }

  const slug = decodeURI(slugParts.join('/'))
  const post = allBlogs.find((candidate) => candidate.slug === slug && candidate.locale === locale)

  if (!post) {
    return
  }

  const authorList = post.authors || ['default']
  const authorDetails = authorList
    .map((author) => getLocalizedAuthor(author, locale))
    .filter(Boolean)
    .map((author) => coreContent(author as Authors))
  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  const imageList = post.images
    ? typeof post.images === 'string'
      ? [post.images]
      : post.images
    : [siteMetadata.socialBanner]
  const ogImages = imageList.map((image) => ({
    url: image.includes('http') ? image : `${siteMetadata.siteUrl}${image}`,
  }))
  const pathname = `/${locale}/blog/${slug}`
  const metadataLocale = getMetadataLocale(pathname, locale)
  const alternates = getPostAlternates(post)
  const availableLocales = Object.keys(alternates) as Locale[]

  return {
    title: post.title,
    description: post.summary,
    alternates: buildLocaleAlternates({
      locale: metadataLocale,
      pathname,
      availableLocales: availableLocales.length > 0 ? availableLocales : [locale],
    }),
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: getOpenGraphLocale(metadataLocale),
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export default async function LocalizedPostPage(props: {
  params: Promise<{ locale: string; slug: string[] }>
}) {
  const { locale, slug: slugParts } = await props.params

  if (!isLocale(locale)) {
    notFound()
  }

  const slug = decodeURI(slugParts.join('/'))
  const localizedPosts = allCoreContent(sortPosts(filterPostsByLocale(allBlogs, locale)))
  const postIndex = localizedPosts.findIndex((post) => post.slug === slug)

  if (postIndex === -1) {
    notFound()
  }

  const post = allBlogs.find(
    (candidate) => candidate.slug === slug && candidate.locale === locale
  ) as Blog
  const authorList = post.authors || ['default']
  const authorDetails = authorList
    .map((author) => getLocalizedAuthor(author, locale))
    .filter(Boolean)
    .map((author) => coreContent(author as Authors))
  const prevPost = localizedPosts[postIndex + 1]
  const nextPost = localizedPosts[postIndex - 1]
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd.author = authorDetails.map((author) => ({
    '@type': 'Person',
    name: author.name,
  }))

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        locale={locale}
        next={nextPost ? { path: nextPost.url, title: nextPost.title } : undefined}
        prev={prevPost ? { path: prevPost.url, title: prevPost.title } : undefined}
      >
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
