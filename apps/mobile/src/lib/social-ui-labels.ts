import { isItalianProgress } from './progress-ui-labels'

/** Only call with local UI literals, never with user text or persisted fields. */
const labels: Record<string, string> = {
  'Buscar usuario...': 'Cerca utente...', reps: 'rip.', '· mutuo': '· reciproco', Handstand: 'Verticale', Amigos: 'Amici', Siguiendo: 'Seguiti', Seguidores: 'Follower',
  'Invita a un amigo': 'Invita un amico', 'COMPARTIR INVITACIÓN': 'CONDIVIDI INVITO',
  'Error al buscar. ¿Reintentar?': 'Errore durante la ricerca. Riprovare?', REINTENTAR: 'RIPROVA',
  'Buscar amigos...': 'Cerca amici...', Perfil: 'Profilo',
  'No se pudo cargar el perfil.': 'Impossibile caricare il profilo.',
  Sesiones: 'Sessioni', Racha: 'Continuità', Mejor: 'Migliore', Nivel: 'Livello', sem: 'sett.',
  'Programa actual': 'Programma attuale', Fase: 'Fase', 'Records personales': 'Record personali',
  'Actividad este mes': 'Attività di questo mese', 'Sesiones recientes': 'Sessioni recenti',
  Comentarios: 'Commenti', total: 'totale', 'Respondiendo a': 'In risposta a',
  'Escribe un comentario…': 'Scrivi un commento…', tú: 'tu', Responder: 'Rispondi', Eliminar: 'Elimina',
  'Sé el primero en comentar': 'Scrivi il primo commento', 'Siguiendo...': 'Inizio a seguire...',
  YOU: 'TU', GO: 'VIA', 'Cargando…': 'Caricamento…', 'Miembro desde': 'Iscritto dal',
}

export function socialLabel(original: string, language: string, os: string): string {
  return isItalianProgress(language, os) && Object.hasOwn(labels, original) ? labels[original] : original
}

export function socialRelativeTime(original: string, iso: string, language: string, os: string, now = Date.now()): string {
  if (!isItalianProgress(language, os)) return original
  const minutes = Math.floor((now - new Date(iso.replace(' ', 'T')).getTime()) / 60_000)
  if (!Number.isFinite(minutes) || minutes < 0) return original
  if (minutes < 1) return 'ora'
  if (minutes < 60) return `${minutes} min fa`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h fa`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'ieri' : `${days} g fa`
}

export function socialReferralMessage(original: string, name: string, language: string, os: string): string {
  return isItalianProgress(language, os)
    ? `${name} ti invita ad allenarti su Calistenia App 🤸\nIscriviti e inizia gratis:` : original
}

const presetLabels: Record<string, string> = {
  "challenge.preset.starter7.title": "Inizia in 7 giorni",
  "challenge.preset.starter7.description": "Completa 3 allenamenti in 7 giorni. Una piccola prima vittoria per prendere slancio.",
  "challenge.preset.consistency30.title": "30 giorni di costanza",
  "challenge.preset.consistency30.description": "Completa 12 allenamenti in 30 giorni. Allenati con regolarità per prendere il ritmo.",
  "challenge.preset.first10.title": "I primi 10 allenamenti",
  "challenge.preset.first10.description": "Completa 10 allenamenti al tuo ritmo nel prossimo anno.",
  "challenge.preset.pushup.title": "Costruisci i tuoi piegamenti",
  "challenge.preset.pushup.description": "Accumula piegamenti nei tuoi allenamenti.",
  "challenge.preset.firstPullup.title": "La tua prima trazione",
  "challenge.preset.firstPullup.description": "Esegui la tua prima trazione rigorosa. Senza fretta: procedi al tuo ritmo."
}

/** Stable catalog keys only. Never used by preset creation or serialization. */
export function socialPresetLabel(original: string, key: string, language: string, os: string): string {
  return isItalianProgress(language, os) && Object.hasOwn(presetLabels, key) ? presetLabels[key] : original
}

export function socialBattleMessage(original: string, input: {
  circuitName: string; userName?: string; rank: number; contenders: number; tied: boolean
}, language: string, os: string): string {
  if (!isItalianProgress(language, os)) return original
  const who = input.userName ? `${input.userName}: ` : ''
  if (input.contenders <= 1) return `${who}circuito "${input.circuitName}" completato 💪`
  return input.tied
    ? `${who}pari merito al ${input.rank}º posto su ${input.contenders} in "${input.circuitName}" 🤝`
    : `${who}${input.rank}º su ${input.contenders} in "${input.circuitName}" 🏆`
}
