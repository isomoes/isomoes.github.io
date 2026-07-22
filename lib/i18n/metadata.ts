import type { Locale } from './config'
import { withLocalePath } from './paths'

type BuildLocaleAlternatesInput<TAvailableLocales extends readonly Locale[]> = {
  locale: TAvailableLocales[number]
  pathname: string
  availableLocales: TAvailableLocales
}

type LocaleAlternates<TAvailableLocales extends readonly Locale[]> = {
  canonical: string
  languages: Record<TAvailableLocales[number], string>
}

export function buildLocaleAlternates<TAvailableLocales extends readonly Locale[]>({
  locale,
  pathname,
  availableLocales,
}: BuildLocaleAlternatesInput<TAvailableLocales>): LocaleAlternates<TAvailableLocales> {
  return {
    canonical: withLocalePath(locale, pathname),
    languages: Object.fromEntries(
      availableLocales.map((availableLocale) => [availableLocale, withLocalePath(availableLocale, pathname)]),
    ) as LocaleAlternates<TAvailableLocales>['languages'],
  }
}
