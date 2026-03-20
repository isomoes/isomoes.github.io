import Link from '@/components/Link'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import Tag from '@/components/Tag'
import { genPageMetadata } from 'app/seo'
import { allBlogs } from 'contentlayer/generated'
import { slug } from 'github-slugger'
import { filterPostsByLocale } from '@/lib/content/posts'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale } from '@/lib/i18n/paths'
import { notFound } from 'next/navigation'

function getTagCounts(posts: { tags?: string[] }[]) {
  return posts.reduce<Record<string, number>>((counts, post) => {
    for (const tag of post.tags ?? []) {
      const tagSlug = slug(tag)
      counts[tagSlug] = (counts[tagSlug] ?? 0) + 1
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
    title: dictionary.tags.title,
    description: dictionary.tags.description,
    locale,
    pathname: `/${locale}/tags`,
  })
}

export default async function LocalizedTagsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params

  if (!isLocale(locale)) {
    notFound()
  }

  const dictionary = getDictionary(locale)
  const tagCounts = getTagCounts(filterPostsByLocale(allBlogs, locale))
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
      <div className="space-x-2 pb-8 pt-6 md:space-y-5">
        <LocaleSwitcher currentLocale={locale} />
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
          {dictionary.tags.title}
        </h1>
      </div>
      <div className="flex max-w-lg flex-wrap">
        {sortedTags.length === 0 && dictionary.tags.noTags}
        {sortedTags.map((tag) => (
          <div key={tag} className="mb-2 mr-5 mt-2">
            <Tag text={tag} locale={locale} />
            <Link
              href={`/${locale}/tags/${tag}`}
              className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
              aria-label={`View posts tagged ${tag}`}
            >
              {` (${tagCounts[tag]})`}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
