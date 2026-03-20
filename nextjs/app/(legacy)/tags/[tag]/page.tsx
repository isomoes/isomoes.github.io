import LegacyRedirectPage from '@/components/LegacyRedirectPage'
import legacyRedirects from '@/lib/generated/legacy-redirects.json'

export async function generateStaticParams() {
  return legacyRedirects.tags
}

export default async function LegacyTagPage(props: { params: Promise<{ tag: string }> }) {
  const { tag } = await props.params

  return <LegacyRedirectPage target={`/en/tags/${tag}`} />
}
