/** Idioma del contrato LOCAL Android. No se usa en payloads de servicios. */
export type WidgetLanguage = 'es' | 'en' | 'it'
export function widgetLanguage(value?: string | null, platform = 'android'): WidgetLanguage {
  if (platform !== 'android') return value?.startsWith('en') ? 'en' : 'es'
  const base = value?.toLowerCase().split(/[-_]/)[0]
  return base === 'it' || base === 'en' ? base : 'es'
}
/** Dizionari IT locali; snapshot precedenti conservano il fallback ES/EN. */
export function widgetStrings<T>(strings: { es: T; en: T; it?: T }, language?: string | null): T {
  const locale = widgetLanguage(language)
  return locale === 'it' ? strings.it ?? strings.en : strings[locale]
}
