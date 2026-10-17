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

CI e APK del nuovo commit: ancora da verificare al momento della preparazione di questo report. Nessun verde della baseline viene attribuito alla 4E. Commit, run, singoli job, artifact e checksum saranno registrati dopo la verifica.

Collaudo autenticato e grafico sul telefono non eseguito. Checklist e residui nei documenti dedicati. PR aperta e in bozza; nessun merge, nuova PR, nuovo ramo, modifica a main, release, tag, migrazione o avvio 4F/7.

Controllo finale di raggiungibilità: conservate alla baseline 203 modifiche inizialmente candidate che non avevano riferimenti Android; eliminate due aggiunte plurali non necessarie per lingua. Il commit applicativo conclusivo comprende questa restrizione.
