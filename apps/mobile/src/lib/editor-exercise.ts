import { localize } from '@calistenia/core/lib/i18n-db'
import type { CatalogExercise } from '@calistenia/core/lib/exerciseCatalog'
import type { EditorExercise } from '@calistenia/core/hooks/useProgramEditor'

/** Datos editables: nunca usar el traductor visual del picker para esta copia. */
export function catalogToEditorExercise(ex: CatalogExercise, locale: string): EditorExercise {
  return {
    exerciseId: ex.slug,
    name: localize(ex.name, locale),
    sets: ex.sets,
    reps: ex.reps,
    rest: ex.rest,
    muscles: localize(ex.muscles, locale),
    note: localize(ex.note, locale),
    youtube: ex.youtube,
    priority: ex.priority,
    isTimer: !!ex.isTimer,
    timerSeconds: ex.timerSeconds ?? 0,
  }
}
