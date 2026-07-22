import LegacyRedirectPage from '@/components/LegacyRedirectPage'
import legacyRedirects from '@/lib/generated/legacy-redirects.json'

export async function generateStaticParams() {
  return legacyRedirects.blogSlugs
}

export default async function LegacyBlogPostPage(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params

  return <LegacyRedirectPage target={`/en/blog/${slug.join('/')}`} />
}
