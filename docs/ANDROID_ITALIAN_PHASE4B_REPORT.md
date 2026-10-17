# Calistenia Android — report fase 4B

Data: 13 ottobre 2026. Ramo `feature/italian-localization`. [PR #1](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/pull/1) mantenuta in bozza.

**Implementazione UI disponibile per revisione; fase 4B non dichiarata conclusa.** Il catalogo tecnico mantiene contenuti ES/EN e il nuovo APK richiede collaudo visivo sul telefono. I controlli automatici non attestano la copertura delle righe server, la qualità biomeccanica di descrizioni non tradotte o il comportamento dei servizi distribuiti.

## Baseline, commit e metodo

- Commit iniziale approvato: `90f40eb2b06f6fb5b8c7d57b8f8d834ba41cfac2`.
- Verifica iniziale diretta: ramo e PR su questa baseline, PR open/draft, tutti i workflow e i singoli job conclusi con successo. Preservati contatore `{{count}} sett.`, etichetta del profilo e navigazione «Allenati».
- Commit del catalogo: `2b5f75deecff543f314af088f519e54a57a4fb5b`.
- Commit degli adattatori visuali: `01149bdf41089159843c91a8143d548357a0d352`.
- Commit applicativo finale: `94bc6c9325c2759887e094f021c003fef09b0e5d`; tree `977cce5a2fdbca50356cf79149a2bc0e1f085fad`.
- La successiva consegna del report modifica soltanto documentazione; il suo SHA e la CI relativa sono registrati nella descrizione della PR. L'APK è identificato dal proprio commit di origine, senza attribuirgli SHA documentali successivi.

Letti audit, inventari, confini linguistici, compatibilità fase 3, report/glossario/stringhe/residui/correzioni della 4A. Gli inventari della fase 2 restano invariati. Lo scanner esistente è stato eseguito come controllo finale, conservando i suoi risultati fuori dagli inventari storici. La baseline locale aveva esattamente il tree remoto `a3cef7155342cfb4852624679a772cc700b05224`; il tree applicativo finale è stato confrontato con quello creato su GitHub.

Traduzione iniziale con DeepL e revisione contestuale secondo il glossario locale, comprese correzioni di core, rest, sets, resume, free session, round, nomi dell'attrezzatura e qualificatori tecnici. Il piano DeepL Free non permette glossari/formalità/contesto remoti: nessun glossario remoto è stato creato o modificato. I numeri, le unità, i marchi, i tag e i placeholder sono stati ricontrollati dopo la traduzione.

## Copertura dei testi visuali

**989 chiavi revisionate, 833 valori italiani modificati; 5.305 chiavi per lingua, nessuna chiave aggiunta, rimossa o rinominata.** EN ed ES sono byte-identici alla baseline. Tutti i valori revisionati nella 4A restano identici. L'inventario [ANDROID_ITALIAN_PHASE4B_STRINGS.json](ANDROID_ITALIAN_PHASE4B_STRINGS.json) elenca chiavi, testi prima/dopo, uguaglianze intenzionali, riferimenti storici e punti di rendering adattati.

| Flusso | Testi UI tradotti | Contenuti che conservano la lingua originale |
| --- | --- | --- |
| Allenati | Il tuo programma, Cambia, Questa settimana, fase/avanzamento, Riposo, Sessione libera, Cardio GPS, Circuito, Esplora | Nomi del programma, della fase e delle sessioni |
| Programmi | Catalogo, filtri, selezione/cambio, dettaglio, duplicazione, abbandono, stati vuoti/errori | Nomi, descrizioni, istruzioni e note nei record originali |
| Editor | Passaggi, fasi/giorni, aggiunta/rimozione, copie, serie/reps/recuperi, media, validazioni e salvataggio | Valori nei campi editabili e default persistibili restano ES/EN |
| Catalogo esercizi | Ricerca, categorie, difficoltà, gruppi muscolari e attrezzatura nei filtri, dettagli, varianti e progressioni | Nomi, testo anatomico, note e descrizioni originali degli esercizi; ricerca sugli originali |
| Sessioni | Esecuzione, serie, ripetizioni, pausa/ripresa, recupero, timer, completamento, riepilogo, errori e notifiche locali | Nomi/istruzioni dei workout e degli esercizi, note dell'utente |
| Storico/calendario | Sessioni recenti, stati vuoti della lista, dettagli delle sessioni, pianificazione e riposo | Altre parti della schermata Progresso, nutrizione/sonno e statistiche non coinvolte |
| Sessione libera/IA | Form, opzioni, anteprima, fasi, ricerca/selezione, riscaldamento/defaticamento, errori e suggerimenti | Prompt iniziale, titolo persistito «Sesión IA», messaggi dell'utente e risposte server |
| Circuiti/cardio GPS | Modalità, round, durata, esercizi, recuperi, comandi, riepilogo e dati cardio | Nomi nelle definizioni originali dei preset e contenuti remoti |
| Programmi guidati | Cornice e comandi; chiavi locali note `communityProgram.*`, incluso il programma 30 giorni | Eventuali chiavi server non censite e contenuti arbitrari |

La presenza di termini inglesi tecnici validi (Core, muscle-up, planche, Tabata, EMOM, TRX, ecc.) è esplicita nell'inventario. Il conteggio delle chiavi comprende famiglie UI di allenamenti/programmi anche quando una singola chiave è usata da altri consumer; la versione web non registra IT e non cambia comportamento.

## Hardcoded, risorse locali e overlay

- **52 punti di rendering** instradati verso etichette italiane, con fallback originali esatti per EN/ES/iOS. Comprendono form IA, anteprima, riscaldamento/defaticamento, dettagli cardio, metriche delle sessioni, difficoltà/categorie e placeholder di ripetizioni.
- `training-ui.it.json`: **10 etichette locali**, comprese creazione sessione, luogo/tempo, metriche dell'orologio e «intentos» → «tentativi». Le altre etichette riutilizzano chiavi esistenti.
- `training-reps.it.json`: **25 qualificatori esatti** delle ripetizioni; regole limitate aggiuntive rendono per lato/gamba/braccio/direzione/posizione e termini equivalenti già riconosciuti dal helper originale. Nessun cambiamento numerico o di unità. Testi ignoti passano inalterati.
- Categorie e difficoltà tradotte soltanto nei componenti visuali; gli ID dei filtri, le query, l'ordinamento e i campi cercabili non vengono tradotti.
- Data dei dettagli cardio italiana soltanto su Android IT; gli altri contesti conservano il locale ES originale.
- Nessun overlay di nomi, muscoli, note o descrizioni aggiunto agli oggetti del catalogo, dell'editor o delle sessioni. Nessun file dati core originale modificato.
- In `jsx-text-baseline.json` sono rimosse **cinque sole eccezioni obsolete** per file ora localizzati. Test, rilevatori ed esenzioni restano invariati: la lista consentita si restringe.

Le mappe delle opzioni del form conservano i label spagnoli come fallback; ogni label è tradotta soltanto nel rendering. Non costituiscono residui visuali in Android IT. «Circuito personalizado»/«Custom circuit» restano nella definizione che viene salvata, per preservare il contratto della fase 3.

## Compatibilità e persistenza

Gli adattatori restituiscono soltanto stringhe. Sono applicati a `Text`, caption, label, accessibilità e placeholder; non ai valori degli input editabili, ai callback di selezione o agli oggetti salvabili. `TodayBlock` produce soltanto righe visuali. `SessionDetailBody` traduce la cella delle ripetizioni senza modificare la serie sottostante.

Cinque nuovi test mobile usano i cataloghi reali e un'istanza i18next: record congelati/invariati; categorie e target soltanto visuali; fallback EN/ES/iOS e identità ignote; copia tramite il vero `catalogToEditorExercise` con testo originale EN/ES; messaggi dei suggerimenti IA identici alla baseline. Osservata la fase red prima dell'implementazione degli adattatori e dei qualificatori. I test esistenti della fase 3 su serializer, editing fissato, programmi legacy, copie e ripristino restano presenti e passano nella suite completa.

Il costruttore `AISessionForm.handleSubmit` è byte-identico alla baseline; `UserContext`, enum, messaggio iniziale e parser non cambiano. Per i quattro suggerimenti IA, Android IT mostra l'etichetta italiana ma invia la stessa stringa inglese che la baseline IT conteneva. Le scelte esplicite ES/EN mantengono il proprio messaggio originale.

Confronto invariato per `apps/web`, backend/migrazioni/server IA, core hooks/lib/data/platform, auth, protezioni linguistiche, serializer, algoritmi, timer, log, cache/sync, adapter dell'editor, chat/parser IA, configurazione i18n/init-core, EN/ES, dipendenze e lockfile. L'unica modifica al workflow APK è un commento per utilizzare il trigger push già esistente. Nessun nuovo `it` nei record, nessuna migrazione, route/enum/ID/payload rinominato.

Non sono stati eseguiti salvataggi autenticati sul server originale in questo turno. I test di fixture non sostituiscono il confronto dei record reali dopo il collaudo telefonico.

## Verifiche locali

| Controllo | Esito |
| --- | --- |
| Core completo | 201 file, 2.789 test passati |
| Mobile completo | 22 file, 190 test passati |
| Web completo | 74 file, 688 test passati |
| Totale | 3.667 test passati |
| Typecheck monorepo | Core/mobile/web passati |
| Lint monorepo | 0 errori; 23 warning mobile preesistenti; web passato |
| Scanner Android | 0 parse diagnostics, 0 chiavi statiche mancanti |
| Parità chiavi/placeholder, tag, URL e numeri | Nessuna differenza; qualificatori numerici invariati |
| Plurali/interpolazioni | Suite locali reali; singolari disponibili/mese/sessione corretti; conteggio non trovati reso come etichetta neutra |
| EN/ES, valori 4A e file protetti | Invariati |
| Commitlint | Messaggi nuovi conformi; CI verifica anche l'intervallo della PR |
| Diff/check dei confini | Passato; nessuna modifica a contratti, algoritmi e persistenza |

La diagnostica jsdom sul canvas nella suite web è preesistente e non provoca fallimenti. La prima esecuzione core ha segnalato le cinque eccezioni obsolete del rilevatore JSX: rimosse senza indebolire il test; suite completa rieseguita con successo. Una fixture iniziale mancava dell'ID obbligatorio: aggiunto l'ID originale, typecheck completo rieseguito con successo. Nessun errore noto ignorato.

## GitHub Actions

Baseline: Build & Deploy App `38454253482`, Build & Deploy AI API `38454253173`, CI mobile `38454253104`, Security `38454253431`: tutti success, singoli job verificati, deploy skipped.

Verifica diretta sul commit applicativo finale `94bc6c93`: tutti i workflow conclusi con successo e tutti i singoli job controllati. Deploy esclusi sulle PR, come previsto.

| Workflow | Run | Esito verificato |
| --- | --- | --- |
| Build & Deploy App | [38463892232](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38463892232) | success |
| Build & Deploy AI API | [38463892214](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38463892214) | success |
| CI mobile | [38463892234](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38463892234) | success |
| Security Checks | [38463892199](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38463892199) | success |

### Singoli job del commit applicativo

| Workflow | Job | Esito |
| --- | --- | --- |
| Build & Deploy App | CI / Typecheck, lint, test | success |
| Build & Deploy App | CI / E2E smoke (signup → primera sesión) | success |
| Build & Deploy App | Build & push App | success |
| Build & Deploy App | Deploy App | skipped |
| Build & Deploy AI API | Typecheck & test AI API | success |
| Build & Deploy AI API | CI / E2E smoke (signup → primera sesión) | success |
| Build & Deploy AI API | CI / Typecheck, lint, test | success |
| Build & Deploy AI API | Build & push AI API | success |
| Build & Deploy AI API | Deploy AI API | skipped |
| CI (mobile) | CI (mobile) / E2E smoke (signup → primera sesión) | success |
| CI (mobile) | CI (mobile) / Typecheck, lint, test | success |
| Security Checks | Secret leak detection | success |
| Security Checks | Dependency review | success |

Gitleaks e Dependency Review entrambi success; Commitlint, typecheck, lint, test e smoke E2E success. Nessun deploy effettuato. La CI della successiva consegna documentale è verificata separatamente e riportata nella descrizione PR, senza usare questi run come prova per quel commit.

## APK standalone

Il connettore non espone `workflow_dispatch`. È stato utilizzato il trigger push già presente nel workflow, mediante un solo commento; nessuna modifica del comportamento della build e nessun artificio nel codice applicativo. Il workflow [38463885405](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38463885405) usa il commit `94bc6c9325c2759887e094f021c003fef09b0e5d`.

Build `115525726054` e smoke `115534209807` entrambi **completed/success**. Artifact realmente presente, non scaduto, scaricato e verificato:

- [Artifact APK `11848995481`](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38463885405/artifacts/11848995481), archivio di 57.281.514 byte.
- APK: `Calistenia-TEST-standalone.apk`, 118.316.614 byte. File per il collaudo: `Calistenia-4B-94bc6c93.apk`, stessi byte.
- **SHA-256 APK:** `d2ff2b40f6cb5f52dc6125543c043595bdf03c5256bcf25a28047496e2d01367`.
- Checksum calcolato sui byte scaricati e confrontato con `SHA256SUMS.txt`; non confuso con il digest dell'archivio ZIP.
- `BUILD-INFO.txt`: commit `94bc6c9325c2759887e094f021c003fef09b0e5d`, variante release con firma **Android Debug**, ABI arm64-v8a/x86_64, Metro non richiesto.
- Firma V2 Android Debug; digest certificato SHA-256 `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`.
- Asset `assets/index.android.bundle` presente; riscontrate nel bundle le nuove stringhe italiane, comprese «Il tuo programma», «max in tutti i test» e «10 (3s in alto)».
- [Evidenze startup `11848858533`](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38463885405/artifacts/11848858533): installazione Success; avvio COLD/Status ok di `tech.guille.calistenia/.MainActivity`; React login renderizzato, processo presente, senza Metro. Rete Wi-Fi/dati disabilitata prima dell'avvio.
- Emulatore API 35 x86_64 Pixel 7. Nessun crash osservato prima della schermata di accesso; nessuna prova autenticata/di lunga durata o collaudo visivo completo dei flussi 4B.
- Artifact APK disponibile su GitHub fino al **16 ottobre 2026, 22:53:27 Europe/Rome**.

Nessuna release, tag o distribuzione pubblica. Il collaudo sull'emulatore non sostituisce le prove sul telefono.

## Residui editoriali e limiti

[ANDROID_ITALIAN_PHASE4B_RESIDUAL.json](ANDROID_ITALIAN_PHASE4B_RESIDUAL.json) contiene identità e campi senza italiano, quantità, origini, procedura sicura e dipendenze.

| Risorsa originale | Residuo senza italiano | Volume indicativo EN, altrimenti ES |
| --- | ---: | ---: |
| Nomi del catalogo | 1.579 | 6.271 parole |
| Testi dei muscoli | 1.579 | 4.891 parole |
| Note | 1.579 | 2.105 parole |
| Descrizioni tecniche | 1.558 | 107.485 parole |
| Riscaldamento/defaticamento bundled | 19 identità con nome/muscoli/note originali | ES/EN |
| Preset circuiti | 3 nomi di preset, 5 definizioni di esercizio | Mappe originali ES/EN |

I conteggi censiscono l'assenza del campo italiano, anche nelle mappe con testo vuoto; campi con testo non vuoto: 1579 nomi, 1579 testi muscolari, 167 note, 1557 descrizioni. Non provano che ogni termine sia straniero: molti nomi tecnici sono corretti anche in italiano. I record remoti e gli override del server non sono inclusi nel conteggio locale. Il volume è misurato con token separati da spazi, non con rilevamento automatico della lingua.

Per completare il catalogo serve un blocco editoriale: risorsa italiana immutabile per identità stabile, lookup soltanto in lettura, editor/ricerca/salvataggi sugli originali, fixture per tutti i consumer, revisione di tecnica/varianti e successivo collaudo. Non aggiungere IT ai dati canonici né sovrascrivere mappe EN/ES. Le risposte IA, le note degli utenti, i messaggi server/SDK arbitrari e i nomi dei programmi/sessioni restano originali.

I template delle immagini esportate dei risultati possono ancora contenere copy ES/EN: questa consegna traduce i comandi di riepilogo/condivisione, senza avviare il blocco editoriale delle immagini share. Nutrizione, social, sonno, analisi dei progressi, foto corporee e widget restano fuori dal blocco. I comandi di ingresso nelle gare/social visibili dalla schermata Cardio (`race.create`, `race.findNearby`, `race.join`, `race.pasteLinkPlaceholder`) restano EN: il flusso gare/social è escluso; i comandi della normale sessione GPS sono tradotti. Alcune chiavi legacy `train.*` inutilizzate dalla scheda attuale restano EN: non sono considerate copertura runtime.

## Checklist telefono — tutte le prove seguenti ancora da eseguire sul nuovo APK

- [ ] Aprire Allenati: programma, fase/settimana, avanzamento, giorni, riposo e alternative; niente troncamenti.
- [ ] Cambiare programma, aprire dettagli e calendario, duplicare un programma di test; confrontare ID/mappe originali.
- [ ] Aprire editor: fasi/giorni, copia, aggiunta/rimozione, serie/reps/recuperi; salvare senza edit e poi con una modifica reale.
- [ ] Catalogo: categorie, difficoltà, muscoli, attrezzatura e ricerca con nomi originali; dettagli, varianti e progressioni.
- [ ] Sessione libera: selezionare/ordinare esercizi, anteprima, riscaldamento e defaticamento, avvio.
- [ ] Sessione IA: form, generazione, suggerimenti, errore/retry, anteprima e avvio; risposte server possono restare ES/EN.
- [ ] Circuito: modalità, round, lavoro/recupero, pausa/ripresa e fine; target identici alla baseline.
- [ ] Allenamento: serie/ripetizioni, timer e recupero; sospendere/riprendere, completare e leggere riepilogo/storico.
- [ ] Salvare soltanto dati di test autorizzati; riaprire app e verificare ripristino/sincronizzazione, nessun IT nei record.
- [ ] Controllare schermo stretto, font grandi, tastiera, accessibilità e pulsanti; verificare contatore profilo/Allenati della 4A.
- [ ] Passare a EN e ES: label, dati, navigazione, input IA e salvataggi originali conservati.

**Fermarsi alla revisione indipendente e al collaudo fisico. Nessun merge, nuova PR, modifica di main, release o avvio della fase 4C.**
