import { expect, it, vi } from 'vitest'
vi.mock('i18next', async importOriginal => {
  const actual = await importOriginal<typeof import('i18next')>()
  return { ...actual, default: actual.default.createInstance() }
})
vi.mock('./pocketbase', () => ({ pb: { authStore: { record: null }, filter: vi.fn(), collection: vi.fn() }, isPocketBaseAvailable: vi.fn() }))
import i18n from 'i18next'
import { contentLanguage, contentT } from './content-language'
import { getLanguagePolicy } from '../platform'
import { defaultPhases, dayDefaults } from '../hooks/useProgramEditor'

it('preserves the original web translator before i18next initialization', () => {
  expect(getLanguagePolicy()).toBeUndefined()
  expect(i18n.isInitialized).toBeFalsy()
  expect(contentT()).toBe(i18n.t)
  expect(() => contentT()('day.saturday')).not.toThrow()
  expect(() => defaultPhases()).not.toThrow()
  expect(() => dayDefaults()).not.toThrow()
})
it.each(['es', 'en', 'it', 'en-US', 'es-MX'])('preserves raw web language %s without Android policy', language => {
  expect(contentLanguage(language)).toBe(language)
})
