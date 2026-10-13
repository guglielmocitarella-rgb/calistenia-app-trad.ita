import { expect, it } from 'vitest'
import { catalogToEditorExercise } from './editor-exercise'
import type { CatalogExercise } from '@calistenia/core/lib/exerciseCatalog'
it.each(['es', 'en'])('adds content in pinned %s even when an Italian display value exists', locale => {
  const ex: CatalogExercise = { id: 'catalog-id', category: 'push', slug: 'push_up', name: { es: 'Flexiones', en: 'Push-ups', it: 'Piegamenti UI' }, muscles: { es: 'Pecho', en: 'Chest', it: 'Petto UI' }, note: { es: 'Nota ES', en: 'EN note', it: 'Nota UI' }, sets: 3, reps: '8-12', rest: 60, youtube: '', priority: 'med', isTimer: false, timerSeconds: 0 }
  expect(catalogToEditorExercise(ex, locale)).toEqual({ exerciseId: 'push_up', name: locale === 'es' ? 'Flexiones' : 'Push-ups', muscles: locale === 'es' ? 'Pecho' : 'Chest', note: locale === 'es' ? 'Nota ES' : 'EN note', sets: 3, reps: '8-12', rest: 60, youtube: '', priority: 'med', isTimer: false, timerSeconds: 0 })
})
