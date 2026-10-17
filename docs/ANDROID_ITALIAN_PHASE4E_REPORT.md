# Android italiano — fase 4E ricostruita

17 ottobre 2026. Ramo `feature/italian-localization`, PR #1 aperta e in bozza. Nessuna fase successiva autorizzata da questa consegna.

## Recupero

La prima implementazione è stata interrotta. Il 16 ottobre erano stati osservati sorgenti, traduzioni, test e cinque documenti 4E locali, mentre GitHub era fermo alla 4D. La precedente sessione modificava ancora i file: questa sessione si era fermata senza intervenire.

Il 17 ottobre nessun processo 4E precedente è stato rilevato. La cartella `/workspace/scratch/5713eda52720/calistenia-app-trad.ita` non era più disponibile. Ultima ricerca mirata non distruttiva nelle cartelle accessibili: nessun archivio, snapshot, file nuovo o documento 4E recuperato. Le altre copie Git disponibili riguardavano fasi precedenti. Nessun reset, pulizia o sovrascrittura del lavoro precedente.

Ricostruzione esplicitamente autorizzata dall'utente dalla baseline remota `64ab728393de15856a185f7b6dcff0bb0c8af9a5`, confermata anche nella nuova copia pulita. Le modifiche qui consegnate sono **ricreate**, non recuperate. I risultati dei vecchi test non sono usati come prova di questa implementazione.

## Implementazione

Ricostruiti catalogo italiano social (soltanto chiavi con riferimenti Android diretti, indiretti o dinamici rilevati), adattatori di visualizzazione, integrazioni per amici/profili/commenti/feed/gare/classifiche, testi locali delle notifiche social e messaggi referral/risultati battaglia. Inventari JSON allegati elencano valori e file effettivi. Interventi limitati a UI Android e cataloghi; EN/ES preesistenti invariati. Aggiunte forme plurali in parità, con valori EN/ES uguali al precedente fallback.

Scoperto e preservato un confine di persistenza: `getPresetTitle` e `getPresetDescription` sono usati nella creazione delle sfide. I titoli/descrizioni nel catalogo condiviso restano identici alla baseline; l'italiano è applicato tramite chiavi stabili solo nei componenti Android. Titoli liberi e preset sconosciuti mantengono fallback originale.

Nessuna modifica a server, backend, API, web, IA, algoritmi, ranking, permessi social, sincronizzazione, record, enum o route. Codici e URL di invito invariati; nessuna condivisione o azione sociale reale effettuata dai test. I quattro workflow ordinari e il workflow APK esistenti sono riutilizzati; per quest'ultimo cambia solo il commento che innesca la build del test APK.

## Verifiche locali

Esito locale: **3.696 test passati** (core 2.790, mobile 218, web 688); 8 test mobile nuovi. Typecheck completo e lint passati, 0 errori e 23 warning mobile preesistenti. Scanner: 5.315 chiavi per lingua, 0 parse diagnostics, 0 chiavi statiche mancanti. Verificati placeholder/interpolazioni, parità dei cataloghi, formati numerici e fallback; nessun valore EN/ES preesistente modificato. `git diff --check` e commitlint positivi. Inventario: 409 valori italiani modificati/aggiunti, di cui 10 nuove chiavi per lingua; 10 titoli/descrizioni preset localizzati solo in overlay. Il warning jsdom HTMLCanvasElement getContext nel test web non produce fallimenti. Durante lo sviluppo: test-first degli adattatori (fallimento atteso e successivo verde), suite mobile completa; typecheck; lint; scanner AST in copia temporanea per non sovrascrivere inventari storici; controllo EN/ES e cataloghi protetti. Rimossi soltanto tre record JSX obsoleti perché quei testi ora sono localizzati. Nessun test disabilitato o indebolito.

Le esecuzioni core iniziali hanno rilevato il baseline JSX obsoleto; questo fallimento è stato corretto restringendo le eccezioni. L'installazione offline non disponeva dei metadata; quella online ha installato i pacchetti bloccati. Il wrapper pnpm 11 ha segnalato script build non approvati: usato il package manager del progetto tramite Corepack (pnpm 10.34.5), senza aggiornare dipendenze o conservare modifiche di configurazione generate dal wrapper.

## CI, APK e limiti

Quattro workflow **completed/success** sul commit applicativo `0dc5d926c245c4ed16d9092463bf88585d8796f4`: **11 job success e 2 deploy skipped**, controllati singolarmente. Nessun esito di commit precedenti viene usato per questa conclusione.

| Workflow | Run | Esito |
| --- | --- | --- |
| Security Checks | [39010123276](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123276) | success |
| CI (mobile) | [39010123272](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123272) | success |
| Build & Deploy App | [39010123565](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123565) | success |
| Build & Deploy AI API | [39010123296](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123296) | success |

| Workflow | Job | ID | Esito |
| --- | --- | --- | --- |
| Security Checks | Dependency review | [117330726034](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123276/job/117330726034) | success |
| Security Checks | Secret leak detection | [117330726188](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123276/job/117330726188) | success |
| CI (mobile) | CI (mobile) / E2E smoke (signup → primera sesión) | [117330726114](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123272/job/117330726114) | success |
| CI (mobile) | CI (mobile) / Typecheck, lint, test | [117330726255](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123272/job/117330726255) | success |
| Build & Deploy App | CI / E2E smoke (signup → primera sesión) | [117330727524](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123565/job/117330727524) | success |
| Build & Deploy App | CI / Typecheck, lint, test | [117330727686](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123565/job/117330727686) | success |
| Build & Deploy App | Build & push App | [117332380651](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123565/job/117332380651) | success |
| Build & Deploy App | Deploy App | [117332722549](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123565/job/117332722549) | skipped |
| Build & Deploy AI API | Typecheck & test AI API | [117330726197](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123296/job/117330726197) | success |
| Build & Deploy AI API | CI / E2E smoke (signup → primera sesión) | [117330726355](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123296/job/117330726355) | success |
| Build & Deploy AI API | CI / Typecheck, lint, test | [117330726364](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123296/job/117330726364) | success |
| Build & Deploy AI API | Build & push AI API | [117332378805](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123296/job/117332378805) | success |
| Build & Deploy AI API | Deploy AI API | [117332688147](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010123296/job/117332688147) | skipped |

Gli smoke preesistenti preparano soltanto database effimeri sui runner; nessuna migrazione o azione amministrativa eseguita sui server originali.

### APK standalone verificato

Workflow [39010121203](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010121203), **completed/success al tentativo 2**, commit applicativo `0dc5d926c245c4ed16d9092463bf88585d8796f4`.

- Build effettiva [117330783204](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010121203/job/117330783204): success; Gradle **BUILD SUCCESSFUL in 12m 12s**. Risultato build riutilizzato dal secondo tentativo (job 117335030651 success).
- Smoke definitivo [117335029528](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010121203/job/117335029528): success; nessun criterio o test modificato dopo il primo tentativo fallito.
- [Artifact APK 12092832933](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010121203/artifacts/12092832933); [prove di avvio riuscito 12093117584](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/39010121203/artifacts/12093117584). Non confondere quest'ultimo con il diagnostico del primo tentativo 12093390545.
- APK: **118.465.858 byte**, variante release con firma Android Debug, ABI arm64-v8a/x86_64, `assets/index.android.bundle` presente; Metro non richiesto. BUILD-INFO conferma lo SHA applicativo.
- SHA-256 APK ricalcolato sui byte scaricati e identico al checksum della build:

`876643ea70e168993c22661884f80984345b3de50ce5a2e1d34d25588ae1525b`

ZIP scaricato: 57.328.725 byte; SHA-256 identico al digest dell'artifact GitHub:

`841a2c87230b6b116bd277321fb78f92ca161f30d54f6243a4b59c2bf04c4939`

Emulatore API 35 Pixel 7, installazione **Success**, avvio **COLD / Status: ok**, TotalTime **4667 ms**, PID **3112**, marker React `CALISTENIA` presente nel dump e schermata login verificata visivamente. Rete remota disabilitata prima dell'avvio; nessun Metro; nessun crash iniziale rilevato nel controllo di processo e UI. Nessuna prova autenticata/social reale o di layout italiano sul telefono. Il test di avvio usa la lingua inglese dell'emulatore e non certifica la resa grafica 4E sul dispositivo dell'utente.

La chiusura documentale modifica soltanto `docs/`: il codice Android e i cataloghi del commit finale della PR restano identici a questo APK. La verifica dei quattro workflow sull'HEAD documentale finale è registrata nella descrizione della PR e nel report di consegna; non si trasferisce automaticamente il verde del commit applicativo a un HEAD diverso.


Collaudo autenticato e grafico sul telefono non eseguito. Checklist e residui nei documenti dedicati. PR aperta e in bozza; nessun merge, nuova PR, nuovo ramo, modifica a main, release, tag, migrazione o avvio 4F/7.

Controllo finale di raggiungibilità: conservate alla baseline 203 modifiche inizialmente candidate che non avevano riferimenti Android; eliminate due aggiunte plurali non necessarie per lingua. Il commit applicativo conclusivo comprende questa restrizione.

Ultima verifica visuale dei sorgenti: completati tre obiettivi di distanza gara e due date referral mediante i formattatori 4D già verificati. Parser, precisione, valori numerici e funzioni di salvataggio invariati. Suite complete rieseguite: core 2.790, mobile 218, web 688, tutte passate; typecheck e lint passati con 23 warning preesistenti. Commit applicativo conclusivo: `0dc5d926c245c4ed16d9092463bf88585d8796f4`. Gli esiti CI/APK dei commit intermedi non certificano questo SHA.

Primo smoke Android (job `117333555615`, tentativo 1): installazione `Success`, avvio COLD `Status: ok`, TotalTime 4759 ms; log React `Running "main"`, senza eccezioni AndroidRuntime/ReactNativeJS raccolte. Il controllo del marker React è fallito perché un dialogo di sistema «Pixel Launcher isn't responding» copriva l'app. Screenshot e XML mostrano la schermata login dietro quel dialogo. Rilanciato esclusivamente il job di smoke sul medesimo APK, senza modificare sorgenti, test o criteri di superamento. Artifact diagnostico: `12093390545`. Secondo tentativo concluso con successo, come documentato nella sezione APK.
