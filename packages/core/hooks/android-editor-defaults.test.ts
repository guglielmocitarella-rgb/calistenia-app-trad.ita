import { expect, it, vi } from 'vitest'
import i18n from 'i18next'
import { initCore } from '../platform'
import { resolveAndroidContentLanguage, resolveAndroidServerLanguage } from '../lib/android-language'
vi.mock('../lib/pocketbase', () => ({ pb: { filter: vi.fn(), collection: vi.fn(() => ({})), authStore: { record: null } }, isPocketBaseAvailable: vi.fn().mockResolvedValue(true) }))
import { defaultPhases, dayDefaults } from './useProgramEditor'

it.each(['es', 'en'])('generates persistent defaults in %s while UI is Italian', async historical => {
  initCore({ storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, env: { pbUrl: '', aiApiUrl: '', isDev: true }, analytics: { track: () => {}, identify: () => {}, clear: () => {} }, connectivity: { isOnline: () => true, onOnline: () => () => {} }, languages: { content: ui => resolveAndroidContentLanguage(ui, historical), server: resolveAndroidServerLanguage } })
  const dictionaries = Object.fromEntries(['es', 'en', 'it'].map(lng => [lng, { translation: { 'programEditor.defaultPhase1': `${lng} CONTENT`, 'day.lun': `${lng} DAY`, 'programEditor.dayFocusPush': `${lng} FOCUS` } }]))
  await i18n.init({ lng: 'it', resources: dictionaries, keySeparator: false })
  expect(i18n.t('programEditor.defaultPhase1')).toBe('it CONTENT')
  expect(defaultPhases()[0].name).toBe(`${historical} CONTENT`)
  expect(dayDefaults()[0].dayName).toBe(`${historical} DAY`)
  expect(dayDefaults()[0].focus).toBe(`${historical} FOCUS`)
  expect(defaultPhases(historical)[0].name).not.toBe('it CONTENT')
})
