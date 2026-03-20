import Card from '@/components/Card'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import { genPageMetadata } from 'app/seo'
import { getProjectsData } from '@/data/projectsData'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isLocale } from '@/lib/i18n/paths'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params

  if (!isLocale(locale)) {
    return
  }

  const dictionary = getDictionary(locale)

  return genPageMetadata({
    title: dictionary.projects.title,
    description: dictionary.projects.description,
    locale,
    pathname: `/${locale}/projects`,
  })
}

export default async function LocalizedProjectsPage(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params

  if (!isLocale(locale)) {
    notFound()
  }

  const dictionary = getDictionary(locale)
  const projects = getProjectsData(locale)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <LocaleSwitcher currentLocale={locale} />
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          {dictionary.projects.title}
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          {dictionary.projects.description}
        </p>
      </div>
      <div className="container py-12">
        <div className="-m-4 flex flex-wrap">
          {projects.map((project) => (
            <Card
              key={project.title}
              title={project.title}
              description={project.description}
              imgSrc={project.imgSrc}
              href={project.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
