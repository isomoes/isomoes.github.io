'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'

type NavLink = { href: string; title: string }

// Locale-root hrefs (e.g. "/en") are a prefix of every localized route, so
// only exact-match those; deeper links (>=2 segments) may prefix-match.
const isActive = (pathname: string, href: string) =>
  pathname === href || (href.split('/').length > 2 && pathname.startsWith(`${href}/`))

const HeaderNavLinks = ({ links }: { links: NavLink[] }) => {
  const pathname = usePathname() ?? ''

  return (
    <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto pr-2 sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
      {links.map((link) => {
        const active = isActive(pathname, link.href)
        return (
          <Link
            key={link.title}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`m-1 block font-medium transition-colors ${
              active
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400'
            }`}
          >
            {link.title}
          </Link>
        )
      })}
    </div>
  )
}

export default HeaderNavLinks
