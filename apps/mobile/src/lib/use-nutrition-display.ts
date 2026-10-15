import { nutritionBadgeText } from './nutrition-badge-labels'
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { isItalianNutrition, nutritionText, nutritionMealLabel, nutritionUnitLabel, nutritionLocale, nutritionNumber, nutritionShareMessage } from './nutrition-ui-labels'
import { nutritionServiceError } from './nutrition-service-error'

/** Rendering only. Do not use the results in editable state or API arguments. */
export function useNutritionDisplay() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const os = Platform.OS
  return {
    italian: isItalianNutrition(lang, os),
    badge: (id: string, field: 'label' | 'description', original: string) => nutritionBadgeText(id, field, original, lang, os),
    text: (original: string) => nutritionText(original, lang, os, t),
    meal: (type: string, original = type) => nutritionMealLabel(type, original, lang, os, t),
    unit: (original: string) => nutritionUnitLabel(original, lang, os),
    locale: (original: string) => nutritionLocale(original, lang, os),
    number: (original: string) => nutritionNumber(original, lang, os),
    quantity: (original: string, unit: string) => nutritionNumber(original, lang, os, unit),
    shareMessage: (original: string, input: Parameters<typeof nutritionShareMessage>[1]) => nutritionShareMessage(original, input, lang, os),
    serviceError: (message: string | null | undefined, fallback: string) => nutritionServiceError(message, lang, os, fallback),
  }
}
