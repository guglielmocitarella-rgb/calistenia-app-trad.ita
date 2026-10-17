import i18n from 'i18next'
import { getLanguagePolicy } from '../platform'

/** Sin adaptador, conserva exactamente la semántica de los consumidores existentes. */
export function contentLanguage(ui = i18n.language): string {
  return getLanguagePolicy()?.content(ui) ?? ui
}
export function contentT(locale = contentLanguage()) {
  // Web conserva t(), también antes de init; solo Android necesita fixedT.
  return getLanguagePolicy() ? i18n.getFixedT(locale) : i18n.t
}
