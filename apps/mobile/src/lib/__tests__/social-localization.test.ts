import { describe, expect, it } from 'vitest'
import { socialLabel, socialRelativeTime, socialReferralMessage, socialPresetLabel, socialBattleMessage } from '../social-ui-labels'
import { createInstance } from 'i18next'
import en from '../../../../../packages/core/locales/en/translation.json'
import es from '../../../../../packages/core/locales/es/translation.json'
import italian from '../../../../../packages/core/locales/it/translation.json'

describe('Android social display boundaries', () => {
  it('translates known local UI labels and preserves unknown content', () => {
    expect(socialLabel('Amigos', 'it-IT', 'android')).toBe('Amici')
    expect(socialLabel('An arbitrary user comment', 'it', 'android')).toBe('An arbitrary user comment')
    for (const [language, os] of [['en', 'android'], ['es', 'android'], ['it', 'ios']]) {
      expect(socialLabel('Amigos', language, os)).toBe('Amigos')
    }
  })
  it('renders relative time without changing timestamps and falls back safely', () => {
    const now = Date.parse('2026-10-17T12:00:00Z')
    expect(socialRelativeTime('hace 1m', '2026-10-17T11:59:00Z', 'it', 'android', now)).toBe('1 min fa')
    expect(socialRelativeTime('hace 2h', '2026-10-17T10:00:00Z', 'it', 'android', now)).toBe('2 h fa')
    expect(socialRelativeTime('ayer', '2026-10-16T12:00:00Z', 'it', 'android', now)).toBe('ieri')
    expect(socialRelativeTime('unknown', 'invalid', 'it', 'android', now)).toBe('unknown')
    expect(socialRelativeTime('original', '2026-10-17T10:00:00Z', 'en', 'android', now)).toBe('original')
  })
  it('preserves dynamic names and referral URL bytes', () => {
    const record = Object.freeze({ name: 'Eliminar {{name}}', code: 'ABC_01', url: 'https://example.org/en/invite/ABC_01?x=2' })
    const before = JSON.stringify(record)
    expect(socialReferralMessage('original', record.name, 'it', 'android')).toBe('Eliminar {{name}} ti invita ad allenarti su Calistenia App 🤸\nIscriviti e inizia gratis:')
    expect(socialReferralMessage('original', record.name, 'es', 'android')).toBe('original')
    expect(JSON.stringify(record)).toBe(before)
  })
})


it('uses stable preset keys only and leaves source payloads and unknown presets intact', () => {
  const payload = Object.freeze({ preset_key: 'starter_7_day', title: italian['challenge.preset.starter7.title'], metric: 'most_sessions', goal: 3, starts_at: '2026-10-17' })
  const before = JSON.stringify(payload)
  expect(socialPresetLabel(payload.title, 'challenge.preset.starter7.title', 'it', 'android')).toBe('Inizia in 7 giorni')
  expect(socialPresetLabel('My own title', 'unknown', 'it', 'android')).toBe('My own title')
  expect(socialPresetLabel(payload.title, 'challenge.preset.starter7.title', 'it', 'ios')).toBe(payload.title)
  expect(payload.title).toBe(en['challenge.preset.starter7.title'])
  expect(JSON.stringify(payload)).toBe(before)
})

it('renders Italian singulars and plurals with real i18next interpolation', async () => {
  const i18n = createInstance()
  await i18n.init({ lng: 'it', resources: { it: { translation: italian }, en: { translation: en }, es: { translation: es } } })
  expect(i18n.t('friends.suggestedSessions', { n: 1, count: 1 })).toBe('1 allenamento')
  expect(i18n.t('friends.suggestedSessions', { n: 2, count: 2 })).toBe('2 allenamenti')
  expect(i18n.t('challenge.daysLeft', { count: 1 })).toBe('Manca 1 giorno')
  expect(i18n.t('challenge.daysLeft', { count: 2 })).toBe('Mancano 2 giorni')
})

it('localizes battle share wording while preserving rank, ties and circuit names', () => {
  const input = Object.freeze({ circuitName: 'Original {{rank}}', userName: 'Nome', rank: 2, contenders: 5, tied: true })
  expect(socialBattleMessage('original', input, 'it', 'android')).toBe('Nome: pari merito al 2º posto su 5 in "Original {{rank}}" 🤝')
  expect(socialBattleMessage('original', input, 'en', 'android')).toBe('original')
  expect(input.rank).toBe(2)
})
