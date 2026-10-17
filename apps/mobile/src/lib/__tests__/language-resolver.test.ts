import { describe, expect, it } from 'vitest'
import { resolveInitialLanguage } from '../language-resolver'

// #821: idioma por defecto inglés para cualquier dispositivo que no esté en
// español. Antes de este fix, `deviceLang === 'en' ? 'en' : 'es'` mandaba a
// español cualquier idioma que no fuera literalmente 'en' — incluido
// portugués, alemán, hindi o indonesio.
describe('resolveInitialLanguage (#821)', () => {
  it.each(['pt', 'de', 'hi', 'id', 'fr', 'zh'])(
    'sin guardado, dispositivo "%s" (no español) → inglés',
    (deviceLang) => {
      expect(resolveInitialLanguage(deviceLang, null)).toBe('en')
    },
  )

  it('sin guardado, dispositivo desconocido/ausente → inglés', () => {
    expect(resolveInitialLanguage(undefined, null)).toBe('en')
    expect(resolveInitialLanguage(null, undefined)).toBe('en')
  })

  it.each(['es', 'ES'])('sin guardado, dispositivo español ("%s") → español', (deviceLang) => {
    expect(resolveInitialLanguage(deviceLang, null)).toBe('es')
  })

  it('el idioma guardado gana siempre sobre el del dispositivo', () => {
    expect(resolveInitialLanguage('en', 'es')).toBe('es')
    expect(resolveInitialLanguage('pt', 'es')).toBe('es')
    expect(resolveInitialLanguage('es', 'en')).toBe('en')
    expect(resolveInitialLanguage('de', 'en')).toBe('en')
  })
})

describe('Italian UI preference', () => {
  it.each(['it', 'it-IT', 'IT'])('recognizes Italian device %s', tag => {
    expect(resolveInitialLanguage(tag)).toBe('it')
  })
  it('persists manual Italian and preserves ES/EN precedence', () => {
    expect(resolveInitialLanguage('es', 'it')).toBe('it')
    expect(resolveInitialLanguage('it', 'es')).toBe('es')
    expect(resolveInitialLanguage('it', 'en')).toBe('en')
    expect(['it', 'en', 'es', 'it'].map(saved => resolveInitialLanguage('it', saved))).toEqual(['it', 'en', 'es', 'it'])
  })
})
