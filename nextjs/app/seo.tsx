import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { defaultLocale, locales, type Locale } from '@/lib/i18n/config'
import { buildLocaleAlternates } from '@/lib/i18n/metadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  locale?: Locale
  pathname?: string
  availableLocales?: readonly Locale[]
  alternates?: Metadata['alternates']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
}

export function getOpenGraphLocale(locale: Locale): string {
  return OPEN_GRAPH_LOCALES[locale]
}

export function getMetadataLocale(pathname: string, locale?: Locale): Locale {
  if (locale) {
    return locale
  }

  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const localeSegment = normalizedPathname.split('/')[1]

  return locales.find((candidate) => candidate === localeSegment) ?? defaultLocale
}

export function genPageMetadata({
  title,
  description,
  image,
  locale,
  pathname = '/',
  availableLocales = locales,
  alternates,
  ...rest
}: PageSEOProps): Metadata {
  const metadataLocale = getMetadataLocale(pathname, locale)
  const localeAlternates = buildLocaleAlternates({
    locale: metadataLocale,
    pathname,
    availableLocales,
  })

  return {
    title,
    description: description || siteMetadata.description,
    alternates: {
      ...alternates,
      canonical: localeAlternates.canonical,
      languages: {
        ...alternates?.languages,
        ...localeAlternates.languages,
      },
    },
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: getOpenGraphLocale(metadataLocale),
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }
}
