import { beforeAll, describe, expect, it } from 'vitest'
import { createInstance } from 'i18next'
import en from '../../../../../packages/core/locales/en/translation.json'
import es from '../../../../../packages/core/locales/es/translation.json'
import italian from '../../../../../packages/core/locales/it/translation.json'
import { ACHIEVEMENT_CATALOG, buildAchievementList } from '../../../../../packages/core/lib/achievements'
import { computeTrainingStats } from '../../../../../packages/core/lib/training-stats'
import type { ProgressMap } from '../../../../../packages/core/types'
import { progressNumber } from '../progress-ui-labels'

const i18n = createInstance()
beforeAll(async () => {
  await i18n.init({ resources: { en: { translation: en }, es: { translation: es }, it: { translation: italian } }, lng: 'it', fallbackLng: 'en' })
})

describe('Italian progress catalogue and original data', () => {
  it('resolves every local achievement by stable identity with no change to unlock rules', () => {
    const definitions = JSON.stringify(ACHIEVEMENT_CATALOG)
    const items = buildAchievementList({ totalWorkouts: 3, bestWeeklyStreak: 4 })
    const original = JSON.stringify(items)
    for (const item of items) {
      for (const field of ['name', 'desc']) {
        const key = `achievements.${item.key}.${field}`
        expect(i18n.exists(key)).toBe(true)
        expect(i18n.t(key)).not.toBe(key)
      }
    }
    expect(items.find(x => x.key === 'streak_4w')?.unlocked).toBe(true)
    expect(items.find(x => x.key === 'streak_8w')?.unlocked).toBe(false)
    expect(JSON.stringify(items)).toBe(original)
    expect(JSON.stringify(ACHIEVEMENT_CATALOG)).toBe(definitions)
  })

  it('renders Italian counters, weekday order and dynamic chart placeholders', () => {
    expect(i18n.t('progressTab.weeks', { count: 1 })).toBe('1 settimana')
    expect(i18n.t('progressTab.weeks', { count: 2 })).toBe('2 settimane')
    expect(i18n.t('progressTab.weeksShort', { count: 52 })).toBe('52 sett.')
    expect(i18n.t('calendar.photoLabel', { count: 1 })).toBe('1 foto')
    expect(i18n.t('calendar.photoLabel', { count: 2 })).toBe('2 foto')
    expect(i18n.t('stats.weekdayInitials').split(',')).toEqual(['L', 'M', 'M', 'G', 'V', 'S', 'D'])
    expect(i18n.t('stats.bestWeight', { weight: progressNumber('12.5', 'it', 'android'), reps: 8, e1rm: progressNumber('15.83', 'it', 'android') })).toBe('Serie migliore: 12,5 kg × 8 · 1RM stimato 15,83 kg')
    expect(i18n.getFixedT('en')('stats.title')).toBe('Statistics')
    expect(i18n.getFixedT('es')('stats.title')).toBe('Estadísticas')
  })

  it('leaves statistical series, numeric records and persistent logs identical after rendering', () => {
    const progress: ProgressMap = {
      'done_2026-10-16_free_original': { date: '2026-10-16', workoutKey: 'free_original', done: true, note: 'Original' },
      '2026-10-16_free_original_ex_original': { date: '2026-10-16', workoutKey: 'free_original', exerciseId: 'ex_original', sets: [{ reps: '8', weight: 12.5, note: 'Original', timestamp: 0 }] },
    }
    const original = JSON.stringify(progress)
    const input = { progress, period: 'all' as const, today: '2026-10-16', resolve: () => ({ key: 'ex_original', name: 'Original', muscleGroups: ['pecho'], resolved: true, isTimer: false }) }
    const stats = computeTrainingStats(input)
    const before = JSON.stringify(stats)
    expect(stats.totals.volumeKg).toBe(100)
    expect(stats.totals.reps).toBe(8)
    for (const record of stats.records) {
      const b = record.best
      if (b.kind === 'weight') i18n.t('stats.bestWeight', { weight: progressNumber(String(b.weight), 'it', 'android'), reps: b.reps, e1rm: progressNumber(String(b.e1rm), 'it', 'android') })
    }
    expect(JSON.stringify(stats)).toBe(before)
    expect(JSON.stringify(computeTrainingStats(input))).toBe(before)
    expect(JSON.stringify(progress)).toBe(original)
  })
})
