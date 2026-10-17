import { beforeAll, describe, expect, it } from 'vitest'
import { createInstance } from 'i18next'
import en from '../../../../../packages/core/locales/en/translation.json'
import es from '../../../../../packages/core/locales/es/translation.json'
import italian from '../../../../../packages/core/locales/it/translation.json'
import { authErrorLabel, profileSkillLabel } from '../italian-ui-labels'

const i18n = createInstance()
beforeAll(async () => {
  await i18n.init({ resources: { en: { translation: en }, es: { translation: es }, it: { translation: italian } }, lng: 'it', fallbackLng: 'en' })
})

describe('Android Italian display adapters', () => {
  it('renders skill labels from stable PR keys without changing the input records', () => {
    const skill = Object.freeze({ key: 'pr_handstand', label: 'Handstand', value: 30, unit: 's' })
    expect(profileSkillLabel(skill.key, skill.label, 'it', 'android', i18n.t)).toBe('Verticale')
    expect(profileSkillLabel('pr_pullups', 'Pull-ups', 'it-IT', 'android', i18n.t)).toBe('Trazioni')
    expect(skill).toEqual({ key: 'pr_handstand', label: 'Handstand', value: 30, unit: 's' })
  })

  it('preserves labels outside Android Italian and for unknown skill identities', () => {
    expect(profileSkillLabel('pr_handstand', 'Handstand', 'en', 'android', i18n.t)).toBe('Handstand')
    expect(profileSkillLabel('pr_handstand', 'Handstand', 'it', 'ios', i18n.t)).toBe('Handstand')
    expect(profileSkillLabel('custom', 'Original title', 'it', 'android', i18n.t)).toBe('Original title')
  })

  it('localizes recognized auth messages only in Android Italian', () => {
    expect(authErrorLabel('Failed to authenticate.', 'it', 'android', i18n.t)).toBe(italian['auth.loginError'])
    expect(authErrorLabel('Failed to create record.', 'it', 'android', i18n.t)).toBe(italian['auth.signupError'])
    expect(authErrorLabel('Failed to authenticate.', 'en', 'android', i18n.t)).toBe('Failed to authenticate.')
    expect(authErrorLabel('Failed to authenticate.', 'it', 'ios', i18n.t)).toBe('Failed to authenticate.')
    expect(authErrorLabel('Unknown server detail', 'it', 'android', i18n.t)).toBe('Unknown server detail')
    expect(authErrorLabel(null, 'it', 'android', i18n.t)).toBeNull()
  })

  it('renders real singular/plural and interpolation values with the Italian catalog', () => {
    expect(i18n.t('home.a11y.notificationsUnread', { count: 1 })).toBe('Notifiche, 1 non letta')
    expect(i18n.t('home.a11y.notificationsUnread', { count: 2 })).toBe('Notifiche, 2 non lette')
    expect(i18n.t('home.streak.weeks', { count: 1 })).toBe('1 settimana consecutiva')
    expect(i18n.t('home.streak.weeks', { count: 2 })).toBe('2 settimane consecutive')
    expect(i18n.t('home.training.programPhase', { program: 'Original name', phase: 1, phases: 3 })).toBe('Original name · fase 1 di 3')
    expect(i18n.getFixedT('en')('day.saturday')).toBe(en['day.saturday'])
    expect(i18n.getFixedT('es')('day.saturday')).toBe(es['day.saturday'])
  })
})
