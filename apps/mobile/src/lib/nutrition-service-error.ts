import { isItalianNutrition } from './nutrition-ui-labels'

/** Converts known AI service errors to user-facing Italian without mutating source errors. */
export function nutritionServiceError(
  message: string | null | undefined,
  language: string,
  os: string,
  fallback: string,
): string {
  if (!message) return fallback
  if (!isItalianNutrition(language, os)) return message

  if (/\bno credits? (?:remaining|left|available)\b|\binsufficient credits\b|\bcredits? (?:are )?(?:exhausted|depleted)\b/i.test(message)) {
    return 'Il servizio di intelligenza artificiale non è disponibile perché i crediti sono esauriti.'
  }

  const statusCode = message.match(/\b(?:HTTP\s*)?([45]\d{2})\b/i)?.[1]
  if (statusCode) {
    return `Il servizio di intelligenza artificiale ha restituito l'errore ${statusCode}. Riprova più tardi.`
  }

  return fallback
}
