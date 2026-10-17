# Rettifica della verifica fase 3 — CI della PR #1

13 ottobre 2026. Avanzamento delle fasi sospeso. PR #1 resta in bozza.

## Errore nel processo precedente

La valutazione della fase 3 includeva core/mobile locali, ma non la suite web e i run GitHub Actions. Non rappresentava quindi l'esito complessivo della PR. La compatibilità della fase 3 non è dichiarata completata; la fase 4 resta bloccata da qualsiasi controllo richiesto fallito, in corso o non verificato, oltre ai precedenti requisiti APK/collaudo autorizzato.

## Inventario completo dei workflow

Sono stati esaminati tutti i sette file in `.github/workflows`, i filtri di trigger, le dipendenze `needs`, le condizioni PR/push/manuale e tutti i job dei cinque run del ramo. La richiesta paginata dei job usa `per_page=100` e il totale restituito corrisponde ai job analizzati.

| Workflow | Trigger pertinente / comportamento |
| --- | --- |
| `build-app.yml` — Build & Deploy App | PR #1: richiama CI riutilizzabile e build Docker senza push; deploy escluso sulle PR |
| `build-ai-api.yml` — Build & Deploy AI API | PR #1: CI riutilizzabile, build/typecheck/test AI API e build Docker senza push; deploy escluso sulle PR |
| `ci-mobile.yml` — CI (mobile) | PR #1: richiama entrambe le verifiche del workflow riutilizzabile |
| `ci.yml` — CI Checks | Solo `workflow_call`: non genera un run indipendente; test di tutti i workspace, typecheck/lint, contratti/schema/contenuto, smoke E2E e PB effimero |
| `security.yml` — Security Checks | PR #1: Gitleaks e Dependency Review |
| `build-android-test-apk.yml` — Android TEST debug APK | Push/manuale, guard di artifact privato; il run esistente è fallito prima della build. Non aggirato, nessun APK dichiarato compilato |
| `build-mobile-apk.yml` — Build Mobile APK & Release | Solo manuale/tag: nessun run della PR. Non avviato: pubblica release, fuori dal perimetro autorizzato di questa correzione |

## Run precedenti esaminati

Commit verificato dai run seguenti: `50b0906f37a45e18bf3b8991910f8f2409b315c5`. Il workflow riutilizzabile viene eseguito sul merge sintetico della PR; i risultati sono attribuiti alla head indicata da GitHub.

| Run | Workflow / job | Esito concluso / errore |
| --- | --- | --- |
| [38417121017](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38417121017) | Build & Deploy App — CI / Typecheck, lint, test | Fallito: 24 test web, 6 file; core 2.782 e mobile 181 passati |
| stesso run | CI / E2E smoke (signup → primera sesión) | Superato, contro PocketBase effimero di CI; non prova il backend originale |
| stesso run | Build & push App | Saltato a causa della dipendenza CI fallita |
| stesso run | Deploy App | Saltato; deploy non previsto per PR |
| [38417120296](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38417120296) | Build & Deploy AI API — Typecheck & test AI API | Superato |
| stesso run | CI / Typecheck, lint, test | Fallito: stessa regressione web |
| stesso run | CI / E2E smoke | Superato |
| stesso run | Build & push AI API | Saltato a causa della dipendenza CI fallita |
| stesso run | Deploy AI API | Saltato; deploy non previsto per PR |
| [38417120265](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38417120265) | CI (mobile) / Typecheck, lint, test | Fallito: esegue anche i test web, stessa regressione |
| stesso run | CI (mobile) / E2E smoke | Superato |
| [38417120399](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38417120399) | Security Checks — Dependency review | Fallito: Dependency Review non supportato/configurato, log richiede Dependency Graph abilitato sul fork |
| stesso run | Secret leak detection | Fallito: 27 segnalazioni nell'inventario audit, analizzate sotto; warning aggiuntivi per commenti PR non autorizzati all'action |
| [38417119633](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38417119633) | Android TEST debug APK — build | Fallito: `Require private artifact access`; repository pubblico. Passi di compilazione non eseguiti |

Tutti questi run sono terminati. Non si interpreta un job saltato come un controllo superato.

## Regressioni corrette

1. `getLanguagePolicy` è un export nuovo e opzionale, ma cinque mock web completi del modulo platform non lo esponevano. Vitest lanciava un errore, anche quando l'app avrebbe dovuto seguire il percorso senza politica Android. Aggiornati **solo i mock** in ActiveSessionContext, ProgramEditor autocancel/circuit/media e Programs batch, con `getLanguagePolicy: () => undefined`, cioè lo stato reale del consumer web. Nessun test/assert disabilitato o indebolito.
2. L'uso incondizionato di `getFixedT()` aveva modificato il percorso web prima dell'init di i18next: `t()` originale era tollerante, `fixedT()` lanciava `overloadTranslationOptionHandler is not a function`. Il fallimento era anche nascosto dal normale fallback delle query programma. `contentT()` restituisce ora **l'originale `i18n.t`** in assenza dell'adattatore, e usa il traduttore fisso solamente per Android. I default del wizard e delle nuove fasi usano lo stesso helper. Test nuovo con una vera istanza i18next non inizializzata, più casi locale raw; regressioni Android esistenti conservate.

Riproduzione completa prima della correzione: **24 web falliti / 664 passati**. Con i soli mock aggiornati rimanevano 15 fallimenti, confermando che non bastava ritoccare i test. Dopo la correzione del percorso condiviso, tutti i 61 test dei sei file coinvolti passano senza cambiare le loro aspettative.

Il codice applicativo web, backend, migrazioni, programmi ufficiali e algoritmi non è modificato. Le sole modifiche applicative di questa correzione sono in `packages/core/lib/content-language.ts` e `packages/core/hooks/useProgramEditor.ts`, per ripristinare il comportamento originario dei consumer non Android.

## Gitleaks: falsi positivi verificati, non esclusione della scansione

Tutte le 27 segnalazioni appartengono a `docs/ANDROID_ITALIAN_LOCALIZATION_INVENTORY.json`, commit audit `6a0961da7cb2564417ee1d2dd186d810eb13bbda`, regola `generic-api-key`. Ogni riga è una proprietà JSON `key` con un identificatore reale del catalogo EN: ad esempio `achievements.streak_12w.desc`, `landing.beyondCaption1`, `motivation.quote10`, `sleep.caffeineAfter14`. Non sono credenziali o valori API.

`.gitleaksignore` elenca **solo i 27 fingerprint storici esatti**, come previsto dal formato Gitleaks. Nessuna regola disattivata, nessun file/path escluso e nessuna riscrittura della storia. `audit-gitleaks-fingerprints.test.ts` verifica numero/unicità, SHA/percorso/regola precisi, che la riga contenga solo `key` e che il valore esista nel catalogo. Una nuova segnalazione su un nuovo commit resta bloccante. I dati dell'audit restano immutati.

## Verifiche locali della correzione

- `pnpm -r test`: tutti i workspace inclusi, **2.789 core + 181 mobile + 688 web**.
- `pnpm -r typecheck`: core/mobile/web.
- `pnpm -r lint`: web senza errori; mobile senza errori, 23 warning preesistenti.
- Contratto schema, seed programmi e contenuto ufficiale strict: passati; 13 avvisi di contenuto preesistenti, nessun errore.
- Test del validador di contenuto: 124 passati.
- Nessun accesso autenticato ai servizi originali. Gli E2E e le integrazioni PB del workflow sono su database effimeri di CI.

## Stato dei nuovi run e regola di chiusura

Questo documento accompagna la correzione **prima** del lancio dei nuovi run. Gli esiti definitivi, con SHA verificato, workflow, ogni job, errori e link ai run, vengono registrati nella descrizione della [PR #1](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/pull/1) e nel riepilogo consegnato dopo la conclusione di tutti i job. I risultati locali non sostituiscono la CI. Nessun avanzamento alla fase 4.

Blocco di configurazione noto: Dependency Graph va abilitato nel fork per eseguire Dependency Review. Il connettore GitHub disponibile non espone modifiche amministrative a questa impostazione; il job non viene rimosso né ignorato. Il workflow APK privato e il collaudo autenticato restano blocchi distinti già documentati nella fase 3B.

Da questa correzione, **ogni valutazione di fase deve includere obbligatoriamente il riepilogo CI**: workflow, job, stato/conclusione, causa degli errori, commit verificato, link run. Verificare tutti i run collegati alla PR/head, inclusi push rilevanti, non solo il wrapper che filtra `pull_request`. Un job fallito, in corso, non avviato ma richiesto o non leggibile impedisce la dichiarazione di completamento.
