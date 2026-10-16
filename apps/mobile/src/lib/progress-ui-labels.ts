/** Display only: never use these strings in editable state, filters, calculations or payloads. */
export function isItalianProgress(language: string, os: string): boolean {
  return os === 'android' && language.toLowerCase().split(/[-_]/)[0] === 'it'
}

export function progressNumber(original: string, language: string, os: string): string {
  return isItalianProgress(language, os) && /^[+-]?\d+(?:\.\d+)?$/.test(original)
    ? original.replace('.', ',') : original
}

export function progressLocale(original: string, language: string, os: string): string {
  return isItalianProgress(language, os) ? 'it-IT' : original
}

export function progressDate(original: string, language: string, os: string, short = false): string {
  if (!isItalianProgress(language, os) || !/^\d{4}-\d{2}-\d{2}$/.test(original)) return original
  const date = new Date(`${original}T12:00:00Z`)
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== original) return original
  const [year, month, day] = original.split('-')
  return short ? `${day}/${month}` : `${day}/${month}/${year}`
}

export function progressRelativeTime(original: string, iso: string | undefined, language: string, os: string, now = Date.now()): string {
  if (!isItalianProgress(language, os) || !iso) return original
  const hours = Math.floor((now - new Date(iso).getTime()) / 3_600_000)
  if (!Number.isFinite(hours)) return original
  if (hours < 1) return 'ora'
  if (hours < 24) return `${hours} h fa`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'ieri' : `${days} g fa`
}

export interface ProgressPRInput {
  exerciseName: string
  userName?: string
  oldValue?: number | null
  newValue: number
}

export function progressPRMessage(original: string, input: ProgressPRInput, language: string, os: string): string {
  if (!isItalianProgress(language, os)) return original
  const { exerciseName, userName, oldValue, newValue } = input
  const prefix = `${userName ? `${userName}: ` : ''}${exerciseName}: `
  const body = `${prefix}${oldValue ?? 0} → ${newValue} reps 🏆`
  if (!original.startsWith(body)) return original
  return `${prefix}${progressNumber(String(oldValue ?? 0), language, os)} → ${progressNumber(String(newValue), language, os)} rip. 🏆${original.slice(body.length)}`
}
