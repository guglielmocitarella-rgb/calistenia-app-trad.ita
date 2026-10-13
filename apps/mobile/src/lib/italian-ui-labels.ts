import type { TFunction } from 'i18next'

// Rendering only: do not use these labels when creating sessions or PR records.
const SKILL_LABEL_KEYS: Record<string, string> = {
  pr_pullups: 'onboarding.focus.pull_up',
  pr_pushups: 'leaderboard.prPushups',
  pr_lsit: 'dashboard.goal.lsit',
  pr_pistol: 'dashboard.goal.pistol',
  pr_handstand: 'onboarding.focus.handstand',
}

export function profileSkillLabel(key: string, fallback: string, language: string, os: string, t: TFunction): string {
  const labelKey = Object.hasOwn(SKILL_LABEL_KEYS, key) ? SKILL_LABEL_KEYS[key] : undefined
  return os === 'android' && language.split('-')[0] === 'it' && labelKey ? t(labelKey) : fallback
}

// Recognized PocketBase messages only. Unknown remote text is kept verbatim.
const AUTH_ERROR_KEYS: Record<string, string> = {
  'Failed to authenticate.': 'auth.loginError',
  'Failed to create record.': 'auth.signupError',
}

export function authErrorLabel(message: string | null, language: string, os: string, t: TFunction): string | null {
  if (os === 'android' && language.split('-')[0] === 'it' && message && Object.hasOwn(AUTH_ERROR_KEYS, message)) {
    return t(AUTH_ERROR_KEYS[message])
  }
  return message
}
