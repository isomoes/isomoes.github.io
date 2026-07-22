import siteMetadata from '@/data/siteMetadata'
import { type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import VirtualPostList, { type HomePost } from '@/components/VirtualPostList'
import NewsletterForm from 'pliny/ui/NewsletterForm'

export default function Home({ posts, locale }: { posts: HomePost[]; locale: Locale }) {
  const dictionary = getDictionary(locale)

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl md:text-4xl">
            {dictionary.home.title}
          </h1>
        </div>
        <VirtualPostList posts={posts} locale={locale} />
      </div>
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
