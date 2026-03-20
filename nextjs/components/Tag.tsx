import Link from 'next/link'
import { slug } from 'github-slugger'
import { defaultLocale, type Locale } from '@/lib/i18n/config'
import { withLocalePath } from '@/lib/i18n/paths'

interface Props {
  text: string
  locale?: Locale
}

const Tag = ({ text, locale = defaultLocale }: Props) => {
  return (
    <Link
      href={withLocalePath(locale, `/tags/${slug(text)}`)}
      className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
