import { defaultLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { withLocalePath } from '@/lib/i18n/paths'

export function getHeaderNavLinks(locale: Locale = defaultLocale) {
  const dictionary = getDictionary(locale)

  return [
    { href: withLocalePath(locale, '/'), title: dictionary.navigation.home },
    { href: withLocalePath(locale, '/blog'), title: dictionary.navigation.blog },
    { href: withLocalePath(locale, '/tags'), title: dictionary.navigation.tags },
    { href: withLocalePath(locale, '/about'), title: dictionary.navigation.about },
  ]
}

export default getHeaderNavLinks()
