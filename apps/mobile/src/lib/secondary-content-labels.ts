import { pickLang, type LocalizedText } from '@calistenia/core/lib/whats-new'
import { isItalianProgress } from './progress-ui-labels'
import italian from './secondary-content-italian.json'

/** Android local resources only. Source guards prevent stale overlays after upstream updates. */
export function localContentLabel(text: LocalizedText, key: string, language: string, os: string): string {
  const entry = Object.hasOwn(italian, key) ? italian[key as keyof typeof italian] : undefined
  return isItalianProgress(language, os) && entry?.source === text.en
    ? entry.italian : pickLang(text, language)
}
