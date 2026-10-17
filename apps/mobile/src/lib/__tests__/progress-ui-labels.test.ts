import { describe, expect, it } from 'vitest'
import { progressNumber, progressDate, progressLocale, progressRelativeTime, progressPRMessage } from '../progress-ui-labels'

describe('Android progress display boundaries', () => {
  it('formats decimal display strings while preserving precision, units and source records', () => {
    const record = Object.freeze({ date: '2026-10-16', weight: 72.55, chest: 91.2, note: 'Original 1.5', kind: 'weight' })
    const before = JSON.stringify(record)
    expect(progressNumber(String(record.weight), 'it', 'android')).toBe('72,55')
    expect(progressNumber('0.00', 'it-IT', 'android')).toBe('0,00')
    expect(progressNumber('-1.5', 'it', 'android')).toBe('-1,5')
    expect(progressNumber('1.5 kg', 'it', 'android')).toBe('1.5 kg')
    expect(progressNumber(record.note, 'it', 'android')).toBe(record.note)
    expect(progressNumber('2026-10-16', 'it', 'android')).toBe(record.date)
    expect(JSON.stringify(record)).toBe(before)
  })

  it('formats calendar dates as dates without shifting a day or changing invalid values', () => {
    expect(progressDate('2026-01-02', 'it', 'android')).toBe('02/01/2026')
    expect(progressDate('2026-01-02', 'it', 'android', true)).toBe('02/01')
    expect(progressDate('2024-02-29', 'it', 'android')).toBe('29/02/2024')
    for (const invalid of ['2026-02-29', '2026-13-01', 'original', '']) {
      expect(progressDate(invalid, 'it', 'android')).toBe(invalid)
    }
  })

  it('preserves original presentation for EN, ES, iOS and unknown languages', () => {
    for (const [lang, os] of [['en', 'android'], ['es', 'android'], ['it', 'ios'], ['xx', 'android']]) {
      expect(progressNumber('72.50', lang, os)).toBe('72.50')
      expect(progressDate('2026-01-02', lang, os)).toBe('2026-01-02')
      expect(progressLocale('es', lang, os)).toBe('es')
      expect(progressRelativeTime('original', '2026-10-15T12:00:00Z', lang, os, 0)).toBe('original')
    }
    expect(progressLocale('es', 'it-IT', 'android')).toBe('it-IT')
  })

  it('renders relative analysis times with the existing hour/day granularity', () => {
    const now = Date.parse('2026-10-16T12:00:00Z')
    expect(progressRelativeTime('ahora', '2026-10-16T11:30:00Z', 'it', 'android', now)).toBe('ora')
    expect(progressRelativeTime('hace 2h', '2026-10-16T10:00:00Z', 'it', 'android', now)).toBe('2 h fa')
    expect(progressRelativeTime('ayer', '2026-10-15T12:00:00Z', 'it', 'android', now)).toBe('ieri')
    expect(progressRelativeTime('hace 3d', '2026-10-13T12:00:00Z', 'it', 'android', now)).toBe('3 g fa')
    expect(progressRelativeTime('original', undefined, 'it', 'android', now)).toBe('original')
    expect(progressRelativeTime('original', 'invalid', 'it', 'android', now)).toBe('original')
  })
})

it('keeps PR names, numeric records and referral URLs intact in native share text', () => {
  const input = Object.freeze({ exerciseName: 'Original reps 🏆', userName: 'Original', oldValue: 1.5, newValue: 2.5 })
  const original = 'Original: Original reps 🏆: 1.5 → 2.5 reps 🏆\nhttps://example.org/en/?code=original'
  expect(progressPRMessage(original, input, 'it', 'android')).toBe('Original: Original reps 🏆: 1,5 → 2,5 rip. 🏆\nhttps://example.org/en/?code=original')
  expect(progressPRMessage(original, input, 'en', 'android')).toBe(original)
  expect(progressPRMessage('unknown', input, 'it', 'android')).toBe('unknown')
  expect(input.oldValue).toBe(1.5)
})
