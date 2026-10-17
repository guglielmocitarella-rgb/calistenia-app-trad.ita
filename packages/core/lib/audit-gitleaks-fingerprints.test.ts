import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import en from '../locales/en/translation.json'

it('preserves the 27 exact historical audit findings, all existing translation identifiers', () => {
  const entries = readFileSync(new URL('../../../.gitleaksignore', import.meta.url), 'utf8').split('\n').filter(line => line && !line.startsWith('#'))
    .filter(entry => !/^ca3e8ea1ae74d654541df420fbcd4ac2bd569597:docs\/ANDROID_ITALIAN_PHASE4D_STRINGS\.json:generic-api-key:(301|363|425|487|549)$/.test(entry))
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

it('permits exactly five phase 4D findings, each the documented public achievement translation key', () => {
  const entries = readFileSync(new URL('../../../.gitleaksignore', import.meta.url), 'utf8').split('\n').filter(line => line && !line.startsWith('#'))
  const expected: Record<number, string> = {
    301: 'achievements.streak_12w.desc',
    363: 'achievements.streak_26w.desc',
    425: 'achievements.streak_4w.desc',
    487: 'achievements.streak_52w.desc',
    549: 'achievements.streak_8w.desc',
  }
  const prefix = 'ca3e8ea1ae74d654541df420fbcd4ac2bd569597:docs/ANDROID_ITALIAN_PHASE4D_STRINGS.json:generic-api-key:'
  const actual = entries.filter(entry => entry.startsWith(prefix))
  expect(actual.sort()).toEqual(Object.keys(expected).map(line => prefix + line).sort())
  const lines = readFileSync(new URL('../../../docs/ANDROID_ITALIAN_PHASE4D_STRINGS.json', import.meta.url), 'utf8').split('\n')
  for (const [line, key] of Object.entries(expected)) {
    const value = JSON.parse(`{${lines[Number(line) - 1].trim().replace(/,$/, '')}}`)
    expect(value).toEqual({ key })
    expect(Object.hasOwn(en, key)).toBe(true)
  }
})
