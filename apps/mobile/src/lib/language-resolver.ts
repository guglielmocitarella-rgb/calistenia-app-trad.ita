/** Resolve the preferred language for the Android app. */
export type SupportedLanguage = 'es' | 'en' | 'it'

export function resolveInitialLanguage(
  deviceLang: string | null | undefined,
  saved?: string | null,
): SupportedLanguage {
  if (saved && ['es', 'en', 'it'].includes(saved.toLowerCase())) {
    return saved.toLowerCase() as SupportedLanguage
  }
  const device = deviceLang?.toLowerCase() ?? ''
  if (device.startsWith('it')) return 'it'
  if (device.startsWith('es')) return 'es'
  return 'en'
}
