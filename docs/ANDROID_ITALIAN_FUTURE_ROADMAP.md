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

## Stato aggiornato alla ricostruzione 4E — 17 ottobre 2026

- Fasi 2 e 3 completate; 4A, 4B, 4C e 4D approvate nel rispettivo perimetro.
- Fase 4E implementata e verificata automaticamente; APK standalone compilato e avviato su emulatore. In attesa di revisione indipendente e collaudo reale sul telefono.
- 4F e 4G ancora da svolgere; fase 5 audit finale; fase 6 collaudo integrale.
- Fase 7 IA personale configurabile: progetto separato, non avviato nell'implementazione 4E.
- Residui 4D: traguardi, persistenza misurazioni, comparatore fotografico, widget e altri controlli non eseguiti; singolare/plurale statistiche da esaminare nell'audit.

### Evidenze MCP riferite dall'utente — sola documentazione per la fase 7

Autenticazione OAuth MCP riuscita con Claude/Calistenia; `cal_whoami` eseguito e strumenti MCP accessibili. Registrazione di un pasto tramite IA esterna secondo il risultato riportato dal client. Cancellazione autorizzata di cinque allenamenti liberi tramite MCP e successiva conferma sull'APK dell'azzeramento delle sessioni eliminate.

Queste prove indicano la fattibilità di alcune interazioni con IA esterne. Non dimostrano la sostituzione dell'IA integrata nei pulsanti dell'APK. Nessun provider, endpoint, BYOK o server personale implementato dalla 4E.

## Stato 4F — 17 ottobre 2026

4F implementata con correzione residua 4E nello stesso APK finale; verifiche CI/build e collaudo descritti nel report 4F. Collaudo 4E registrato fedelmente: 67 controlli, 22 superati, 1 difetto grafico, 28 non eseguiti, 16 da verificare. Nessuna regressione confermata 4A–4D. I controlli social aperti passano alla fase 6, senza considerarli superati.

Roadmap conservata: 4G catalogo italiano esercizi; 5 audit finale; 6 collaudo integrale Android; 7 IA personale configurabile; 8 manutenzione e aggiornamenti upstream. Evidenze MCP/OAuth precedenti conservate come documentazione; nessun provider personale implementato. Health Connect esiste già; nessuna nuova integrazione introdotta dalla 4F.
