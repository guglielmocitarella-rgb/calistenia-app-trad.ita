import { afterEach, expect, it, vi } from 'vitest'
import { initCore } from '../platform'
import { resolveAndroidContentLanguage, resolveAndroidServerLanguage } from './android-language'
import { searchWger } from './wger'
import { mapWgerToExerciseCatalog } from './wger-mappings'
const policy = () => initCore({ storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, env: { pbUrl: '', aiApiUrl: '', isDev: true }, analytics: { track: () => {}, identify: () => {}, clear: () => {} }, connectivity: { isOnline: () => true, onOnline: () => () => {} }, languages: { content: resolveAndroidContentLanguage, server: resolveAndroidServerLanguage } })
afterEach(() => vi.unstubAllGlobals())
it.each([['it', 'es'], ['es', 'es'], ['en', 'en']])('keeps Wger search and import metadata consistent for %s', async (requested, expected) => {
  policy()
  const urls: string[] = []
  vi.stubGlobal('fetch', async (url: string) => {
    urls.push(url)
    return new Response(JSON.stringify({ suggestions: [] }), { status: 200 })
  })
  await searchWger('press', requested)
  expect(new URL(urls[0]).searchParams.get('language')).toBe(expected)
  const mapped = mapWgerToExerciseCatalog({ id: 10, name: 'Press', description: 'Description', muscles: [], muscles_secondary: [], equipment: [], category: { id: 11, name: 'Chest' }, images: [], videos: [], translations: [{ id: 1, language: 4, name: 'ES Press', description: 'ES description' }, { id: 2, language: 2, name: 'EN Press', description: 'EN description' }] }, requested)
  expect(mapped.wger_language).toBe(expected)
  expect(mapped.name).toEqual(expected === 'en' ? { es: 'EN Press' } : { es: 'ES Press', en: 'EN Press' })
  expect(mapped.wger_id).toBe(10)
  expect(mapped.default_sets).toBe(3)
  expect(JSON.stringify(mapped)).not.toContain('"it":')
})
