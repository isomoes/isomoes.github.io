'use client'

import { useEffect } from 'react'

type LegacyRedirectPageProps = {
  target: string
}

function getRedirectHref(target: string) {
  if (typeof window === 'undefined') {
    return target
  }

  return `${target}${window.location.search}${window.location.hash}`
}

export default function LegacyRedirectPage({ target }: LegacyRedirectPageProps) {
  useEffect(() => {
    window.location.replace(getRedirectHref(target))
  }, [target])

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Redirecting...</h1>
      <p className="text-base text-gray-600 dark:text-gray-400">
        If you are not redirected automatically, continue to{' '}
        <a className="font-medium text-primary-500 hover:text-primary-600" href={target}>
          {target}
        </a>
        .
      </p>
    </main>
  )
}
