import LegacyRedirectPage from '@/components/LegacyRedirectPage'
import legacyRedirects from '@/lib/generated/legacy-redirects.json'

export async function generateStaticParams() {
  return legacyRedirects.blogPages
}

export default async function LegacyBlogPaginationPage(props: {
  params: Promise<{ page: string }>
}) {
  const { page } = await props.params

  return <LegacyRedirectPage target={`/en/blog/page/${page}`} />
}
