# Android italiano — fase 4F e correzione residua 4E

17 ottobre 2026. Baseline `8a71be8feb4a0a8e50a76ea157ee12dd826b31b2`. Ramo unico `feature/italian-localization`, PR #1 aperta e in bozza. Implementazione di sola presentazione Android italiana. Revisione indipendente del codice e dei testi eseguita; collaudo fisico ancora da eseguire.

## Stato iniziale e conservazione

HEAD remoto e PR verificati direttamente, coincidenti con la baseline indicata. Nuova copia pulita sullo stesso ramo; nessun altro processo di sviluppo sul ramo rilevato negli ambienti accessibili. Le copie locali più vecchie, comprese modifiche 4A e commit 4B non pubblicati, sono state lasciate intatte; un vecchio worktree 4C aveva il riferimento Git non più disponibile. Nessuna ricerca o ricostruzione del lavoro 4E già pubblicato. Consultati inventari e report 4A–4E, confini linguistici e roadmap.

## A. Correzione residua 4E

Commit distinto: `a9407a8fbf2b6d7075a9fde9073b91d3dffa9333` (tree identico al commit locale verificato).

- Schermata `apps/mobile/src/app/u/[id].tsx`, componente locale `StatBox` e dizionario `social-ui-labels.ts`.
- Etichette definitive: **SESSIONI**, **SERIE**, **RECORD**, **LIVELLO**. SESSIONI rimane sempre per esteso.
- Semantica verificata: `usePublicProfile` legge `workout_streak_current` e `workout_streak_best`; `pb_hooks/utils/weekly_streak.js` conferma il conteggio in settimane. Nessuna modifica a tali sorgenti o contatori.
- Solo Android IT: padding orizzontale da 16 a 4 dp e spaziatura normale tra lettere nei quattro riquadri; font resta 10, colori/icone/valori invariati. Quattro riquadri restano affiancati normalmente. Sotto 320 dp o con scala testo oltre 1,15, disposizione locale su due righe per rispettare l’accessibilità; EN/ES/iOS mantengono il layout precedente.
- Test delle quattro etichette: fallimento atteso prima della modifica, successivamente superato. Misura con font reale `JetBrainsMono_400Regular.ttf` e Pillow: SESSIONI 48 dp alla scala 1,0 e 55,2 dp alla scala 1,15. Spazio disponibile nei riquadri a 320/360/412 dp: 56/66/79 dp. Nessun ellissi, limite righe o ridimensionamento globale introdotto.
- La misura del font e l’ispezione del fallback non equivalgono a un test di layout del motore Android né al collaudo sul telefono. Verifica fisica dei riquadri richiesta nella checklist.

Collaudo 4E precedente conservato: **67 controlli: 22 superati, 1 problema grafico, 28 non eseguiti, 16 da verificare**. Nessuna regressione confermata 4A–4D. I controlli social non eseguiti/da verificare restano aperti per la fase 6; la correzione non certifica l’intera fase 4E.

## B. Implementazione 4F

### Copertura

- **154 chiavi revisionate, 153 valori italiani modificati**, nessuna chiave aggiunta/rimossa. **5.315 chiavi per ciascuna lingua**. Le 2.807 chiavi inventariate nelle fasi precedenti restano identiche; EN/ES invariati byte per byte.
- **41 forme locali** nel nuovo adattatore Android `secondary-ui-labels.ts`; **18 testi** nei dizionari IT di tre widget. Queste quantità contano forme di dizionario, non siti di chiamata.
- **359 testi locali** in overlay con chiave stabile e guardia sul sorgente: 317 riepiloghi/titoli/descrizioni delle **35 versioni** del changelog e 42 titoli/descrizioni delle **21 voci Scopri**. Nessuna modifica ai JSON condivisi originali. Se un aggiornamento upstream cambia il testo inglese, la guardia evita di mostrare una traduzione obsoleta e usa il fallback originale.

| Superficie raggiungibile | Intervento |
| --- | --- |
| Profilo → Orologio e salute (`/health`) | Titolo, spiegazioni, lettura dati, stati non disponibile/aggiornamento/collegamento, permessi, sincronizzazione, errori locali, ultima sincronizzazione e metriche visuali |
| Profilo → Sonno | Registrazione/storico, qualità/stress, conferme, riepilogo IA: sola cornice locale, decimali visuali e tempo relativo; contenuto IA invariato |
| Promemoria / primo promemoria | Tipi, selettori, orari, autorizzazioni, errori di salvataggio/connessione, conferme e stati |
| Notifiche e impostazioni | Casella vuota, contatore, azioni, avvisi locali; preferenze social già italiane conservate |
| Canali Android esistenti | Solo nomi visuali Notifiche e Timer di recupero, senza cambiare ID, importanza, suono, vibrazione o richieste permessi |
| Widget Oggi / Prossima sessione / Cardio | Dizionario IT, stati vuoti/scaduti, contatori, distanza con virgola; altri cinque widget e risorse launcher italiane già presenti conservati |
| Novità e cronologia versioni | Cornice già tradotta conservata, testi locali in overlay, intestazioni tecniche; messaggi raw dei commit invariati |
| Scopri | 21 voci locali, titoli e descrizioni italiane; ID, categorie, rotte e navigazione invariati |
| UpdateGate | Avvisi facoltativi/obbligatori, inclusi motivi di sicurezza/incompatibilità selezionati tramite chiavi locali |
| Condivisione allenamento/cardio | Didascalie, pulsanti e titolo del selettore nativo, date e decimali soltanto nella resa grafica; messaggi nativi/URL/formati file invariati |
| Banner offline, sondaggio e sessione in corso | Testi locali residui nei cataloghi, senza modificare flussi o dati |

Health Connect era **già implementato**; non è una nuova integrazione. Nessuna schermata nativa autonoma FAQ/supporto trovata; i collegamenti esistenti verso contenuti esterni restano invariati. Dettagli tecnici remoti sconosciuti conservati come fallback, mai riscritti arbitrariamente. Le notifiche ricevute dal server e i promemoria push effettivi mantengono il contenuto originale: tradurre le anteprime locali non cambia la lingua del server.

### Confini tecnici

Nessuna modifica a backend, API/contratti, `apps/web`, server, IA/MCP/provider, algoritmi, progressioni, statistiche, autorizzazioni, Health bridge/sync, snapshot/writer widget, regole social o dati persistiti. Nessun valore `it` introdotto nei payload backend. Snapshot locali già compatibili IT; writer e azioni widget invariati. Form, parser, orari salvati, scheduler, token e FCM invariati. Decimali/date adattati solo in rendering. Nessun nuovo ramo/PR, release/tag, migrazione, merge o modifica a main. Fase 4G non avviata.

### Verifiche locali

- **3.705 test passati**: core 2.790, mobile 227, web 688. Nove test aggiunti rispetto alla baseline (uno 4E, otto 4F). Test di fallback EN/ES/iOS, testo sconosciuto, overlay aggiornati/obsoleti, immutabilità dei dati, azioni widget e interpolazioni/plurali reali i18next.
- Typecheck completo e lint mobile passati; **0 errori, 23 warning preesistenti**. Il warning web jsdom relativo a `HTMLCanvasElement.getContext` non produce fallimenti.
- Scanner AST eseguito fuori dai documenti storici: 0 parse diagnostics, 0 chiavi statiche mancanti, parità EN/ES/IT e placeholder verificati. Gli inventari storici non sono sovrascritti. Le 521 occorrenze sintattiche sono un indice conservativo che include fallback, unità, brand e testi già adattati; non sono 521 difetti accertati. Import JSON non risolti dallo scanner conservati come limite statico, verificati da TypeScript.
- Guardia JSX rafforzata rimuovendo esclusivamente le due eccezioni obsolete Health (12) e WorkoutShareCard (6). Nessun test o criterio disabilitato.
- Durante le verifiche, riuso delle dipendenze bloccate con lockfile identico: corretti esclusivamente i collegamenti locali del workspace e gli shim, senza cambiare dipendenze. Il primo tentativo web aveva segnalato React duplicato dovuto al collegamento al vecchio core; suite completa rieseguita con successo dopo la correzione. Il primo core segnalava le eccezioni JSX obsolete; corrette restringendo il baseline e suite rieseguita.
- Revisione indipendente: corretti motivi UpdateGate, decimale velocità cardio, layout condizionale e termini ambigui delle note storiche (circuiti, cronologia cardio, peso aggiuntivo, continuità settimanale, ricette del coach e metriche calendario). Nessun cambiamento funzionale rilevato.

### Verifica aggiuntiva widget

Misura del font Bebas Neue 30 al minimo widget di 250 dp (222 dp interni): il testo iniziale del widget Oggi scaduto misurava 250,89 dp. Sostituito con «APRI L’APP» (93,63 dp), già usato negli altri widget, senza cambiare azioni o dimensioni. «SCEGLI UN PROGRAMMA» misura 211,65 dp e resta invariato. Test sullo stato scaduto: fallimento atteso e successivo verde. Il primo workflow APK sul commit `4dc8382b` viene annullato automaticamente per concorrenza dal nuovo trigger prima della produzione dell’artifact; non è un APK consegnato. Un solo APK finale comprende tutte le modifiche.

### CI e unico APK finale

Verifiche GitHub e build finale non ancora concluse al momento di questo commit. I risultati effettivi, riferiti al commit applicativo esatto e all’HEAD finale, saranno registrati nella sezione conclusiva dopo la fine dei workflow. Non viene attribuito il verde di commit precedenti a questa consegna.

Checklist telefonica in `ANDROID_ITALIAN_PHASE4F_CHECKLIST.md`; residui in `ANDROID_ITALIAN_PHASE4F_RESIDUAL.json`. Il collaudo telefonico rimane distinto dalle prove automatiche e dallo smoke dell’emulatore.
