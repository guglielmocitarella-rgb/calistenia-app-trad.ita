import type { i18n, TFunction } from 'i18next'

export function isItalianNutrition(language: string, os: string): boolean {
  return os === 'android' && language.toLowerCase().split(/[-_]/)[0] === 'it'
}

// Only exact local UI literals. Never pass arbitrary food/recipe/user text here.
const TEXT_KEYS: Record<string, string> = {
  CONFIGURACIÓN: 'nutrition.setup.subtitle', RITMO: 'onboarding.pace',
  RESUMEN: 'nutrition.setup.dataSummary', 'MACROS CALCULADOS': 'nutrition.setup.calculatedMacros',
  Sedentario: 'nutrition.activity.sedentary', Ligero: 'nutrition.activity.light',
  Moderado: 'nutrition.activity.moderate', Activo: 'nutrition.activity.active', 'Muy activo': 'nutrition.activity.veryActive',
  'Ganar músculo': 'nutrition.goal.muscleGain', 'Perder grasa': 'nutrition.goal.fatLoss',
  Recomposición: 'nutrition.goal.recomp', Mantener: 'nutrition.goal.maintain',
  Gradual: 'onboarding.paceGradual', Equilibrado: 'onboarding.paceBalanced', Agresivo: 'onboarding.paceAggressive',
  PROT: 'nutrition.protein', CARBS: 'nutrition.carbs',
  'Nombre del alimento': 'nutrition.foodNamePlaceholder', Todo: 'nutrition.logger.all',
  NUTRICIÓN: 'nutrition.title', COMIDAS: 'nutrition.summary.mealsLabel',
  PROTEÍNA: 'nutrition.protein', CARBOS: 'nutrition.carbs', GRASA: 'nutrition.fat',
  AGUA: 'nutrition.water', COMPARTIR: 'common.share',
}

const LOCAL_TEXT: Record<string, string> = {
  'Calidad pendiente': 'Qualità in attesa', Calidad: 'Qualità', 'Calidad del día': 'Qualità del giorno',
  'Ver cómo se calcula': 'Scopri come viene calcolata', 'Compartir nutrición': 'Condividi nutrizione',
  MACRONUTRIENTES: 'Macronutrienti', más: 'in più', 'g/ud': 'g/pz',
  'g prot': 'g proteine', 'g carbs': 'g carboidrati', 'g grasa': 'g grassi',
}

export function nutritionText(original: string, language: string, os: string, t: TFunction): string {
  if (!isItalianNutrition(language, os)) return original
  if (Object.hasOwn(TEXT_KEYS, original)) return t(TEXT_KEYS[original])
  return Object.hasOwn(LOCAL_TEXT, original) ? LOCAL_TEXT[original] : original
}

export function nutritionMealLabel(type: string, original: string, language: string, os: string, t: TFunction): string {
  return isItalianNutrition(language, os) && ['desayuno', 'almuerzo', 'cena', 'snack'].includes(type)
    ? t(`meal.${type}`) : original
}

export function nutritionUnitLabel(original: string, language: string, os: string): string {
  return isItalianNutrition(language, os) && ['unidad', 'ud', 'unidades'].includes(original) ? 'pz' : original
}

export function nutritionLocale(original: string, language: string, os: string): string {
  return isItalianNutrition(language, os) ? 'it-IT' : original
}

// Accepts already formatted display text, never numbers destined for an input or payload.
export function nutritionNumber(original: string, language: string, os: string, unit = ''): string {
  if (!isItalianNutrition(language, os)) return original
  const label = unit && original.endsWith(` ${unit}`)
    ? original.slice(0, -unit.length) + nutritionUnitLabel(unit, language, os) : original
  return label.replace(/(\d)\.(?=\d)/g, '$1,')
}

export function pantryExampleCommand(key: string, language: string, i18n: i18n): string {
  // In baseline 21f3bc9e the IT catalogue contained these exact English examples.
  // Preserve that command even when the account's historical content locale is ES.
  return i18n.getFixedT(language.toLowerCase().split(/[-_]/)[0] === 'it' ? 'en' : language)(key)
}

export function nutritionShareMessage(original: string, input: { userName?: string; date: string; calories: number; goalCalories?: number; qualityScore?: string }, language: string, os: string): string {
  if (!isItalianNutrition(language, os)) return original
  const { userName, date, calories, goalCalories, qualityScore } = input
  let message = `${userName ? `${userName} · ` : ''}La mia nutrizione del ${date}: ${calories} kcal`
  if (goalCalories) message += ` / ${goalCalories}`
  if (qualityScore) message += ` · Qualità ${qualityScore}`
  return message
}
