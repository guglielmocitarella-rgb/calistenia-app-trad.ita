import { expect, it, vi } from 'vitest'
import { TodayWidget } from '../../widgets/TodayWidget'
import { NextSessionWidget } from '../../widgets/NextSessionWidget'
import { CardioWidget } from '../../widgets/CardioWidget'
vi.mock('react-native-android-widget', () => ({ FlexWidget: 'flex', TextWidget: 'text' }))

function texts(node) {
  if (!node || typeof node !== 'object') return []
  if (Array.isArray(node)) return node.flatMap(texts)
  return [node.props.text, ...texts(node.props.children)].filter(x => x !== undefined)
}
const today = '2026-10-17'
it('renders Italian widget frames, keeping snapshots and opening actions intact', () => {
  const snapshot = Object.freeze({ lang: 'it', date: today, workoutToday: null, workoutTomorrow: null, week: [], weeklyDone: 0, weeklyGoal: 3, streak: 0, weekKm: 12.5, weekSessions: 2, lastSession: null })
  const before = JSON.stringify(snapshot)
  const next = NextSessionWidget({ snapshot, today })
  expect(texts(next)).toContain('DOMANI · ')
  expect(texts(next)).toContain('SCEGLI UN PROGRAMMA')
  expect(next.props.clickAction).toBe('OPEN_APP')
  expect(texts(TodayWidget({ snapshot, today }))).toContain('SCEGLI UN PROGRAMMA')
  const cardio = CardioWidget({ snapshot })
  expect(texts(cardio)).toContain('SESSIONI')
  expect(texts(cardio)).toContain('12,5')
  expect(cardio.props.clickActionData).toEqual({ uri: 'calistenia://cardio' })
  expect(JSON.stringify(snapshot)).toBe(before)
})
it('keeps the previous EN/ES widget labels and handles stale Italian snapshots', () => {
  for (const [lang, expected] of [['en', 'PICK A PROGRAM'], ['es', 'ELIGE UN PROGRAMA']]) {
    expect(texts(NextSessionWidget({ snapshot: { lang, date: today }, today }))).toContain(expected)
  }
  expect(texts(NextSessionWidget({ snapshot: { lang: 'it', date: '2026-10-16' }, today }))).toContain('APRI L’APP')
  expect(texts(TodayWidget({ snapshot: { lang: 'it', date: '2026-10-16' }, today }))).toContain('APRI L’APP')
})
