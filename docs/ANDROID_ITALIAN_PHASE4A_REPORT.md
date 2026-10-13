# Calistenia Android — report fase 4A

Baseline: `f531b3b822ca5f88c19f2b85df6cf42426e352ea`. Ramo: `feature/italian-localization`. PR #1 mantenuta in bozza. Data: 13 ottobre 2026.

## Autorizzazione e perimetro

Il collaudo telefonico positivo della baseline è stato comunicato dall'utente: avvio/lingua, accesso, allenamenti, salvataggio, IA/alimentazione e sincronizzazione. È l'autorizzazione a iniziare **solo la fase 4A**, non una prova del nuovo APK tradotto. Nessuna fase successiva, merge o release autorizzata.

Lavoro basato sull'audit e sugli inventari della fase 2, conservati integralmente alla loro revisione originale. Il controllo aggiornato dello scanner esistente è stato eseguito con output temporanei, senza sovrascrivere gli inventari storici.

## Stringhe del blocco

**592 chiavi revisionate, 535 valori modificati rispetto alla baseline, 33 valori italiani già presenti confermati e 24 valori identici all'inglese ammessi con motivazione.** Tutte le 5.305 chiavi restano presenti nei cataloghi, senza aggiunte, rimozioni o rinomine. Modificato solo il catalogo IT; EN ed ES invariati byte per byte.

`ANDROID_ITALIAN_PHASE4A_STRINGS.json` contiene l'elenco esatto, il testo inglese e italiano di ogni chiave, i valori cambiati e le eccezioni motivate. Non è stato tradotto l'intero catalogo mobile.

| Gruppo | Chiavi revisionate |
| --- | ---: |
| Onboarding e salute/impostazioni iniziali | 140 |
| Dashboard/home, settimana, obiettivo e stati | 138 |
| Profilo | 69 |
| Pulsanti e messaggi comuni | 53 |
| Navigazione | 26 |
| Giorni e abbreviazioni (`day` / `dayShort`) | 32 |
| Login e registrazione | 19 |
| Impostazioni notifiche | 16 |
| Guida rapida | 14 |
| Account e cancellazione | 12 |
| Mesi | 12 |
| Cornice UI Scopri / Novità | 14 |
| Etichette di supporto usate nel blocco | 47 |
| **Totale** | **592** |

Inclusi accessibilità, testi dinamici delle condizioni/infortuni, livelli, obiettivi, giorni, preferenze, plurali della dashboard e guida delle cinque schede. Le etichette di supporto comprendono attività cardio e difficoltà dei programmi visualizzate nella home/onboarding; **non** la traduzione delle schermate dettagliate cardio/social/nutrizione.

Traduzione iniziale delle singole stringhe con DeepL, seguita da revisione contestuale e uniformazione al glossario `ANDROID_ITALIAN_PHASE4A_GLOSSARY.md`. La traduzione documentale XLIFF è stata rifiutata dal servizio; glossari e contesto remoto non sono disponibili nel piano Free. Nessun glossario remoto modificato. Corretti significati ambigui quali train, sets, light, planche, minutes e streak, oltre ai singolari e a un placeholder tradotto erroneamente dal servizio.

## Interventi solo di visualizzazione

- `StepPersonalizing.tsx`: i mesi della proiezione sono italiani su Android IT, letti dal catalogo; calcolo di settimane/data/peso e percorsi ES/EN/iOS conservati.
- `WhatsNewModal.tsx`: data della cronologia in locale IT su Android; nessuna modifica alla selezione o ai testi dei changelog.
- `italian-ui-labels.ts` e `profile.tsx`: nomi delle cinque abilità resi tramite chiavi UI e ID PR esistenti. Gli oggetti prodotti da `buildSkills`, valori, unità, record e definizioni core non sono modificati.
- `login.tsx`: due messaggi PocketBase riconosciuti (`Failed to authenticate.` e `Failed to create record.`) visualizzati con le chiavi italiane esistenti. Errori arbitrari conservati. Hook auth, flussi, richieste e registrazione non modificati.

Gli adattatori si applicano esclusivamente ad Android con UI italiana; gli altri contesti conservano i valori originali. Non sono usati per creare o salvare contenuti.

## Verifiche locali

| Controllo | Risultato |
| --- | --- |
| Suite core completa | 201 file, 2.789 test passati |
| Suite mobile completa | 21 file, 185 test passati |
| Suite web completa | 74 file, 688 test passati |
| Totale | 3.662 test passati |
| `pnpm -r typecheck` | Core, mobile e web passati |
| `pnpm -r lint` | Zero errori; 23 warning mobile preesistenti; web passato |
| Chiavi, duplicati, placeholder, plurali | Guardrail esistenti passati nelle suite |
| Scanner AST fase 2 aggiornato | Zero chiavi statiche mancanti; 5.305 chiavi per lingua |
| Placeholder, tag, numeri, URL nelle 592 chiavi | Nessuna differenza rispetto a EN |
| Modifiche fuori dall'elenco autorizzato del catalogo | Zero |
| `git diff --check` | Passato |

I quattro nuovi test mobile usano un vero i18next e i cataloghi reali: etichette di abilità da ID stabile senza mutazione del record, conservazione degli altri contesti/ID ignoti, errori riconosciuti e testo remoto ignoto, plurali/interpolazione e traduttori contenuti ES/EN. Per i due adattatori è stata osservata la fase red (2 fallimenti attesi), poi green. Nessun test esistente modificato, disabilitato o indebolito. Il messaggio jsdom relativo a canvas nella suite web è diagnostica preesistente: suite completata con successo.

Hardcoded nel perimetro delle schermate: rimangono soltanto CALISTENIA, kg e i nomi propri delle lingue. Le mappe mese ES/EN storiche sono conservate; IT proviene dal catalogo. Literal tecnici, nomi delle route, enum, chiavi, valori numerici, unità e marchi sono stati esclusi contestualmente. I nomi inglesi delle abilità nel core restano intenzionalmente invariati e vengono tradotti solo durante il rendering del profilo.

Confronto byte per byte con la baseline passato per web, backend, migrazioni, API/core hooks, protezioni linguistiche fase 3, workflow, plugin di build, script, EN/ES e configurazione i18n/init-core mobile. Nessuna dipendenza o lockfile modificata. Nessuna nuova scrittura server di `it`, nessun nuovo locale nei payload. Le guardie contro la contaminazione dei contenuti sono incluse nella suite core completa.

## CI del nuovo commit

La verifica finale post-push deve riferirsi allo SHA della fase 4A, con run e job elencati nella descrizione della PR #1. Le evidenze CI della baseline non sono utilizzate per dichiarare verde il nuovo commit.

Sono da controllare tutti i quattro workflow attivati da questa PR: Build & Deploy App, Build & Deploy AI API, CI (mobile), Security Checks (incluse Secret leak detection e Dependency review). `ci.yml` è riutilizzabile e i suoi job sono inclusi nei workflow chiamanti. I deploy sono esclusi dagli eventi PR. `build-mobile-apk.yml` è di release e non viene invocato; il workflow TEST APK non è attivato dalle modifiche 4A, che non toccano i suoi path. Non si produce né si dichiara collaudato un nuovo APK in questa fase.

## Residui e limiti espliciti

`ANDROID_ITALIAN_PHASE4A_RESIDUAL.json` elenca **1.687 chiavi candidate Android fuori dal blocco** ancora uguali a EN, con i riferimenti della fase 2. Il totale dell'intero catalogo uguale a EN è 4.648 (include web, non determinati e termini correttamente identici). Queste uguaglianze non sono, da sole, prove di mancata traduzione.

- Programmi, titoli di allenamenti, nomi/note dell'utente, esercizi del catalogo e risposte IA/alimentazione restano contenuti originali ES/EN. Nessun overlay dei contenuti salvabili introdotto.
- Titoli/descrizioni dei programmi community ricevuti come chiavi server, badge e traguardi fuori dal blocco possono ancora usare EN/ES. Non si assume una copertura completa di valori server ignoti.
- Le cornici UI di Novità e Scopri sono tradotte, ma le risorse bilingui `changelog.mobile.json` / `features.json` e i relativi contenuti/commit restano originali. Non è stato avviato quel blocco editoriale.
- I due errori standard di accesso sono localizzati. Messaggi remoti/SDK arbitrari e diagnostica tecnica non vengono tradotti né alterati.
- Widget, Health Connect, dettagli allenamenti/cardio, nutrizione, social e blocchi successivi non tradotti in questa fase.
- La nuova UI non è stata collaudata sul telefono: la prova positiva dell'utente riguarda `f531b3b`. Troncamenti, font grandi, tastiera, layout dei selettori e lettura con TalkBack richiedono revisione del nuovo APK prima di un'eventuale pubblicazione. I test non certificano questi aspetti visivi.

**Fermarsi alla revisione della fase 4A con PR in bozza. Nessuna migrazione manuale, modifica dei dati sui server, merge, tag, pubblicazione o release eseguita.**
