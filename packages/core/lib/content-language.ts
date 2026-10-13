import i18n from 'i18next'
import { getLanguagePolicy } from '../platform'

/** Sin adaptador, conserva exactamente la semántica de los consumidores existentes. */
export function contentLanguage(ui = i18n.language): string {
  return getLanguagePolicy()?.content(ui) ?? ui
}
export function contentT() {
  return i18n.getFixedT(contentLanguage())
}
