'use client'

import { useEffect } from 'react'
import { type Locale } from '@/lib/i18n/config'
import { storeLocale } from '@/lib/i18n/locale-storage'

/**
 * Records the locale of the page currently being viewed so that locale-free
 * entry points (the root redirect and legacy section pages) can restore the
 * reader's last language on their next visit. Renders nothing.
 */
export default function LocalePersister({ locale }: { locale: Locale }) {
  useEffect(() => {
    storeLocale(locale)
  }, [locale])

  return null
}
