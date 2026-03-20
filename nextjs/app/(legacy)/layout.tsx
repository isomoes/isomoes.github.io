import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { rootMetadata, RootDocument } from '../root-layout-shared'

export const metadata = rootMetadata

export default function LegacyRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>
}
