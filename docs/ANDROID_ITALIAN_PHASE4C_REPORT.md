# Calistenia Android — report fase 4C

Data: 14 ottobre 2026. Ramo `feature/italian-localization`; PR #1 aperta/in bozza.

**Implementazione preparata per revisione. Approvazione della fase e collaudo telefonico non eseguiti. CI/APK del nuovo commit: in attesa della build.**

## Baseline e perimetro

Baseline verificata ramo/PR: `21f3bc9eafd8e4dd0b3928baa382562c6d239fb2`. CI iniziale definitivamente verde: App `38467599559`, AI API `38467599477`, Mobile `38467599552`, Security `38467599360`; singoli job verificati, Gitleaks e Dependency Review success; deploy skipped. La baseline applicativa APK 4B resta `94bc6c93`; il collaudo 4B e le sue precisazioni sono quelli forniti dall'utente. Editor/salvataggio approfondito dei programmi rimangono residui del progetto, senza ampliarli in 4C.

Letti audit/inventari delle fasi 2/3 e report/glossario/residui 4A/4B. Inventari storici conservati; scanner finale usato come verifica, non come nuovo audit generale.

## Copertura

Revisionate **545 chiavi**; modificati **525 valori italiani**. 5.305 chiavi per lingua; nessuna aggiunta/eliminazione. Famiglie nutrizione, digiuno, dispensa, spesa, acqua, tipi di pasto, ricette salvate, hint foto e comandi badge. L'inventario registra le fonti e lo stato di raggiungibilità: la revisione dell'intera famiglia per coerenza terminologica non implica che tutte le chiavi siano visualizzate su Android. La versione web carica esclusivamente ES/EN; i cataloghi EN/ES sono identici byte per byte.

Tradotti dashboard/obiettivi, diario e modali, acquisizione/analisi IA, macro/porzioni, piani giorno/settimana, digiuno/cronologia/errori, dispensa/scontrini/spesa, ricette e ricette salvate, coach/criteri/badge, anteprime e messaggi nativi di condivisione. Quattro widget nutrizionali con dizionari italiani e fallback ES/EN originali; snapshot e consumer tecnici preservati. Inventario hardcoded separato con le sedi precise e le famiglie adattate.

Date, litri, quantità e prezzi visuali italiani; campi editabili e parsing originali. Le unità `unidad/ud/unidades` diventano «pz» soltanto nelle etichette. Gli enum di pasto diventano Colazione/Pranzo/Cena/Spuntino nel rendering; nomi/titoli remoti restano originali. Overlay dei 16 campi di 8 badge locali tramite identità stabile. Gli esempi dispensa mostrano IT ma inviano il comando identico alla baseline. Il messaggio nativo di condivisione è italiano, mentre helper, URL e dati della scheda restano originali.

## Compatibilità

Nessuna modifica a backend, PocketBase, migrazioni, servizi IA, web, algoritmi, dati persistiti, contratti, Open Food Facts, identità, hook core o protezioni fase 3. Nessun `it` introdotto nei payload backend. Nessuna chiamata autenticata ai servizi originali o migrazione eseguita.

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

Commit catalogo: `9f1e6108dbbdbf0169ff76cf6f157c881a694919`. Commit applicativo: `b36c96cd6b0725ae986e9aa197ca59e61692df84`. CI sul commit di build e APK standalone saranno registrati dopo la conclusione. Trigger esistente tramite aggiornamento del solo commento descrittivo nel workflow APK; nessuna modifica operativa all'infrastruttura, nessuna release/tag.

## Residui e limiti

Nomi alimenti/prodotti/catalogo/OFF, ricette, ingredienti, passi, note, descrizioni IA, consigli/coach, righe originali degli scontrini e dati utente restano quelli ricevuti o inseriti. Errori remoti liberi non riconosciuti possono restare ES/EN. Non vengono tradotti automaticamente, copiati nei dati o trattati come chiavi UI. I fallbacks ES/EN nei componenti rimangono intenzionalmente originali.

Nessun collaudo funzionale/visivo telefonico, nessuna verifica autenticata sui server originali. Rivedere troncamenti su piccoli schermi, decimal input/salvataggio, retry IA reali, timer/sospensione, sync/offline, condivisione e vecchi snapshot widget tramite checklist. Non iniziare 4D o merge prima dell'approvazione.

## Documenti

- `ANDROID_ITALIAN_PHASE4C_STRINGS.json`: chiavi, valori e fonti.
- `ANDROID_ITALIAN_PHASE4C_HARDCODED.json`: adattamenti visuali e sedi.
- `ANDROID_ITALIAN_PHASE4C_RESIDUAL.json`: residui remoti, tecnici e limiti.
- `ANDROID_ITALIAN_PHASE4C_CHECKLIST.md`: collaudo telefono.
- `ANDROID_ITALIAN_PHASE4A_GLOSSARY.md`: estensione terminologica 4C.
