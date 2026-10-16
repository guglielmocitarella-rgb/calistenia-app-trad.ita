# Android italiano — attività future

Documento aggiunto nella fase 4D il 16 ottobre 2026. Nessuna attività qui descritta è implementata o avviata. I piani storici restano invariati; il documento non autorizza le fasi successive della localizzazione.

## Fase 7 — Servizio IA personale configurabile

Obiettivo futuro: studiare l'uso di servizi IA scelti dall'utente senza dipendere necessariamente dai crediti del server originale, sul quale non disponiamo di accesso amministrativo.

La fase dovrà valutare:

- Supporto OpenAI, Google Gemini e Anthropic, con API personale.
- Servizio intermedio personale e chiavi protette lato server; nessuna API key incorporata nell'APK.
- Compatibilità con i job attuali: generazione allenamenti e piani alimentari, analisi fotografica e testuale degli alimenti, dispensa e ricette.
- Autenticazione, autorizzazioni, protezione delle credenziali e separazione tra utenti.
- Gestione degli errori, dei limiti e dei costi.
- Scelta del provider ed eventuale endpoint nell'interfaccia Android.
- Accesso originale come eventuale fallback, soltanto se autorizzato e tecnicamente compatibile.

Le configurazioni server del progetto per Anthropic, Google e OpenAI non equivalgono a una selezione del provider disponibile all'utente Android. La futura analisi dovrà verificare nuovamente questa architettura prima di proporre modifiche.

Durante la 4D non sono introdotti provider, endpoint, configurazioni visibili, chiavi o servizi IA personali; richieste e generazione originali rimangono invariate.
