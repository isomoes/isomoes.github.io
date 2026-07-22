import { AlgoliaButton } from 'pliny/search/AlgoliaButton'
import { KBarButton } from 'pliny/search/KBarButton'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import siteMetadata from '@/data/siteMetadata'
import { defaultLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

const SearchButton = ({ locale = defaultLocale }: { locale?: Locale }) => {
  if (
    siteMetadata.search &&
    (siteMetadata.search.provider === 'algolia' || siteMetadata.search.provider === 'kbar')
  ) {
    const SearchButtonWrapper =
      siteMetadata.search.provider === 'algolia' ? AlgoliaButton : KBarButton
    const dictionary = getDictionary(locale)

    return (
      <SearchButtonWrapper aria-label={dictionary.search.label}>
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400" />
      </SearchButtonWrapper>
    )
  }
}

export default SearchButton
