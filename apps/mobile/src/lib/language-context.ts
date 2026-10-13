import type { CoreStorage } from '@calistenia/core/platform'
import { resolveAndroidContentLanguage, resolveAndroidServerLanguage } from '@calistenia/core/lib/android-language'

/** Preferencia local por cuenta: jamás hereda la del usuario anterior. */
export function createLanguageContext(storage: CoreStorage, getUser: () => { id: string; language?: string } | null) {
  const key = () => `androidContentLanguage:${getUser()?.id ?? 'guest'}`
  const historical = () => storage.getItem(key()) ?? getUser()?.language
  const content = (ui: string) => {
    const language = resolveAndroidContentLanguage(ui, historical())
    if (storage.getItem(key()) !== language) storage.setItem(key(), language)
    return language
  }
  return {
    content,
    server: (ui: string, stored?: string | null) => resolveAndroidServerLanguage(ui, stored, historical()),
  }
}
