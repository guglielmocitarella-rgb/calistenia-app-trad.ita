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

- **186 chiavi revisionate, 185 valori italiani modificati**, nessuna chiave aggiunta/rimossa. **5.315 chiavi per ciascuna lingua**. Le 2.807 chiavi inventariate nelle fasi precedenti restano identiche; EN/ES invariati byte per byte.
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
| Geolocalizzazione / Invita / citazioni locali | Errore nativo di disponibilità, pulsante invito e 20 citazioni predefinite con attribuzioni generiche; nomi propri invariati, nessun cambiamento ai contenuti dei servizi |
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

Misura del font Bebas Neue 30 al minimo widget di 250 dp (222 dp interni): il testo iniziale del widget Oggi scaduto misurava 250,89 dp. Sostituito con «APRI L’APP» (93,63 dp), già usato negli altri widget, senza cambiare azioni o dimensioni. «SCEGLI UN PROGRAMMA» misura 211,65 dp e resta invariato. Test sullo stato scaduto: fallimento atteso e successivo verde. Il primo workflow APK sul commit `4dc8382b` è stato annullato automaticamente per concorrenza dal nuovo trigger prima della produzione dell’artifact; non è un APK consegnato. Un solo APK finale comprende tutte le modifiche.

### Audit conclusivo dei residui statici

Verificati tutti i testi ancora uguali a EN con riferimenti Android diretti/indiretti. Completati due residui di interfaccia e 30 testi/attribuzioni delle citazioni locali, effettivamente mostrate in CelebrateScreen e nella fine circuito. Le citazioni non sono inviate ai salvataggi; quelle nelle immagini condivise restano sola presentazione. Autori con nomi propri conservati. `widgets.completed` è generato dal presenter condiviso ma la proprietà `verb` è visualizzata soltanto nel widget web, non nei componenti Android: resta invariato. `phase.*`/`dayFocus.*` appartengono al vecchio modello dati di programma, senza uso Android accertato delle chiavi di traduzione; non si alterano i titoli del programma o i salvataggi. I preset persistiti restano protetti dagli overlay 4E. Il secondo tentativo APK (`e4c98193`) è stato sostituito prima dell’artifact dal trigger sul commit applicativo definitivo. Nessun APK intermedio consegnato.

### CI e unico APK finale

Commit applicativo definitivo: `9bef28a573757d913aea950b5b448174b1e61bf2`. Tutti e quattro i workflow **completed/success** su questo SHA; **11 job success e 2 deploy skipped**, verificati singolarmente. Gitleaks e Dependency Review passati. Gli smoke preesistenti preparano soltanto database effimeri sui runner, senza migrazioni sui server originali.

| Workflow | Run | Esito |
| --- | --- | --- |
| Security Checks | [39045013576](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013576) | success |
| CI (mobile) | [39045013595](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013595) | success |
| Build & Deploy AI API | [39045013662](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013662) | success |
| Build & Deploy App | [39045013658](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013658) | success |

| Workflow | Job | ID | Esito |
| --- | --- | --- | --- |
| Security Checks | Secret leak detection | [117431893370](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013576/job/117431893370) | success |
| Security Checks | Dependency review | [117431893499](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013576/job/117431893499) | success |
| CI (mobile) | CI (mobile) / Typecheck, lint, test | [117431893442](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013595/job/117431893442) | success |
| CI (mobile) | CI (mobile) / E2E smoke (signup → primera sesión) | [117431893627](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013595/job/117431893627) | success |
| Build & Deploy AI API | Typecheck & test AI API | [117431893857](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013662/job/117431893857) | success |
| Build & Deploy AI API | CI / Typecheck, lint, test | [117431893878](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013662/job/117431893878) | success |
| Build & Deploy AI API | CI / E2E smoke (signup → primera sesión) | [117431893902](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013662/job/117431893902) | success |
| Build & Deploy AI API | Build & push AI API | [117433631912](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013662/job/117433631912) | success |
| Build & Deploy AI API | Deploy AI API | [117433982711](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013662/job/117433982711) | skipped |
| Build & Deploy App | CI / Typecheck, lint, test | [117431893814](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013658/job/117431893814) | success |
| Build & Deploy App | CI / E2E smoke (signup → primera sesión) | [117431894119](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013658/job/117431894119) | success |
| Build & Deploy App | Build & push App | [117433851375](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013658/job/117433851375) | success |
| Build & Deploy App | Deploy App | [117434289762](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045013658/job/117434289762) | skipped |

### APK verificato

- Unico APK finale: **Calistenia-4F-9bef28a5.apk**, **118.533.902 byte**.
- Workflow [39045008110](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045008110): build e smoke **success**, sul commit applicativo `9bef28a573757d913aea950b5b448174b1e61bf2`.
- Build job [117431941208](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045008110/job/117431941208), Gradle **BUILD SUCCESSFUL in 16m**. Smoke job [117435951960](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045008110/job/117435951960): success al primo tentativo su questo APK.
- [Artifact APK 12106455491](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045008110/artifacts/12106455491), [prove di avvio 12105448286](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39045008110/artifacts/12105448286).
- Variante release, firma Android Debug, arm64-v8a/x86_64; `assets/index.android.bundle` presente. Commit confermato da BUILD-INFO. Nessun Metro necessario.
- SHA-256 ricalcolato sui byte scaricati, identico al checksum della build:

`53a70ec6827d2be4919676f9d3f2c778b9bf0a55928dc63897cdab0bbeefeb5a`

ZIP scaricato: 57.340.289 byte; SHA-256 identico al digest dell’artifact:

`37c98873d47d0ae289909ff2ff3bbbd785cc851820b24ce86fda2deaf5cccc8a`

Prove startup: ZIP SHA-256 `43289291b41a41bae965a8e416d43c29764bd4402e38e6a4d4032465a1d2ad61`, identico al digest GitHub. Emulatore API 35 Pixel 7, installazione **Success**, avvio **COLD / Status ok**, TotalTime **5157 ms**, PID **2682**. Schermata React di accesso verificata anche visivamente. Rete remota disabilitata prima dell’avvio. Nessun crash iniziale osservato; nessuna prova autenticata o di servizi remoti. Emulatore in inglese: lo smoke non certifica il layout italiano né la correzione 4E sul telefono.

I tentativi precedenti 39044364228 (`4dc8382b`) e 39044607406 (`e4c98193`) sono stati annullati per sostituzione con sorgenti conclusivi, prima della produzione dei loro artifact. Non sono APK consegnati e i loro controlli non certificano questo SHA.

### Chiusura documentale e collaudo

Questo aggiornamento modifica esclusivamente documenti: il codice Android e i cataloghi restano identici all’APK `9bef28a5`. L’HEAD documentale finale e la verifica distinta dei suoi quattro workflow sono registrati nella PR #1 dopo la loro effettiva conclusione; il verde del commit applicativo non viene attribuito automaticamente all’HEAD successivo.

Revisione indipendente eseguita e rilievi risolti. Restano da eseguire revisione dell’utente e collaudo reale sul telefono. Checklist in `ANDROID_ITALIAN_PHASE4F_CHECKLIST.md`; inventari/residui nei JSON omonimi. Tutti i controlli telefonici partono NON ESEGUITI; i residui 4E restano aperti per la fase 6. Nessuna fase 4G o 7 avviata.
