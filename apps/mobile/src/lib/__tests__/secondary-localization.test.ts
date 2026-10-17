import { expect, it } from 'vitest'
import { secondaryLabel } from '../secondary-ui-labels'
import { createInstance } from 'i18next'
import italian from '../../../../../packages/core/locales/it/translation.json'
import english from '../../../../../packages/core/locales/en/translation.json'

it('localizes only known local Android literals and preserves remote errors', () => {
  expect(secondaryLabel('Reloj y salud', 'it-IT', 'android')).toBe('Orologio e salute')
  expect(secondaryLabel('Sueño', 'it', 'android')).toBe('Sonno')
  expect(secondaryLabel('sync falló', 'it', 'android')).toBe('Sincronizzazione non riuscita')
  expect(secondaryLabel('Server detail 502 {{user}}', 'it', 'android')).toBe('Server detail 502 {{user}}')
  for (const [language, os] of [['en', 'android'], ['es', 'android'], ['it', 'ios']]) {
    expect(secondaryLabel('Reloj y salud', language, os)).toBe('Reloj y salud')
  }
})

it('resolves forced-update reasons, plural sleep counts and reminder placeholders', async () => {
  const i18n = createInstance()
  await i18n.init({ lng: 'it', fallbackLng: 'en', resources: { it: { translation: italian }, en: { translation: english } } })
  for (const key of ['update.reasonSecurity', 'update.reasonIncompatible'] as const) {
    expect(i18n.t(key)).toContain('Aggiorna')
    expect(i18n.t(key)).not.toBe(english[key])
  }
  expect(i18n.t('sleep.times', { count: 1 })).toBe('1 volta')
  expect(i18n.t('sleep.times', { count: 2 })).toBe('2 volte')
  expect(i18n.t('sleep.awakeningsCount', { count: 1 })).toBe('1 risveglio')
  expect(i18n.t('sleep.awakeningsCount', { count: 2 })).toBe('2 risvegli')
  expect(i18n.t('pushPrompt.descWithSchedule', { days: 'LUN, MER', time: '18:30' })).toContain('(LUN, MER), alle 18:30')
  expect(i18n.t('update.latestVersion', { version: '1.14.1' })).toBe('Versione 1.14.1')
  expect(i18n.t('cardioSession.geoNotAvailable')).toBe('Geolocalizzazione non disponibile')
  expect(i18n.t('share.invite')).toBe('Invita')
  expect(i18n.t('motivation.author0')).toBe('Sconosciuto')
  expect(i18n.t('motivation.author1')).toBe(english['motivation.author1'])
  expect(i18n.t('motivation.quote0')).not.toBe(english['motivation.quote0'])
})
