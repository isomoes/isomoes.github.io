import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale } from '@/lib/i18n/paths'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params

  if (!isLocale(locale)) {
    return
  }

  return genPageMetadata({
    title: getDictionary(locale).about.title,
    locale,
    pathname: `/${locale}/about`,
  })
}

export default async function LocalizedAboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params

  if (!isLocale(locale)) {
    notFound()
  }

  const author =
    (allAuthors.find((entry) => entry.slug === `${locale}/default`) as Authors | undefined) ??
    (allAuthors.find((entry) => entry.slug === 'default') as Authors | undefined)

  if (!author) {
    notFound()
  }

  return (
    <AuthorLayout
      content={coreContent(author)}
      title={getDictionary(locale).about.title}
      locale={locale}
    >
      <MDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}
