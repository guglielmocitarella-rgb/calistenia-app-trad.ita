import { beforeAll, describe, expect, it } from 'vitest'
import { createInstance } from 'i18next'
import en from '../../../../../packages/core/locales/en/translation.json'
import es from '../../../../../packages/core/locales/es/translation.json'
import italian from '../../../../../packages/core/locales/it/translation.json'
import { trainingUiLabel, trainingCategoryLabel, trainingSuggestionMessage, trainingRepsLabel } from '../training-ui-labels'
import { catalogToEditorExercise } from '../editor-exercise'
import type { CatalogExercise } from '@calistenia/core/lib/exerciseCatalog'

const i18n = createInstance()
beforeAll(async () => {
  await i18n.init({ resources: { en: { translation: en }, es: { translation: es }, it: { translation: italian } }, lng: 'it', fallbackLng: 'en' })
})

describe('Android training display boundaries', () => {
  it('translates repetition qualifiers only during rendering and keeps units and ranges', () => {
    const exercise = Object.freeze({ id: 'original', reps: '8-12 c/pierna', sets: 3, rest: 60 })
    expect(trainingRepsLabel(exercise.reps, exercise.reps, 'it', 'android')).toBe('8-12 per gamba')
    expect(trainingRepsLabel('30 s (15 s por brazo)', '', 'it', 'android')).toBe('30 s (15 s per braccio)')
    expect(trainingRepsLabel('10 per side', '', 'it', 'android')).toBe('10 per lato')
    expect(trainingRepsLabel('custom target', 'custom target', 'it', 'android')).toBe('custom target')
    expect(trainingRepsLabel(exercise.reps, 'original EN display', 'en', 'android')).toBe('original EN display')
    expect(trainingRepsLabel(exercise.reps, exercise.reps, 'it', 'ios')).toBe(exercise.reps)
    expect(exercise).toEqual({ id: 'original', reps: '8-12 c/pierna', sets: 3, rest: 60 })
  })
  it('renders labels without modifying canonical ids or saved data', () => {
    const record = Object.freeze({ id: 'barra_dominadas', label: 'Barra', category: 'push', name: { en: 'Push-up', es: 'Flexión' }, reps: '10 por lado' })
    const before = JSON.stringify(record)
    expect(trainingUiLabel(record.label, 'equipment.barra_dominadas', 'it', 'android', i18n.t)).toBe('Barra per trazioni')
    expect(trainingCategoryLabel(record.category, 'it-IT', 'android', i18n.t)).toBe('Spinta')
    expect(JSON.stringify(record)).toBe(before)
  })

  it('keeps original labels on ES, EN, iOS and unknown categories', () => {
    for (const lang of ['en', 'es']) expect(trainingUiLabel('Generar sesión', undefined, lang, 'android', i18n.t)).toBe('Generar sesión')
    expect(trainingUiLabel('Generar sesión', undefined, 'it', 'ios', i18n.t)).toBe('Generar sesión')
    expect(trainingCategoryLabel('custom_category', 'it', 'android', i18n.t)).toBe('custom category')
    expect(trainingUiLabel('Original remote name', undefined, 'it', 'android', i18n.t)).toBe('Original remote name')
  })

  it('copies original EN/ES content to the real program editor after rendering Italian labels', () => {
    const record = Object.freeze({ id: 'original-record-id', slug: 'stable-id', name: { en: 'Push-up', es: 'Flexión' }, muscles: { en: 'Chest', es: 'Pecho' }, note: { en: 'Original instructions', es: 'Instrucciones originales' }, category: 'push', sets: 3, reps: '8-12 por lado', rest: 60, priority: 'med', youtube: '', isTimer: false }) as CatalogExercise
    const before = JSON.stringify(record)
    trainingCategoryLabel(record.category, 'it', 'android', i18n.t)
    trainingRepsLabel(record.reps, record.reps, 'it', 'android')
    const english = catalogToEditorExercise(record, 'en')
    const spanish = catalogToEditorExercise(record, 'es')
    expect(english).toMatchObject({ exerciseId: 'stable-id', name: 'Push-up', muscles: 'Chest', note: 'Original instructions', reps: '8-12 por lado', sets: 3, rest: 60 })
    expect(spanish).toMatchObject({ exerciseId: 'stable-id', name: 'Flexión', muscles: 'Pecho', note: 'Instrucciones originales', reps: '8-12 por lado', sets: 3, rest: 60 })
    expect(JSON.stringify(record)).toBe(before)
  })

  it('keeps the pre-translation English suggestion sent to AI with Italian UI', () => {
    for (const key of ['freeSession.aiSuggestMoreCore', 'freeSession.aiSuggestEasier', 'freeSession.aiSuggestShorter', 'freeSession.aiSuggestWarmup']) {
      expect(trainingSuggestionMessage(key, 'it', 'android', i18n)).toBe(en[key as keyof typeof en])
      expect(trainingSuggestionMessage(key, 'es', 'android', i18n)).toBe(es[key as keyof typeof es])
    }
  })
})
