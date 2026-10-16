import { useCallback } from 'react'
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { isItalianProgress, progressDate, progressLocale, progressNumber, progressRelativeTime, progressPRMessage, type ProgressPRInput } from './progress-ui-labels'

/** Rendering adapters only. Keep the original records and all writer arguments. */
export function useProgressDisplay() {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const os = Platform.OS
  const italian = isItalianProgress(language, os)
  const number = useCallback((original: number | string) => progressNumber(String(original), language, os), [language, os])
  const date = useCallback((original: string, short = false) => progressDate(original, language, os, short), [language, os])
  const locale = useCallback((original: string) => progressLocale(original, language, os), [language, os])
  const relativeTime = useCallback((original: string, iso?: string) => progressRelativeTime(original, iso, language, os), [language, os])
  const text = useCallback((original: string, key: string) => italian ? t(key) : original, [italian, t])
  const prMessage = useCallback((original: string, input: ProgressPRInput) => progressPRMessage(original, input, language, os), [language, os])
  return { prMessage, italian, number, date, locale, relativeTime, text }
}
