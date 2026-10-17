import { beforeEach, expect, it, vi } from 'vitest'
import { initCore } from '../platform'
import { resolveAndroidContentLanguage, resolveAndroidServerLanguage } from './android-language'
const { writes } = vi.hoisted(() => ({ writes: vi.fn() }))
vi.mock('./pocketbase', () => ({ pb: { collection: () => ({ update: writes }) } }))
import { syncUserLanguage } from './language-sync'

beforeEach(() => {
  writes.mockReset().mockResolvedValue({})
  initCore({ storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }, env: { pbUrl: '', aiApiUrl: '', isDev: true }, analytics: { track: () => {}, identify: () => {}, clear: () => {} }, connectivity: { isOnline: () => true, onOnline: () => () => {} }, languages: { content: resolveAndroidContentLanguage, server: resolveAndroidServerLanguage } })
})
it.each(['es', 'en'])('keeps server %s and sends no update in Italian UI', async stored => {
  expect(await syncUserLanguage('test-user', stored, 'it')).toBe(stored)
  expect(writes).not.toHaveBeenCalled()
})
it('new Italian installations use the historical English server payload', async () => {
  expect(await syncUserLanguage('test-user', null, 'it')).toBe('en')
  expect(writes).toHaveBeenCalledWith('test-user', { language: 'en' })
})
it('explicit English and Spanish choices preserve their existing behavior', async () => {
  await syncUserLanguage('test-user', 'es', 'en')
  await syncUserLanguage('test-user', 'en', 'es')
  expect(writes.mock.calls).toEqual([['test-user', { language: 'en' }], ['test-user', { language: 'es' }]])
})
