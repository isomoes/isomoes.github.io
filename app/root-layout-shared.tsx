import {
  Source_Serif_4,
  Geist,
  JetBrains_Mono,
  Noto_Serif_SC,
  Noto_Sans_SC,
} from 'next/font/google'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { locales } from '@/lib/i18n/config'
import { buildLocaleAlternates } from '@/lib/i18n/metadata'
import { ThemeProviders } from './theme-providers'
import { getMetadataLocale, getOpenGraphLocale } from './seo'

// Reading serif (Latin) + matched CJK serif. Chrome sans (Latin) + matched CJK sans. Code mono.
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

// CJK faces are large, so never preload them: next/font keeps the unicode-range
// slicing, so browsers only fetch the slices for glyphs actually on the page.
const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-serif-sc',
  preload: false,
})

const notoSansSC = Noto_Sans_SC({
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-sans-sc',
  preload: false,
})

const rootPathname = '/'
const rootLocale = getMetadataLocale(rootPathname)

const rootAlternates = buildLocaleAlternates({
  locale: rootLocale,
  pathname: rootPathname,
  availableLocales: locales,
})

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: getOpenGraphLocale(rootLocale),
    type: 'website',
  },
  alternates: {
    canonical: rootAlternates.canonical,
    languages: rootAlternates.languages,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export function RootDocument({ children, lang }: { children: React.ReactNode; lang: string }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={lang}
      className={`${sourceSerif.variable} ${geist.variable} ${jetbrainsMono.variable} ${notoSerifSC.variable} ${notoSansSC.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>{children}</ThemeProviders>
      </body>
    </html>
  )
}
