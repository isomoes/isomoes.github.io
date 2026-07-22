import siteMetadata from '@/data/siteMetadata'
import { getHeaderNavLinks } from '@/data/headerNavLinks'
import Link from './Link'
import HeaderNavLinks from './HeaderNavLinks'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import LocaleSwitcher from './LocaleSwitcher'
import { defaultLocale, type Locale } from '@/lib/i18n/config'
import { withLocalePath } from '@/lib/i18n/paths'

const Header = ({ locale = defaultLocale }: { locale?: Locale }) => {
  let headerClass =
    'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-4 md:py-6'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  const headerNavLinks = getHeaderNavLinks(locale)

  return (
    <header className={headerClass}>
      <Link href={withLocalePath(locale, '/')} aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="text-xl font-semibold sm:text-2xl">{siteMetadata.headerTitle}</div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <HeaderNavLinks links={headerNavLinks.filter((link) => link.href !== '/')} />
        <LocaleSwitcher currentLocale={locale} />
        <SearchButton locale={locale} />
        <ThemeSwitch />
        <MobileNav locale={locale} />
      </div>
    </header>
  )
}

export default Header
