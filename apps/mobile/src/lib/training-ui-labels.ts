import type { i18n, TFunction, TOptions } from 'i18next'
import literals from './training-ui.it.json'
import repetitionLabels from './training-reps.it.json'
import { localizeReps } from '@calistenia/core/lib/localize-reps'

function isAndroidItalian(language: string, os: string): boolean {
  return os === 'android' && language.toLowerCase().split('-')[0] === 'it'
}

// Rendering only. Never use these values in editor state, sessions or API messages.
export function trainingUiLabel(source: string, key: string | undefined, language: string, os: string, t?: TFunction, options?: TOptions): string {
  if (!isAndroidItalian(language, os)) return source
  if (key && t) return t(key, options ?? {})
  return Object.hasOwn(literals, source) ? literals[source as keyof typeof literals] : source
}

const CATEGORY_KEYS: Record<string, string> = {
  push: 'exerciseLibrary.category.push', pull: 'exerciseLibrary.category.pull',
  legs: 'exerciseLibrary.category.legs', core: 'exerciseLibrary.category.core',
  lumbar: 'exerciseLibrary.category.glutes_lower_back', glutes_lower_back: 'exerciseLibrary.category.glutes_lower_back',
  full: 'exerciseLibrary.category.full', full_body: 'exerciseLibrary.category.full',
  movilidad: 'exerciseLibrary.category.mobility', mobility: 'exerciseLibrary.category.mobility',
  skill: 'exerciseLibrary.category.skills', skills: 'exerciseLibrary.category.skills',
  yoga: 'exerciseLibrary.category.yoga', cardio: 'exerciseLibrary.category.cardio',
  todos: 'exerciseLibrary.category.todos',
}

export function trainingCategoryLabel(category: string, language: string, os: string, t: TFunction): string {
  const key = Object.hasOwn(CATEGORY_KEYS, category) ? CATEGORY_KEYS[category] : undefined
  return trainingUiLabel(category.replace(/_/g, ' '), key, language, os, t)
}

// Before 4B these four IT strings were English. Preserve that exact AI input.
export function trainingSuggestionMessage(key: string, language: string, os: string, i18n: i18n): string {
  return i18n.getFixedT(isAndroidItalian(language, os) ? 'en' : language)(key)
}

const REPS_RULES: [RegExp, string][] = [
  [/\bper side\b/gi, 'per lato'], [/\bper leg\b/gi, 'per gamba'],
  [/\bper arm\b/gi, 'per braccio'], [/\bper direction\b/gi, 'per direzione'],
  [/\bper position\b/gi, 'per posizione'], [/\blowering\b/gi, 'discesa'],
  [/\bnegatives\b/gi, 'negative'], [/\beach\b/gi, 'ciascuno'],
  [/\bof attempts\b/gi, 'di tentativi'], [/\bfree\b/gi, 'libere'],
  [/\breps\b/gi, 'ripetizioni'],
]

export function trainingRepsLabel(source: string, fallback: string, language: string, os: string): string {
  if (!isAndroidItalian(language, os)) return fallback
  if (Object.hasOwn(repetitionLabels, source)) return repetitionLabels[source as keyof typeof repetitionLabels]
  let text = localizeReps(source, 'en')
  for (const [pattern, replacement] of REPS_RULES) text = text.replace(pattern, replacement)
  return text
}
