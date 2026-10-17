import { expect, it } from 'vitest'
import { localContentLabel } from '../secondary-content-labels'
import original from '../../../../../packages/core/data/changelog.mobile.json'
import features from '../../../../../packages/core/data/features.json'
import overlay from '../secondary-content-italian.json'

it('renders local Italian release notes and preserves EN/ES and source records', () => {
  const text = Object.freeze({ ...original.versions[0].summary })
  const before = JSON.stringify(text)
  expect(localContentLabel(text, '1.14.1/summary', 'it-IT', 'android')).toContain('allenamento')
  expect(localContentLabel(text, '1.14.1/summary', 'en', 'android')).toBe(text.en)
  expect(localContentLabel(text, '1.14.1/summary', 'es', 'android')).toBe(text.es)
  expect(localContentLabel(text, '1.14.1/summary', 'it', 'ios')).toBe(text.es)
  expect(JSON.stringify(text)).toBe(before)
})
it('falls back for future versions, changed source notes and unknown keys', () => {
  const text = { en: 'New upstream content', es: 'Contenido nuevo' }
  expect(localContentLabel(text, '1.14.1/summary', 'it', 'android')).toBe(text.es)
  expect(localContentLabel(text, '99.0/summary', 'it', 'android')).toBe(text.es)
})
it('covers every shipped summary and highlight using exact source guards', () => {
  for (const version of original.versions) {
    const entries = [[`${version.version}/summary`, version.summary], ...version.highlights.flatMap((h, i) => [
      [`${version.version}/${i}/title`, h.title], [`${version.version}/${i}/body`, h.body],
    ])] as [string, { en: string; es: string }][]
    for (const [key, text] of entries) {
      expect(overlay[key as keyof typeof overlay].source).toBe(text.en)
      expect(localContentLabel(text, key, 'it', 'android')).toBe(overlay[key as keyof typeof overlay].italian)
    }
  }
})

it('covers the reachable discovery directory without translating routes or IDs', () => {
  for (const feature of features) {
    const before = JSON.stringify(feature)
    for (const field of ['title', 'body'] as const) {
      const key = `feature/${feature.id}/${field}` as keyof typeof overlay
      expect(overlay[key].source).toBe(feature[field].en)
      expect(localContentLabel(feature[field], key, 'it', 'android')).toBe(overlay[key].italian)
    }
    expect(JSON.stringify(feature)).toBe(before)
  }
})
