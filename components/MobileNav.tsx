'use client'

import { Dialog, Transition } from '@headlessui/react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Fragment, useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from './Link'
import { getHeaderNavLinks } from '@/data/headerNavLinks'
import { defaultLocale, type Locale } from '@/lib/i18n/config'

const MobileNav = ({ locale = defaultLocale }: { locale?: Locale }) => {
  const [navShow, setNavShow] = useState(false)
  const navRef = useRef(null)
  const pathname = usePathname() ?? ''
  const headerNavLinks = getHeaderNavLinks(locale)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })

  return (
    <>
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="sm:hidden">
        <Bars3Icon className="h-8 w-8 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400" />
      </button>
      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={onToggleNav} unmount={false}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div className="fixed inset-0 z-60 bg-black/25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-95"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-95"
            leaveTo="translate-x-full opacity-0"
            unmount={false}
          >
            <Dialog.Panel className="fixed left-0 top-0 z-70 h-full w-full bg-white opacity-95 duration-300 dark:bg-gray-950 dark:opacity-[0.98]">
              <nav
                ref={navRef}
                className="mt-8 flex h-full basis-0 flex-col items-start overflow-y-auto pl-12 pt-2 text-left"
              >
                {headerNavLinks.map((link) => {
                  const active =
                    pathname === link.href ||
                    (link.href.split('/').length > 2 && pathname.startsWith(`${link.href}/`))
                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`mb-4 py-2 pr-4 text-2xl font-bold outline outline-0 ${
                        active
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400'
                      }`}
                      onClick={onToggleNav}
                    >
                      {link.title}
                    </Link>
                  )
                })}
              </nav>

              <button
                className="fixed right-4 top-7 z-80 h-16 w-16 p-4 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                aria-label="Toggle Menu"
                onClick={onToggleNav}
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
