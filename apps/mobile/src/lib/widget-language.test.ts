import { expect, it } from 'vitest'
import { widgetLanguage, widgetStrings } from './widget-language'
import { buildWidgetSnapshot } from './widget-snapshot'
import { rolloverSnapshot, type NutritionWidgetSnapshot } from './nutrition-widget-snapshot'
it('supports IT and keeps existing ES/EN and missing snapshots', () => {
  const strings = { es: { title: 'ES' }, en: { title: 'EN' } }
  expect(widgetLanguage('it-IT')).toBe('it')
  expect(widgetStrings(strings, 'it').title).toBe('EN')
  expect(widgetStrings(strings, 'es').title).toBe('ES')
  expect(widgetStrings(strings, 'en').title).toBe('EN')
  expect(widgetStrings(strings, undefined).title).toBe('ES')
  expect(widgetStrings(strings, 'invalid').title).toBe('ES')
})

it.each(['es', 'en', 'it'] as const)('roundtrips training and nutrition snapshots in %s without changing technical values', lang => {
  const built = buildWidgetSnapshot({ today: '2026-10-13', tz: 'Europe/Rome', lang, programName: 'Original name', programPhase: 2, todayId: 'mar', todayType: 'strength', tomorrowType: 'rest', weekDays: [{ id: 'mar', type: 'strength' }], workout: { title: 'Original title', exerciseCount: 4 }, workoutTomorrow: null, isDone: () => true, streak: 3, lastSessionDate: '2026-10-13', weeklyDone: 2, weeklyGoal: 3 })
  expect(JSON.parse(JSON.stringify(built))).toEqual(built)
  expect(built.lang).toBe(lang)
  expect(built.workoutToday).toEqual({ title: 'Original title', type: 'strength', done: true, exerciseCount: 4, programPhase: 2 })
  const nutrition: NutritionWidgetSnapshot = { date: '2026-10-13', tz: 'Europe/Rome', lang, calories: 500, protein: 30, carbs: 50, fat: 20, calorieGoal: 2000, proteinGoal: 130, carbsGoal: 200, fatGoal: 60, mealStreak: 3, mealStreakToday: true, waterMl: 500, waterGoalMl: 2500 }
  expect(rolloverSnapshot(JSON.parse(JSON.stringify(nutrition)), '2026-10-13')).toEqual(nutrition)
  expect(rolloverSnapshot(nutrition, '2026-10-14')?.lang).toBe(lang)
})

it('does not extend the iOS snapshot contract', () => {
  expect(widgetLanguage('it', 'ios')).toBe('es')
  expect(widgetLanguage('en', 'ios')).toBe('en')
  expect(widgetLanguage('es', 'ios')).toBe('es')
})
