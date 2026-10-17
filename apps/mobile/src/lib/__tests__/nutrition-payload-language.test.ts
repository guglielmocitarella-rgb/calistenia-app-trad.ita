import { afterEach, beforeAll, expect, it, vi } from 'vitest'
import { createInstance } from 'i18next'
import en from '../../../../../packages/core/locales/en/translation.json'
import es from '../../../../../packages/core/locales/es/translation.json'
import italian from '../../../../../packages/core/locales/it/translation.json'
import { nutritionMealLabel, nutritionUnitLabel } from '../nutrition-ui-labels'
import { submitAnalyzeMealJob, submitMealPlanJob, submitWeeklyMealPlanJob } from '../../../../../packages/core/lib/ai-jobs-api'
import { generatePantryDayPlan, parsePantry, matchConsumption } from '../../../../../packages/core/lib/pantry-api'
import { runPlanDispatch } from '../../../../../packages/core/lib/plan-api'

vi.mock('../../../../../packages/core/lib/pocketbase', () => ({ pb: { authStore: { token: '' } } }))
vi.mock('../../../../../packages/core/lib/ai-api', () => ({ AI_API_URL: 'https://test.invalid' }))

const i18n = createInstance()
beforeAll(async () => {
  await i18n.init({ resources: { en: { translation: en }, es: { translation: es }, it: { translation: italian } }, lng: 'en', fallbackLng: 'en' })
})
afterEach(() => vi.unstubAllGlobals())

it('sends identical real JSON and FormData payloads after IT/EN/ES rendering', async () => {
  const sent: { url: string; body: unknown }[] = []
  vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
    const body = init.body instanceof FormData
      ? Array.from(init.body.entries()).map(([key, value]) => [key, typeof value === 'string' ? value : { name: value.name, type: value.type, size: value.size }])
      : JSON.parse(String(init.body))
    sent.push({ url, body })
    return { ok: true, json: async () => ({ job_id: 'job', meals: [], notes: 'Original note' }) }
  })
  const goals = Object.freeze({ calories: 2000, protein: 120, carbs: 250, fat: 60 })
  const items = [{ name: 'arroz original', name_normalized: 'arroz', category: 'carbohidrato' as const, quantity: 1.5, unit: 'kg' as const, expiry_estimate: null, confidence: 'high' as const }]
  const original = JSON.stringify({ goals, items })
  const captures = []
  for (const language of ['en', 'es', 'it']) {
    await i18n.changeLanguage(language)
    nutritionMealLabel('desayuno', 'desayuno', language, 'android', i18n.t)
    nutritionUnitLabel('unidad', language, 'android')
    const start = sent.length
    await submitAnalyzeMealJob([new File(['photo'], 'meal.jpg', { type: 'image/jpeg' })], 'desayuno', 'Original descripción', { goal: 'fat_loss', logHour: 8, remainingMacros: goals, recentScores: [{ mealType: 'cena', score: 'A', loggedAt: '2026-10-13 20:00:00' }] })
    await submitMealPlanJob({ remaining_calories: 1000, remaining_protein: 60, remaining_carbs: 100, remaining_fat: 30, logged_meal_types: ['desayuno'] })
    await submitWeeklyMealPlanJob({ daily_calories: 2000, daily_protein: 120, daily_carbs: 250, daily_fat: 60, goal: 'fat_loss', week_start: '2026-10-12' })
    await generatePantryDayPlan({ targetDate: '2026-10-14', items, goals })
    await parsePantry('Original user note', ['arroz original'])
    await matchConsumption([{ name: 'arroz original', quantity: 1.5, unit: 'unidad' }], [{ id: 'original-id', name_normalized: 'arroz', quantity: 2, unit: 'kg' }])
    await runPlanDispatch({ endpoint: 'free-day', mode: 'sync', base: 'buy', horizon: 'today', targetDate: '2026-10-14', body: { remaining_calories: 1000, remaining_protein: 60, remaining_carbs: 100, remaining_fat: 30, logged_meal_types: ['desayuno'], pantry_items: items } })
    captures.push(sent.slice(start))
  }
  expect(captures[1]).toEqual(captures[0])
  expect(captures[2]).toEqual(captures[0])
  expect(captures[2][0].body).toContainEqual(['meal_type', 'desayuno'])
  expect(captures[2][0].body).toContainEqual(['description', 'Original descripción'])
  expect(JSON.stringify(captures)).not.toMatch(/"language"|"locale"/)
  expect(JSON.stringify({ goals, items })).toBe(original)
})
