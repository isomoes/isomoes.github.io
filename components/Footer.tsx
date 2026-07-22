import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { defaultLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { withLocalePath } from '@/lib/i18n/paths'

export default function Footer({ locale = defaultLocale }: { locale?: Locale }) {
  const dictionary = getDictionary(locale)

  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="bilibili" href={siteMetadata.bilibili} size={6} />
          <SocialIcon kind="rss" href={withLocalePath(locale, siteMetadata.rss)} size={6} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href={withLocalePath(locale, '/')}>{siteMetadata.title}</Link>
          <div>{`·`}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">
            {dictionary.footer.themeCredit}
          </Link>
        </div>
      </div>
    </footer>
  )
}
