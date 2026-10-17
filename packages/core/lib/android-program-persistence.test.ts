import { battleExerciseNamesFrom } from './battle-exercise-names'
import { contentLanguage } from './content-language'
import { describe, expect, it } from 'vitest'
import { diffCollection, isNoop } from './programEditorDiff'
import { localize, duplicatedName, toTranslatable, type TranslatableField } from './i18n-db'
import { initCore } from '../platform'
import { resolveAndroidContentLanguage, resolveAndroidServerLanguage } from './android-language'

const fields: TranslatableField[] = [{ es: 'Texto' }, { en: 'Text' }, { es: 'Texto', en: 'Text' }, 'Legacy']
describe('program content persistence', () => {
  for (const locale of ['es', 'en']) {
    it.each(fields)('no-op load/save for %j in ' + locale, field => {
      const original = { id: 'p', name: field }
      const desired = toTranslatable(localize(field, locale), locale)
      const plan = diffCollection([original], [{ key: 'p', data: { name: desired } }], r => r.id, { locale, translatableFields: ['name'], localizedReadFallback: true })
      expect(isNoop(plan)).toBe(true)
      expect(original.name).toEqual(field)
    })
    it('preserves other translations on edit in ' + locale, () => {
      const plan = diffCollection([{ id: 'p', name: { es: 'Texto', en: 'Text' } }], [{ key: 'p', data: { name: toTranslatable('Edited', locale) } }], r => r.id, { locale, translatableFields: ['name'], localizedReadFallback: true })
      expect(plan.toUpdate[0].data.name).toEqual({ es: 'Texto', en: 'Text', [locale]: 'Edited' })
      expect(JSON.stringify(plan)).not.toContain('"it":')
    })
    it.each(fields)('duplicates %j without Italian keys in ' + locale, field => {
      const copy = duplicatedName(field, locale)
      expect(Object.keys(copy)).toEqual(typeof field === 'string' ? [locale] : Object.keys(field))
    })
  }
})

it('rejects accidental Italian serializer calls when the Android policy is installed', () => {
  initCore({ storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, env: { pbUrl: '', aiApiUrl: '', isDev: true }, analytics: { track: () => {}, identify: () => {}, clear: () => {} }, connectivity: { isOnline: () => true, onOnline: () => () => {} }, languages: { content: resolveAndroidContentLanguage, server: resolveAndroidServerLanguage } })
  expect(() => toTranslatable('Titolo italiano', 'it')).toThrow()
  expect(() => duplicatedName('Legacy', 'it')).toThrow()
})

it('freezes unknown battle exercise names in the content language, not UI IT fallback', () => {
  initCore({ storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, env: { pbUrl: '', aiApiUrl: '', isDev: true }, analytics: { track: () => {}, identify: () => {}, clear: () => {} }, connectivity: { isOnline: () => true, onOnline: () => () => {} }, languages: { content: ui => resolveAndroidContentLanguage(ui, 'en'), server: resolveAndroidServerLanguage } })
  const names = battleExerciseNamesFrom([{ exerciseId: 'unknown-slot', displayName: 'Original English name' }], contentLanguage('it'), null)
  expect(names).toEqual({ 'unknown-slot': { en: 'Original English name' } })
})
