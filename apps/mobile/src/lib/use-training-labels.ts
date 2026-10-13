import { Platform } from 'react-native'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { TOptions } from 'i18next'
import { trainingCategoryLabel, trainingRepsLabel, trainingUiLabel } from './training-ui-labels'

export function useTrainingLabels() {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const label = useCallback((source: string, key?: string, options?: TOptions) => trainingUiLabel(source, key, language, Platform.OS, t, options), [language, t])
  const categoryLabel = useCallback((category: string) => trainingCategoryLabel(category, language, Platform.OS, t), [language, t])
  const repsLabel = useCallback((source: string, fallback = source) => trainingRepsLabel(source, fallback, language, Platform.OS), [language])
  return { label, categoryLabel, repsLabel }
}
