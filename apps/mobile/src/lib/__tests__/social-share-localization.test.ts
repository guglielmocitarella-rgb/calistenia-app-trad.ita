import { describe, expect, it, vi } from 'vitest'
import { shareReferralInvite, shareBattleResult, inviteUrl } from '../share'

const state = vi.hoisted(() => ({ platform: { OS: 'android' }, i18n: { language: 'it' } }))
vi.mock('react-native', () => ({ Platform: state.platform, Share: { sharedAction: 'shared', dismissedAction: 'dismissed' } }))
vi.mock('../i18n', () => ({ default: state.i18n }))
vi.mock('expo-sharing', () => ({}))
vi.mock('expo-clipboard', () => ({}))
vi.mock('@calistenia/core/lib/analytics', () => ({ CANONICAL_ANALYTICS_EVENTS: {} }))

describe('actual mobile social share builders', () => {
  it('keeps referral codes and English fallback URLs identical to baseline', () => {
    state.platform.OS = 'android'
    state.i18n.language = 'it'
    const result = shareReferralInvite('Nome con {{name}}', 'ABC_01')
    expect(result.message).toBe('Nome con {{name}} ti invita ad allenarti su Calistenia App 🤸\nIscriviti e inizia gratis:')
    expect(result.url).toBe(inviteUrl('ABC_01'))
    state.i18n.language = 'en'
    expect(shareReferralInvite('Nome con {{name}}', 'ABC_01').url).toBe(result.url)
    expect(shareReferralInvite('Nome', 'ABC_01').message).toBe('Nome te invita a entrenar en Calistenia App 🤸\nÚnete y empieza gratis:')
  })
  it('preserves tied scores, rank and share destinations in the real battle builder', () => {
    state.i18n.language = 'it'
    const input = Object.freeze({ circuitName: 'My circuit', rank: 2, contenders: 4, tied: true, referralCode: 'ABC_01' })
    const before = JSON.stringify(input)
    const result = shareBattleResult(input)
    expect(result.message).toBe('pari merito al 2º posto su 4 in "My circuit" 🤝')
    expect(result.url).toBe(inviteUrl('ABC_01'))
    expect(JSON.stringify(input)).toBe(before)
    state.platform.OS = 'ios'
    expect(shareBattleResult(input).message).toBe('empate en el 2.º puesto de 4 en "My circuit" 🤝')
    state.platform.OS = 'android'
  })
})
