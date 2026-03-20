import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import { rootMetadata, RootDocument } from '../../root-layout-shared'
import { withLocalePath } from '@/lib/i18n/paths'
import { isLocale } from '@/lib/i18n/paths'
import { locales } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'

export const metadata = rootMetadata

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const searchConfig =
    siteMetadata.search?.provider === 'kbar'
      ? {
          ...siteMetadata.search,
          kbarConfig: {
            ...siteMetadata.search.kbarConfig,
            searchDocumentsPath: `${process.env.BASE_PATH || ''}${withLocalePath(locale, '/search.json')}`,
          },
        }
      : siteMetadata.search

  return (
    <RootDocument lang={locale}>
      <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
      <SectionContainer>
        <SearchProvider searchConfig={searchConfig as SearchConfig}>
          <Header locale={locale} />
          <main className="mb-auto">{children}</main>
        </SearchProvider>
        <Footer locale={locale} />
      </SectionContainer>
    </RootDocument>
  )
}
