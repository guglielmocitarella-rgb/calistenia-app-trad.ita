import { beforeAll, describe, expect, it } from 'vitest'
import { createInstance } from 'i18next'
import en from '../../../../../packages/core/locales/en/translation.json'
import es from '../../../../../packages/core/locales/es/translation.json'
import italian from '../../../../../packages/core/locales/it/translation.json'
import { nutritionBadgeText } from '../nutrition-badge-labels'
import { BADGE_DEFINITIONS } from '../../../../../packages/core/lib/badge-definitions'
import { nutritionText, nutritionMealLabel, nutritionUnitLabel, nutritionLocale, nutritionNumber, pantryExampleCommand, nutritionShareMessage } from '../nutrition-ui-labels'

const i18n = createInstance()
beforeAll(async () => {
  await i18n.init({ resources: { en: { translation: en }, es: { translation: es }, it: { translation: italian } }, lng: 'it', fallbackLng: 'en' })
})

describe('Android nutrition rendering without changing source data', () => {
  it('renders known meal enums while keeping remote names and serializable records original', () => {
    const meal = Object.freeze({ meal_type: 'desayuno', label: 'Tortilla original', unit: 'unidad', amount: 1.5 })
    const before = JSON.stringify(meal)
    expect(nutritionMealLabel(meal.meal_type, meal.meal_type, 'it-IT', 'android', i18n.t)).toBe('Colazione')
    expect(nutritionMealLabel('custom', meal.label, 'it', 'android', i18n.t)).toBe(meal.label)
    expect(nutritionUnitLabel(meal.unit, 'it', 'android')).toBe('pz')
    expect(nutritionUnitLabel('scoop', 'it', 'android')).toBe('scoop')
    expect(JSON.stringify(meal)).toBe(before)
  })

  it('renders local nutrition badges by identity without changing their definitions', () => {
    const before = JSON.stringify(BADGE_DEFINITIONS)
    expect(nutritionBadgeText('first_a', 'label', BADGE_DEFINITIONS.first_a.label, 'it', 'android')).toBe('Prima A')
    expect(nutritionBadgeText('no_e_week', 'description', BADGE_DEFINITIONS.no_e_week.description, 'it', 'android')).toBe('Una settimana intera senza pasti con punteggio E')
    expect(nutritionBadgeText('first_a', 'label', 'Primera A', 'es', 'android')).toBe('Primera A')
    expect(nutritionBadgeText('unknown', 'label', 'Original', 'it', 'android')).toBe('Original')
    expect(JSON.stringify(BADGE_DEFINITIONS)).toBe(before)
  })

  it('preserves every fallback outside Android Italian', () => {
    for (const [lang, os] of [['en', 'android'], ['es', 'android'], ['it', 'ios']]) {
      expect(nutritionText('CONFIGURACIÓN', lang, os, i18n.t)).toBe('CONFIGURACIÓN')
      expect(nutritionMealLabel('desayuno', 'Original', lang, os, i18n.t)).toBe('Original')
      expect(nutritionUnitLabel('unidad', lang, os)).toBe('unidad')
      expect(nutritionLocale('es-ES', lang, os)).toBe('es-ES')
      expect(nutritionNumber('1.5', lang, os)).toBe('1.5')
    }
  })

  it('uses Italian visual decimals and date locale without parsing or changing numbers', () => {
    expect(nutritionNumber('1.5', 'it', 'android')).toBe('1,5')
    expect(nutritionNumber('1.5 unidad', 'it', 'android', 'unidad')).toBe('1,5 pz')
    expect(nutritionNumber('1.5 unidad', 'en', 'android', 'unidad')).toBe('1.5 unidad')
    expect(nutritionNumber('0.0', 'it', 'android')).toBe('0,0')
    expect(nutritionLocale('es', 'it-IT', 'android')).toBe('it-IT')
    expect(nutritionText('CONFIGURACIÓN', 'it', 'android', i18n.t)).toBe('Configurazione')
    expect(nutritionText('Remote recipe name', 'it', 'android', i18n.t)).toBe('Remote recipe name')
  })

  it('keeps pantry example commands byte-identical to the original UI catalogue fallback', () => {
    expect(pantryExampleCommand('pantry.example1', 'it', i18n)).toBe(en['pantry.example1'])
    expect(pantryExampleCommand('pantry.example1', 'it-IT', i18n)).toBe(en['pantry.example1'])
    expect(pantryExampleCommand('pantry.example1', 'en', i18n)).toBe(en['pantry.example1'])
    expect(pantryExampleCommand('pantry.example2', 'es', i18n)).toBe(es['pantry.example2'])
  })

  it('localizes only the generated native share message and preserves original data and fallbacks', () => {
    const input = Object.freeze({ userName: 'Original name', date: '2026-10-14', calories: 500, goalCalories: 2000, qualityScore: 'A' })
    expect(nutritionShareMessage('Original message', input, 'it', 'android')).toBe('Original name · La mia nutrizione del 2026-10-14: 500 kcal / 2000 · Qualità A')
    expect(nutritionShareMessage('Original message', input, 'en', 'android')).toBe('Original message')
    expect(nutritionShareMessage('Original message', input, 'it', 'ios')).toBe('Original message')
    expect(nutritionShareMessage('Original message', { date: '2026-10-14', calories: 0 }, 'it', 'android')).toBe('La mia nutrizione del 2026-10-14: 0 kcal')
    expect(input.userName).toBe('Original name')
    expect(input.goalCalories).toBe(2000)
  })

  it('resolves Italian nutrition plurals and preserves interpolation identifiers', () => {
    expect(i18n.t('nutrition.foodCount', { count: 1 })).toBe('1 alimento')
    expect(i18n.t('nutrition.foodCount', { count: 2 })).toBe('2 alimenti')
    expect(i18n.t('nutrition.photoOf', { meal: 'Original name' })).toBe('Foto di Original name')
    expect(i18n.t('pantryPlan.limitedBy', { ingredient: 'pollo' })).toContain('pollo')
  })
})
