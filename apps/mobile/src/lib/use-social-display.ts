import { getBeginnerChallengePreset } from '@calistenia/core/lib/challenge-presets'
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { socialLabel, socialRelativeTime, socialPresetLabel } from './social-ui-labels'
import { progressDate, progressLocale, progressNumber } from './progress-ui-labels'

/** Rendering only: never pass results into state, query keys or mutations. */
export function useSocialDisplay() {
  const { i18n } = useTranslation()
  const language = i18n.language
  const os = Platform.OS
  return {
    presetKey: (original: string, key: string) => socialPresetLabel(original, key, language, os),
    preset: (original: string, record: { preset_key?: string }, description = false) => {
      const preset = record.preset_key ? getBeginnerChallengePreset(record.preset_key) : null
      return preset ? socialPresetLabel(original, description ? preset.descriptionKey : preset.titleKey, language, os) : original
    },
    label: (original: string) => socialLabel(original, language, os),
    time: (original: string, iso: string) => socialRelativeTime(original, iso, language, os),
    number: (original: string) => progressNumber(original, language, os),
    locale: (original: string) => progressLocale(original, language, os),
    date: (original: string) => progressDate(original, language, os),
  }
}
