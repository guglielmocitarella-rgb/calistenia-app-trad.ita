import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { secondaryLabel } from './secondary-ui-labels'
import { progressNumber, isItalianProgress } from './progress-ui-labels'

/** Rendering only; the source data and service language stay unchanged. */
export function useSecondaryDisplay() {
  const { i18n } = useTranslation()
  return {
    label: (original: string) => secondaryLabel(original, i18n.language, Platform.OS),
    locale: (original: string | undefined) => isItalianProgress(i18n.language, Platform.OS) ? 'it-IT' : original,
    number: (original: string) => progressNumber(original, i18n.language, Platform.OS),
  }
}
