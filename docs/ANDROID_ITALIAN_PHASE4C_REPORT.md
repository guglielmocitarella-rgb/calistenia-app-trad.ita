# Calistenia Android — report fase 4C

Data: 14 ottobre 2026. Ramo `feature/italian-localization`; PR #1 aperta/in bozza.

**Implementazione UI verificata automaticamente e APK standalone disponibile. Tutti i workflow e i singoli job del commit build `45d0e461` sono conclusi con successo (deploy skipped). Approvazione indipendente e collaudo telefonico della fase restano da eseguire.**

## Baseline e perimetro

Baseline verificata ramo/PR: `21f3bc9eafd8e4dd0b3928baa382562c6d239fb2`. CI iniziale definitivamente verde: App `38467599559`, AI API `38467599477`, Mobile `38467599552`, Security `38467599360`; singoli job verificati, Gitleaks e Dependency Review success; deploy skipped. La baseline applicativa APK 4B resta `94bc6c93`; il collaudo 4B e le sue precisazioni sono quelli forniti dall'utente. Editor/salvataggio approfondito dei programmi rimangono residui del progetto, senza ampliarli in 4C.

Letti audit/inventari delle fasi 2/3 e report/glossario/residui 4A/4B. Inventari storici conservati; scanner finale usato come verifica, non come nuovo audit generale.

## Copertura

Revisionate **545 chiavi**; modificati **525 valori italiani**. 5.305 chiavi per lingua; nessuna aggiunta/eliminazione. Famiglie nutrizione, digiuno, dispensa, spesa, acqua, tipi di pasto, ricette salvate, hint foto e comandi badge. L'inventario registra le fonti e lo stato di raggiungibilità: la revisione dell'intera famiglia per coerenza terminologica non implica che tutte le chiavi siano visualizzate su Android. La versione web carica esclusivamente ES/EN; i cataloghi EN/ES sono identici byte per byte.

Tradotti dashboard/obiettivi, diario e modali, acquisizione/analisi IA, macro/porzioni, piani giorno/settimana, digiuno/cronologia/errori, dispensa/scontrini/spesa, ricette e ricette salvate, coach/criteri/badge, anteprime e messaggi nativi di condivisione. Quattro widget nutrizionali con dizionari italiani e fallback ES/EN originali; snapshot e consumer tecnici preservati. Inventario hardcoded separato con le sedi precise e le famiglie adattate.

Date, litri, quantità e prezzi visuali italiani; campi editabili e parsing originali. Le unità `unidad/ud/unidades` diventano «pz» soltanto nelle etichette. Gli enum di pasto diventano Colazione/Pranzo/Cena/Spuntino nel rendering; nomi/titoli remoti restano originali. Overlay dei 16 campi di 8 badge locali tramite identità stabile. Gli esempi dispensa mostrano IT ma inviano il comando identico alla baseline. Il messaggio nativo di condivisione è italiano, mentre helper, URL e dati della scheda restano originali.

## Compatibilità

Nessuna modifica a backend, PocketBase, migrazioni, servizi IA, web, algoritmi, dati persistiti, contratti, Open Food Facts, identità, hook core o protezioni fase 3. Nessun `it` introdotto nei payload backend. Nessuna chiamata autenticata ai servizi originali e nessuna migrazione aggiunta o applicata ai loro database. Gli smoke della CI usano le procedure preesistenti su PocketBase temporanei dei runner.

Il test `nutrition-payload-language.test.ts` esegue le sette funzioni reali di trasporto (analisi pasto FormData, piani giornalieri e settimanali, generazione pantry, parse pantry, matcher e plan dispatch), intercettando soltanto fetch: stesso URL, JSON e FormData in IT/EN/ES dopo il rendering, con descrizione libera, meal_type, goal, quantità e nomi originali. Nessun locale aggiunto. I test visuali verificano fallback EN/ES/iOS, sconosciuti, unità/decimali, plurali/interpolazioni, comandi dispensa, badge e messaggio di condivisione senza mutazione. Le strutture persistite e i writer sono invariati byte per byte nei percorsi protetti; esistenti test snapshot/roundtrip e lingua restano attivi.

## Verifiche locali

| Controllo | Esito |
| --- | --- |
| Core completo | 2.789 test passati |
| Mobile completo | 198 test passati (8 nuovi) |
| Web completo | 688 test passati |
| Totale | 3.675 passati |
| Typecheck monorepo | success |
| Lint monorepo | 0 errori; 23 warning mobile preesistenti |
| Scanner Android | 0 parse diagnostics; 0 chiavi statiche mancanti |
| Placeholder/tag/URL/numeri | parità verificata; 0 errori |
| Plurali/interpolazioni | suite locali e nuovi test con i18next reale |
| EN/ES e percorsi protetti | identici alla baseline |
| Commitlint | quattro messaggi controllati separatamente: success |

Tre eccezioni JSX obsolete rimosse; una ridotta da 7 a 1 (COMIDA soltanto nel fallback non IT); test invariati e controllo più restrittivo. Web conserva avvisi jsdom/canvas not implemented nei test, con tutte le suite passate. Ambiente locale inizialmente esponeva pnpm 11: ripristinato l'unico cambiamento automatico di configurazione e installate dipendenze con pnpm 10.34.5 fissato; nessun lockfile/config/dipendenza modificati. Avviso installazione unrs-resolver preesistente, senza blocco dei controlli.

Revisione tecnica interna separata: due omissioni nella condivisione individuate e corrette; riesame senza problemi importanti. Non sostituisce la revisione indipendente richiesta dall'utente né il collaudo sul telefono.

## Commit, CI e APK

| Commit | Contenuto |
| --- | --- |
| `9f1e6108dbbdbf0169ff76cf6f157c881a694919` | Catalogo italiano nutrizione |
| `b36c96cd6b0725ae986e9aa197ca59e61692df84` | Interfaccia Android, adattatori e test |
| `45d0e461a6375e4aa2eee6b4ba2685ee09cc38e6` | Documentazione e solo commento del trigger APK |

Il tree salvato su GitHub `3e8af314bc83fa7ecd2dbc3ca0a76da425058071` coincide esattamente con il tree locale verificato. Commitlint passato sull'intero intervallo 4C (`21f3bc9e..45d0e461`). Questa consegna successiva modifica soltanto documentazione; SHA e CI relativi sono registrati nella [descrizione PR #1](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/pull/1) dopo la conclusione, senza attribuire all'APK un'origine documentale successiva.

### Workflow definitivi sul commit build `45d0e461`

| Workflow | Run | Esito |
| --- | --- | --- |
| Security Checks | [38564357551](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357551) | completed/success |
| CI (mobile) | [38564357399](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357399) | completed/success |
| Build & Deploy AI API | [38564357430](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357430) | completed/success |
| Build & Deploy App | [38564357439](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357439) | completed/success |
| Android TEST APK (standalone, no publication) | [38564351247](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564351247) | completed/success |

### Singoli job verificati

| Workflow | Job | ID | Esito |
| --- | --- | --- | --- |
| CI (mobile) | CI (mobile) / E2E smoke (signup → primera sesión) | [115853177413](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357399/job/115853177413) | completed/success |
| CI (mobile) | CI (mobile) / Typecheck, lint, test | [115853177417](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357399/job/115853177417) | completed/success |
| Security Checks | Dependency review | [115853127092](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357551/job/115853127092) | completed/success |
| Security Checks | Secret leak detection | [115853127517](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357551/job/115853127517) | completed/success |
| Build & Deploy AI API | Typecheck & test AI API | [115853128062](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357430/job/115853128062) | completed/success |
| Build & Deploy AI API | CI / Typecheck, lint, test | [115853128396](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357430/job/115853128396) | completed/success |
| Build & Deploy AI API | CI / E2E smoke (signup → primera sesión) | [115853128682](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357430/job/115853128682) | completed/success |
| Build & Deploy AI API | Build & push AI API | [115857142572](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357430/job/115857142572) | completed/success |
| Build & Deploy AI API | Deploy AI API | [115857766858](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357430/job/115857766858) | completed/skipped |
| Build & Deploy App | CI / E2E smoke (signup → primera sesión) | [115853127845](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357439/job/115853127845) | completed/success |
| Build & Deploy App | CI / Typecheck, lint, test | [115853127925](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357439/job/115853127925) | completed/success |
| Build & Deploy App | Build & push App | [115857127930](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357439/job/115857127930) | completed/success |
| Build & Deploy App | Deploy App | [115858338953](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564357439/job/115858338953) | completed/skipped |
| APK standalone | build | [115853107177](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564351247/job/115853107177) | completed/success |
| APK standalone | smoke | [115861253546](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564351247/job/115861253546) | completed/success |

### APK e prove scaricate

- Origine: `45d0e461a6375e4aa2eee6b4ba2685ee09cc38e6`; stessi sorgenti applicativi di `b36c96cd6b0725ae986e9aa197ca59e61692df84`.
- [Artifact APK GitHub](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564351247/artifacts/11896620818); [prove startup](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38564351247/artifacts/11895637366).
- APK: **118.371.606 byte**, variante release con **firma Android Debug**, ABI arm64-v8a/x86_64, `assets/index.android.bundle` incluso. Nessuna release/tag/pubblicazione.
- SHA-256 ricalcolato sul file scaricato e identico a `SHA256SUMS.txt` e al log build:

`e2bb1cfd9b34ab7e0d1b1148a71c941cfb79620025a09b5ab0d9382ca5bc08be`

- ZIP: **57.292.955 byte**, digest scaricato e identico a quello dell'artifact: `51560635b7b393a2f7c84c210f94483983b7a457ce418c60ecffb1c23007e88f`.
- Metadati `BUILD-INFO.txt` confermano origine, variante, firma, ABI e nessuna necessità di Metro. Certificato SHA-256: `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`.
- Gradle: BUILD SUCCESSFUL in 15m 35s; bundle/firma/checksum verificati dal job build. Nessuna modifica applicativa per ottenere la compilazione; riutilizzata l'infrastruttura esistente, solo il commento 4B → 4C per il push trigger autorizzato.
- Smoke su emulatore API 35 Pixel 7: installazione `Success`; avvio `Status: ok`, `LaunchState: COLD`, `TotalTime: 6863 ms`; PID presente e schermata React login renderizzata. Wi-Fi e dati remoti disabilitati prima dell'avvio; nessun Metro o accesso autenticato. La prova non certifica i flussi nutrizionali autenticati o il layout sul telefono.
- Artifact GitHub APK disponibile fino al **17 ottobre 2026, 14:49 Europe/Rome**. File di consegna: `Calistenia-4C-TEST-standalone.apk`, stessi byte verificati.

## Residui e limiti

Nomi alimenti/prodotti/catalogo/OFF, ricette, ingredienti, passi, note, descrizioni IA, consigli/coach, righe originali degli scontrini e dati utente restano quelli ricevuti o inseriti. Errori remoti liberi non riconosciuti possono restare ES/EN. Non vengono tradotti automaticamente, copiati nei dati o trattati come chiavi UI. I fallbacks ES/EN nei componenti rimangono intenzionalmente originali.

Nessun collaudo funzionale/visivo telefonico, nessuna verifica autenticata sui server originali. Rivedere troncamenti su piccoli schermi, decimal input/salvataggio, retry IA reali, timer/sospensione, sync/offline, condivisione e vecchi snapshot widget tramite checklist. Non iniziare 4D o merge prima dell'approvazione.

## Documenti

- `ANDROID_ITALIAN_PHASE4C_STRINGS.json`: chiavi, valori e fonti.
- `ANDROID_ITALIAN_PHASE4C_HARDCODED.json`: adattamenti visuali e sedi.
- `ANDROID_ITALIAN_PHASE4C_RESIDUAL.json`: residui remoti, tecnici e limiti.
- `ANDROID_ITALIAN_PHASE4C_CHECKLIST.md`: collaudo telefono.
- `ANDROID_ITALIAN_PHASE4A_GLOSSARY.md`: estensione terminologica 4C.
