import { describe, expect, it } from 'vitest'
import { resolveAndroidContentLanguage, resolveAndroidServerLanguage } from './android-language'
import { resolveAndroidWgerLanguage } from './android-language'

describe('Android language boundaries', () => {
  it.each(['es', 'en'] as const)('preserves server %s for Italian UI', language => {
    expect(resolveAndroidServerLanguage('it', language)).toBe(language)
    expect(resolveAndroidContentLanguage('it', language)).toBe(language)
  })
  it('uses the historical English default on fresh Italian installations', () => {
    expect(resolveAndroidServerLanguage('it')).toBe('en')
    expect(resolveAndroidContentLanguage('it')).toBe('en')
  })
  it.each(['es', 'en'] as const)('keeps explicit %s behavior', language => {
    expect(resolveAndroidServerLanguage(language, language === 'es' ? 'en' : 'es')).toBe(language)
    expect(resolveAndroidContentLanguage(language, language === 'es' ? 'en' : 'es')).toBe(language)
  })
})

it('keeps the Wger Spanish default separate from new Italian content English default', () => {
  expect(resolveAndroidWgerLanguage('it')).toBe('es')
  expect(resolveAndroidWgerLanguage('en')).toBe('en')
  expect(resolveAndroidWgerLanguage('es')).toBe('es')
})
