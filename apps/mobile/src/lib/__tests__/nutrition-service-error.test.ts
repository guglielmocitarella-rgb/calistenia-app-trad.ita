import { describe, expect, it } from 'vitest'
import { nutritionServiceError } from '../nutrition-service-error'

describe('nutrition service error display adapter', () => {
  it('localizes service HTTP errors for Italian Android and keeps the diagnostic code', () => {
    expect(nutritionServiceError('Analyze meal failed: 502', 'it-IT', 'android', 'Errore'))
      .toBe("Il servizio di intelligenza artificiale ha restituito l'errore 502. Riprova più tardi.")
  })

  it('replaces raw provider credit details with a clear Italian message', () => {
    expect(nutritionServiceError('You have no credits remaining', 'it', 'android', 'Errore'))
      .toBe('Il servizio di intelligenza artificiale non è disponibile perché i crediti sono esauriti.')
  })

  it('uses a localized fallback for unknown technical messages in Italian', () => {
    expect(nutritionServiceError('upstream timeout: internal stack details', 'it', 'android', 'Errore'))
      .toBe('Errore')
  })

  it('preserves existing English and Spanish error text', () => {
    const raw = 'Analyze meal failed: 502'
    expect(nutritionServiceError(raw, 'en', 'android', 'Error')).toBe(raw)
    expect(nutritionServiceError(raw, 'es', 'android', 'Error')).toBe(raw)
    expect(nutritionServiceError(raw, 'it', 'ios', 'Error')).toBe(raw)
  })
})
