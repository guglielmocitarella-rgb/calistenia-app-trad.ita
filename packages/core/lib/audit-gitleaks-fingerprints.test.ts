import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import en from '../locales/en/translation.json'

it('allows only the 27 exact historical audit findings, all existing translation identifiers', () => {
  const entries = readFileSync(new URL('../../../.gitleaksignore', import.meta.url), 'utf8').split('\n').filter(line => line && !line.startsWith('#'))
  const lines = readFileSync(new URL('../../../docs/ANDROID_ITALIAN_LOCALIZATION_INVENTORY.json', import.meta.url), 'utf8').split('\n')
  expect(entries).toHaveLength(27)
  expect(new Set(entries).size).toBe(27)
  for (const entry of entries) {
    const match = entry.match(/^6a0961da7cb2564417ee1d2dd186d810eb13bbda:docs\/ANDROID_ITALIAN_LOCALIZATION_INVENTORY\.json:generic-api-key:(\d+)$/)
    expect(match).not.toBeNull()
    const line = lines[Number(match![1]) - 1].trim().replace(/,$/, '')
    const value = JSON.parse(`{${line}}`)
    expect(Object.keys(value)).toEqual(['key'])
    expect(Object.hasOwn(en, value.key)).toBe(true)
  }
})
