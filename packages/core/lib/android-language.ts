/** Políticas explícitas del adaptador Android; no se aplican a otros clientes. */
export type CompatibleLanguage = 'es' | 'en'
export function compatibleLanguage(value: string | null | undefined): CompatibleLanguage | null {
  return value === 'es' || value === 'en' ? value : null
}
export function resolveAndroidContentLanguage(ui: string, historical?: string | null): CompatibleLanguage {
  return compatibleLanguage(ui) ?? compatibleLanguage(historical) ?? 'en'
}
export function resolveAndroidServerLanguage(ui: string, stored?: string | null, historical?: string | null): CompatibleLanguage {
  return compatibleLanguage(ui) ?? compatibleLanguage(stored) ?? compatibleLanguage(historical) ?? 'en'
}

/** Wger tiene un contrato y un default propios: español, también con UI IT. */
export function resolveAndroidWgerLanguage(requested: string): CompatibleLanguage {
  return compatibleLanguage(requested) ?? 'es'
}
