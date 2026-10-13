import { describe, expect, it } from 'vitest'
import { createLanguageContext } from './language-context'

describe('local content preference', () => {
  it('preserves Spanish through IT and restart; isolates accounts', () => {
    const values = new Map<string, string>()
    const storage = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => { values.set(k, v) }, removeItem: (k: string) => { values.delete(k) } }
    let user: { id: string; language?: string } | null = { id: 'a', language: 'es' }
    let ctx = createLanguageContext(storage, () => user)
    expect(ctx.content('it')).toBe('es')
    expect(ctx.server('it', 'es')).toBe('es')
    ctx = createLanguageContext(storage, () => user)
    expect(ctx.content('it')).toBe('es')
    user = { id: 'b', language: 'en' }
    expect(ctx.content('it')).toBe('en')
    user = null
    expect(ctx.content('it')).toBe('en')
    user = { id: 'a', language: 'es' }
    expect(ctx.content('it')).toBe('es')
  })
  it('tracks IT → EN → ES → IT without changing server Spanish', () => {
    const values = new Map<string, string>()
    const ctx = createLanguageContext({ getItem: k => values.get(k) ?? null, setItem: (k, v) => { values.set(k, v) }, removeItem: k => { values.delete(k) } }, () => null)
    expect(['it', 'en', 'es', 'it'].map(ctx.content)).toEqual(['en', 'en', 'es', 'es'])
    expect(ctx.server('it', 'es')).toBe('es')
  })
})
