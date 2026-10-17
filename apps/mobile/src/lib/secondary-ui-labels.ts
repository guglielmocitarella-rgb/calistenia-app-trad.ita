import { isItalianProgress } from './progress-ui-labels'

/** Local presentation only. Never use on payloads or stored records. */
const labels: Record<string, string> = {
  "Reloj y salud": "Orologio e salute",
  "Conecta tu reloj a través de Health Connect para traer tu sueño, peso y grasa corporal.": "Collega il tuo orologio tramite Health Connect per importare i dati relativi al sonno, al peso e alla massa grassa.",
  "Disponible en Android": "Disponibile su Android",
  "La integración con Apple Salud (iPhone) llegará pronto.": "L'integrazione con Apple Health (iPhone) sarà disponibile a breve.",
  "Instala Health Connect": "Installa Health Connect",
  "Health Connect es la app de Google donde tu reloj guarda los datos de salud. Instálala para continuar.": "Health Connect è l'app di Google in cui il tuo orologio salva i dati relativi alla salute. Installala per continuare.",
  "Abrir Google Play": "Apri Google Play",
  "Actualiza Health Connect": "Aggiorna Health Connect",
  "Qué leeremos": "Cosa leggeremo",
  "Sueño · Peso y grasa corporal. Solo lectura: la app nunca modifica tus datos del reloj.": "Sonno · Peso e grasso corporeo. Solo lettura: l'app non modifica mai i dati presenti sull'orologio.",
  "Conectando…": "In fase di connessione…",
  "Conectar con Health Connect": "Connettiti a Health Connect",
  "Tus datos de salud nunca se envían a analítica ni publicidad.": "I tuoi dati sanitari non vengono mai trasmessi a società di analisi dei dati né a inserzionisti.",
  "Sincronizando…": "Sincronizzazione in corso…",
  "Sincronizar ahora": "Sincronizza ora",
  "Última sync:": "Ultima sincronizzazione:",
  "Gestionar permisos en Health Connect": "Gestire le autorizzazioni in Health Connect",
  "Sueño": "Sonno",
  "Peso": "Peso",
  "Grasa corporal": "Grasso corporeo",
  "sin sesión": "Sessione non attiva",
  "sync falló": "Sincronizzazione non riuscita",
  "Compartir sesión": "Condividi sessione",
  "SESIÓN COMPLETADA": "SESSIONE CONCLUSA",
  "SERIES": "SERIE",
  "MINUTOS": "MINUTI",
  "EJERCICIOS": "ESERCIZI",
  "EJERCICIOS · TIEMPO": "ESERCIZI · TEMPO",
  "más": "altro",
  "Tiempo": "Tempo",
  "CARRERA": "CORSA",
  "CAMINATA": "CAMMINATA",
  "CICLISMO": "CICLISMO",
  "COMPARTIR": "CONDIVIDI",
  "GENERANDO…": "GENERAZIONE…",
  "Notificaciones": "Notifiche",
  "Rest timer": "Timer di recupero",
  "Correcciones": "Correzioni",
  "Mejoras internas": "Miglioramenti interni",
  "Nuevas funciones": "Nuove funzionalità",
  "Rendimiento": "Prestazioni"
}

export function secondaryLabel(original: string, language: string, os: string): string {
  return isItalianProgress(language, os) && Object.hasOwn(labels, original) ? labels[original] : original
}
