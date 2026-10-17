import { afterEach, describe, expect, it, vi } from 'vitest'
import i18n from 'i18next'
vi.mock('./pocketbase', () => ({ pb: { authStore: { token: '' } } }))
vi.mock('./ai-api', () => ({ AI_API_URL: 'http://127.0.0.1:1' }))
import { submitAnalyzeMealJob, submitMealPlanJob, submitWeeklyMealPlanJob, regeneratePlanDay } from './ai-jobs-api'
import { runPlanDispatch } from './plan-api'
import { searchOFF } from './openfoodfacts'

const requests: Array<{ url: string; init?: RequestInit }> = []
afterEach(() => { vi.unstubAllGlobals(); requests.length = 0 })
function intercept() {
  vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
    requests.push({ url, init })
    return new Response(JSON.stringify({ job_id: 'test', products: [], meals: [], notes: '', model_used: 'test' }), { status: 200 })
  })
}
describe('unchanged API payloads without language parameters (no network)', () => {
  it.each(['es', 'en', 'it'])('serializes identical nutrition bodies with UI %s', async ui => {
    intercept()
    await i18n.init({ lng: ui, resources: {} })
    const daily = { remaining_calories: 1200, remaining_protein: 80, remaining_carbs: 100, remaining_fat: 40, logged_meal_types: ['breakfast'] }
    const weekly = { daily_calories: 2200, daily_protein: 130, daily_carbs: 200, daily_fat: 60, goal: 'maintain', week_start: '2026-10-12' }
    await submitMealPlanJob(daily)
    await submitWeeklyMealPlanJob(weekly)
    await regeneratePlanDay('day-id')
    const planBody = { ...daily, pantry_items: [] }
    await runPlanDispatch({ mode: 'sync', endpoint: 'free-day', base: 'buy', horizon: 'today', targetDate: '2026-10-13', body: planBody })
    expect(requests.map(r => JSON.parse(r.init!.body as string))).toEqual([daily, weekly, { plan_day_id: 'day-id' }, planBody])
    expect(requests.map(r => r.url.replace('http://127.0.0.1:1', ''))).toEqual(['/api/jobs/generate-meal-plan', '/api/jobs/generate-weekly-meal-plan', '/api/weekly-plan/regenerate-day', '/api/generate-meal-plan'])
  })
  it.each(['es', 'en', 'it'])('keeps food analysis form and OFF default in UI %s', async ui => {
    intercept()
    await i18n.init({ lng: ui, resources: {} })
    await submitAnalyzeMealJob([], 'lunch', 'User text', { goal: 'maintain', logHour: 13 })
    expect(Array.from((requests[0].init!.body as FormData).entries())).toEqual([['meal_type', 'lunch'], ['description', 'User text'], ['goal', 'maintain'], ['log_hour', '13']])
    await searchOFF('rice')
    expect(requests[1].url).toBe('https://world.openfoodfacts.org/cgi/search.pl?search_terms=rice&json=1&page_size=10&lc=es')
  })
})
