# Calistenia Android — revisione correttiva fase 4C dopo collaudo

Data: 15 ottobre 2026. PR #1 (`feature/italian-localization`), aperta e mantenuta in bozza.

## Esito

Il collaudo dell'APK `45d0e461` riporta 30 controlli superati, 10 problematici e 6 non eseguiti. La revisione non conferma regressioni client nei flussi IA, nei trasporti della dispensa o nel digiuno. I due messaggi mostrati nel video provengono dai servizi remoti: risposta HTTP `502` durante l'analisi del pasto e risposta del provider IA che dichiara l'esaurimento dei crediti. È stata corretta soltanto la loro presentazione nell'interfaccia Android italiana.

Head PR all'avvio: `a0af040ef70fb57fd11cf2e6f6c0756d69afdff2`. Baseline applicativa 4B: `f531b3b822ca5f88c19f2b85df6cf42426e352ea`. Nessuna modifica a backend/server, web, provider, chiavi/configurazioni, endpoint, retry, algoritmi, contratti o persistenza. Nessuna migrazione o release.

## Classificazione del collaudo

| # | Area/controllo marcato problematico | Classificazione | Evidenza e conclusione |
| --- | --- | --- | --- |
| 1 | Aggiunta manuale di un pasto | Test non conclusivo (problema non riprodotto) | Il verbale iniziale la segnava problematica, ma l'utente conferma che l'aggiunta manuale funziona. Non è una regressione confermata. |
| 2 | Risultato dell'analisi IA del pasto | Problema di servizio esterno | Il servizio restituisce «Analyze meal failed: 502». Non è un errore generato dal rendering italiano né una modifica 4C al trasporto. |
| 3 | Registrazione del pasto analizzato | Test non conclusivo | L'analisi fallisce prima di produrre il risultato da registrare; la registrazione derivata dall'IA quindi non è stata verificata. La registrazione manuale funziona. |
| 4 | Piano alimentare settimanale | Test non conclusivo | Non è disponibile un errore specifico o una riproduzione isolata per il flusso settimanale. Gli endpoint e i payload sono invariati rispetto a 4B. |
| 5 | Generazione del piano giornaliero | Problema di servizio esterno | Il servizio IA risponde «You have no credits remaining». Il client non inventa né sostituisce risultati. |
| 6 | Dettaglio ricetta | Test non conclusivo | Il verbale non identifica una stringa UI né un errore riproducibile. Nomi, ingredienti, passaggi e descrizioni remoti restano originali per vincolo. |
| 7 | Ricette salvate | Test non conclusivo | Non è indicato un errore riproducibile o un testo UI specifico; nessun cambiamento 4C ai dati o alle query di salvataggio. |
| 8 | Digiuno: sospensione/riavvio | Test non conclusivo | Il video non documenta una regressione certa del timer. Hook, serializzazione, timestamp e stato persistito del digiuno non sono stati modificati in 4C. |
| 9 | Aggiunta alimento alla dispensa tramite comando | Test non conclusivo | È stata riferita difficoltà di interpretazione, ma non è documentata una risposta deterministica o un payload errato del client. I comandi di esempio mantengono il testo originale. |
| 10 | Scansione scontrino/IA della dispensa | Test non conclusivo | Nel materiale descritto non compare un errore specifico di questo percorso. L'adattatore ora localizza eventuali errori grezzi del servizio sul solo Android italiano; non altera la richiesta. |

### Sei controlli non eseguiti

| Controllo | Classificazione |
| --- | --- |
| Quantità e porzioni | Non eseguito |
| Lista della spesa | Non eseguito |
| Conferma acquisto e aggiornamento inventario | Non eseguito |
| Qualità nutrizionale | Non eseguito |
| Condivisione | Non eseguito |
| Widget nutrizionali | Non eseguito |

Non sono conteggiati come difetti né come superati. Gli altri 30 controlli restano superati secondo il verbale dell'utente; questa revisione non ripete un collaudo autenticato sul telefono.

## Confronto tecnico 4B → 4C

| Percorso | Richiesta osservata nel sorgente invariato | Risultato del confronto |
| --- | --- | --- |
| Analisi testuale/fotografica | `POST ${AI_API_URL}/api/jobs/analyze-meal`; `FormData` con immagini e `meal_type`, descrizione e contesto utente opzionali | Wrapper, metodo, endpoint, campi `FormData`, enum e parsing non modificati rispetto a `f531b3b`. L'adattatore di errore agisce solo sul testo renderizzato. |
| Piano giornaliero | `POST /api/jobs/generate-meal-plan`; JSON con calorie e macro residue e `logged_meal_types` | Hook e wrapper core invariati; il messaggio `job.error` ricevuto viene solo adattato in visualizzazione. |
| Piano settimanale | `POST /api/jobs/generate-weekly-meal-plan`; JSON con obiettivi, calorie e macro e inizio settimana | Nessuna modifica al trasporto o alla forma del payload. |
| Comando dispensa | `POST /api/pantry/parse`; `{ text, existing_items }` | `text` e nomi esistenti sono inoltrati senza traduzione; la difficoltà d'interpretazione non prova un errore di payload del client. |
| Piano dispensa | `POST /api/generate-pantry-plan`; `horizon`, data, articoli e obiettivi | Endpoint e contenuto invariati. |
| Scontrino | parser mobile esistente | Endpoint, file e comportamento di parsing invariati; solo il messaggio d'errore visualizzato viene adattato. |

Il confronto Git conferma che `packages/core/lib/ai-jobs-api.ts`, `packages/core/lib/pantry-api.ts`, gli hook core interessati, l'adattatore URI/Blob e i writer della dispensa non sono cambiati tra baseline 4B e head 4C. Il test `nutrition-payload-language.test.ts` esercita i trasporti reali e confronta URL e JSON/FormData in IT/EN/ES; `nutrition-ui-labels.test.ts` verifica inoltre che gli esempi della dispensa restino byte-identici all'originale. Nessun valore `it` viene aggiunto ai payload.

### Servizio esterno e client

- `Analyze meal failed: 502` è una risposta di errore del servizio raggiunto dal client. L'evidenza non consente di identificare quale componente server/upstream abbia originato il 502; non dimostra una regressione introdotta dalla localizzazione.
- `You have no credits remaining` è una motivazione restituita dal servizio/provider IA. Non è un errore di parsing o un valore costruito dalla UI. Per identificare account o provider servirebbero log server/provider, fuori dal perimetro autorizzato.
- La correzione traduce questi messaggi solo nella resa UI di Android in italiano. Il codice HTTP resta visibile; il testo tecnico originale rimane non modificato nello stato dell'errore e, nei percorsi già strumentati, nei dati inviati a Sentry. EN, ES, iOS e i dati originali non vengono adattati.
- Non sono stati aggiunti retry, fallback generativi, risposte nutrizionali inventate, provider alternativi, crediti o richieste di credenziali.

## Digiuno e dati persistiti

I file `packages/core/hooks/useFasting.ts`, `packages/core/lib/fasting.ts`, `apps/mobile/src/components/nutrition/FastingPanel.tsx` e `apps/mobile/src/lib/fasting-clock.ts` non presentano differenze 4C rispetto alla baseline 4B. In `nutrition.tsx` la localizzazione riguarda soltanto la stringa di data resa a schermo; non cambia il valore data né lo stato salvato. Le suite core/mobile comprendono i test del timer, dei timestamp e della serializzazione, tutti superati.

## Correzione visuale

Introdotto `nutritionServiceError`, usato soltanto quando viene visualizzato un errore d'analisi pasto, di piano giornaliero o di scansione scontrino. I messaggi del video diventano:

- `Il servizio di intelligenza artificiale ha restituito l'errore 502. Riprova più tardi.`
- `Il servizio di intelligenza artificiale non è disponibile perché i crediti sono esauriti.`

Gli errori non riconosciuti usano il fallback italiano già previsto dal relativo flusso. L'eccezione grezza e i dati funzionali rimangono intatti. Quattro test dedicati coprono 502, crediti esauriti, fallback e preservazione EN/ES/iOS.

## Verifiche locali

| Controllo | Esito |
| --- | --- |
| Core | 2.789 test passati |
| Mobile | 202 test passati |
| Web | 688 test passati |
| Totale | 3.679 test passati |
| Typecheck core/mobile/web | Tutti superati |
| Lint mobile | 0 errori; 23 warning preesistenti |
| Scanner traduzioni `scripts/check-translations.mjs` | 5.305 chiavi EN/ES in parità; il catalogo italiano non è stato modificato |
| Test mirato nuovo | 4/4 passati; il test rosso iniziale falliva per il modulo non ancora esistente |
| `git diff --check` | Superato |

## CI e APK correttivo

Head PR iniziale `a0af040e`; commit applicativo di revisione e origine dell'APK: da compilazione finale. Riepilogo di run e job GitHub Actions, artifact e checksum SHA-256 verrà completato qui dopo la conclusione dei workflow. Il workflow usato resta `.github/workflows/build-android-test-apk.yml` (artifact temporaneo, senza release).

## Vincoli di arresto

PR #1 resta in bozza. Nessuna fase 4D, migrazione, release o modifica ai server originali avviata. Le anomalie classificate come non conclusive/non eseguite richiedono un successivo test riproducibile; non sono state convertite in modifiche funzionali.
