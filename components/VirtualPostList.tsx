'use client'

import { useEffect, useRef, useState } from 'react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { formatDate } from 'pliny/utils/formatDate'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { type Locale } from '@/lib/i18n/config'
import { getDateLocale, getDictionary } from '@/lib/i18n/dictionaries'

export type HomePost = {
  slug: string
  date: string
  title: string
  summary?: string
  tags?: string[]
}

const ROW = 'py-12'
const DIVIDER = 'border-t border-gray-200 dark:border-gray-700'

// How many posts to render on the server / before hydration. Keeps the initial
// HTML small (no more shipping every post as markup) while the client-side
// virtualizer takes over the full list once mounted.
const INITIAL_COUNT = 8

type Dictionary = ReturnType<typeof getDictionary>

function PostRow({
  post,
  locale,
  dictionary,
}: {
  post: HomePost
  locale: Locale
  dictionary: Dictionary
}) {
  const { slug, date, title, summary, tags } = post
  return (
    <article>
      <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
        <dl>
          <dt className="sr-only">{dictionary.home.publishedOn}</dt>
          <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
            <time dateTime={date}>{formatDate(date, getDateLocale(locale))}</time>
          </dd>
        </dl>
        <div className="space-y-5 xl:col-span-3">
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold leading-snug tracking-tight">
                <Link
                  href={`/${locale}/blog/${slug}`}
                  className="text-gray-900 transition-colors hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                >
                  {title}
                </Link>
              </h2>
              <div className="flex flex-wrap">
                {tags?.map((tag) => <Tag key={tag} text={tag} locale={locale} />)}
              </div>
            </div>
            <div className="prose max-w-none font-serif text-gray-600 dark:text-gray-300">
              {summary}
            </div>
          </div>
          <div className="text-base font-medium leading-6">
            <Link
              href={`/${locale}/blog/${slug}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`${dictionary.home.readMore}: "${title}"`}
            >
              {dictionary.home.readMore} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function VirtualPostList({ posts, locale }: { posts: HomePost[]; locale: Locale }) {
  const dictionary = getDictionary(locale)
  const listRef = useRef<HTMLUListElement>(null)
  const [mounted, setMounted] = useState(false)
  const [scrollMargin, setScrollMargin] = useState(0)

  const virtualizer = useWindowVirtualizer({
    count: posts.length,
    estimateSize: () => 340,
    overscan: 5,
    scrollMargin,
    getItemKey: (index) => posts[index].slug,
  })

  // Measure the list's document offset (its distance from the top of the page)
  // and switch from the static server list to the virtualized one after mount.
  // Recompute on resize so the virtual offset stays aligned across breakpoints.
  useEffect(() => {
    const measure = () => {
      if (listRef.current) {
        setScrollMargin(listRef.current.getBoundingClientRect().top + window.scrollY)
      }
    }
    measure()
    setMounted(true)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  if (!posts.length) {
    return <div className="pt-6">{dictionary.home.noPosts}</div>
  }

  // Server render + first client paint: only the initial batch, so the first
  // fetch stays light. The client virtualizer expands to the full list on mount.
  if (!mounted) {
    return (
      <ul ref={listRef}>
        {posts.slice(0, INITIAL_COUNT).map((post, index) => (
          <li key={post.slug} className={index === 0 ? ROW : `${DIVIDER} ${ROW}`}>
            <PostRow post={post} locale={locale} dictionary={dictionary} />
          </li>
        ))}
      </ul>
    )
  }

  // After mount: window-virtualized list — only the visible cards stay in the DOM
  // while the page scrolls through every post.
  return (
    <ul
      ref={listRef}
      style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}
    >
      {virtualizer.getVirtualItems().map((item) => {
        const post = posts[item.index]
        return (
          <li
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            className={item.index === 0 ? ROW : `${DIVIDER} ${ROW}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${item.start - scrollMargin}px)`,
            }}
          >
            <PostRow post={post} locale={locale} dictionary={dictionary} />
          </li>
        )
      })}
    </ul>
  )
}
