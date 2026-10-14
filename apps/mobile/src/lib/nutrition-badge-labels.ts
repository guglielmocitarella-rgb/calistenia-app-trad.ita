import type { BadgeType } from '@calistenia/core/types'
import { isItalianNutrition } from './nutrition-ui-labels'

// Stable local badge identities; no change to BADGE_DEFINITIONS or stored badges.
const BADGES: Record<BadgeType, { label: string; description: string }> = {
  first_a: { label: 'Prima A', description: 'Il tuo primo pasto con punteggio A' },
  streak_3: { label: 'Serie di 3', description: '3 giorni consecutivi con punteggio A o B' },
  streak_7: { label: 'Serie di 7', description: '7 giorni consecutivi con punteggio A o B' },
  streak_30: { label: 'Serie di 30', description: '30 giorni consecutivi con punteggio A o B' },
  weekly_improvement: { label: 'Miglioramento settimanale', description: 'Il tuo punteggio settimanale è migliorato rispetto al precedente' },
  no_e_week: { label: 'Settimana pulita', description: 'Una settimana intera senza pasti con punteggio E' },
  balanced_day: { label: 'Giornata perfetta', description: 'Una giornata con tutti i pasti di tipo A o B' },
  comeback: { label: 'Ritorno', description: 'Sei passato da una settimana D/E a una settimana A/B/C' },
}

export function nutritionBadgeText(id: string, field: 'label' | 'description', original: string, language: string, os: string): string {
  return isItalianNutrition(language, os) && Object.hasOwn(BADGES, id) ? BADGES[id as BadgeType][field] : original
}
