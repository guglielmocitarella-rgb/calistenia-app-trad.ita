# Fase 3B — APK Android di collaudo

Data: 13 ottobre 2026. Base analizzata: `03f05b171c5d2ba25ec58bc049024fec68ef71dc`, ramo `feature/italian-localization`, PR #1 in bozza.

## Esito e piano applicato

1. Analizzati workflow release/CI, Expo, dipendenze, plugin locali, ambiente, push e Health Connect.
2. Aggiunto workflow debug separato, senza release/tag/store/server/migrazioni.
3. Verificata staticamente la configurazione; salvato questo report con istruzioni e checklist.

**APK non prodotto.** Il fork è pubblico (verificato con GitHub), incompatibile con il requisito di artifact privato. Non sono state lette né copiate credenziali originali. Non è stata verificata l'esistenza del nuovo secret autorizzato nel fork: gli strumenti disponibili non espongono la lettura dei nomi dei secret né il dispatch di un nuovo workflow. Il workflow rifiuta un repository pubblico prima di installare dipendenze. Il push del file può avviare automaticamente questo solo controllo, non la compilazione nel fork pubblico. Non ripetere questo run senza risolvere i prerequisiti.

| Verifica | Stato |
|---|---|
| Compilazione Gradle debug | Non eseguita in fase 3B; prerequisiti bloccanti |
| APK generato/disponibile | No; nessun link artifact |
| APK installato | Non verificato |
| App avviata sul dispositivo | Non verificato |
| Connessione autenticata ai servizi originali | Non verificata |
| Test precedenti fase 3 | 2.963 dichiarati nel report precedente; non rieseguiti qui |

## File e workflow

Aggiunti soltanto `.github/workflows/build-android-test-apk.yml` e questo report. Nessuna modifica delle funzionalità, package Android, configurazione Expo, dipendenze, lockfile o traduzioni.

Workflow: **Android TEST debug APK (no release)**. Manuale e push limitato al solo file workflow nel ramo di localizzazione. Permesso `contents: read`, checkout senza credenziali persistenti, Node 22, pnpm dalla versione `packageManager` (10.34.5), lockfile congelato, JDK 17, SDK Android, prebuild CNG e `:app:assembleDebug`. Due ABI telefono: arm64-v8a e armeabi-v7a; nessuna ABI emulatore x86. Core/mobile test, typecheck e lint precedono prebuild. Upload solo APK e checksum, conservazione 3 giorni. Nessun keystore release, token Sentry o comando di pubblicazione.

`build-mobile-apk.yml` usa `assembleRelease`, permessi contents write e un job che crea release/tag anche su dispatch: NON utilizzarlo. Rimane invariato. `ci-mobile.yml` invoca `ci.yml`, che include test con database effimero e migrazioni: non è richiamato dalla build di test; si eseguono solo i controlli core/mobile senza backend.

## Configurazioni e limiti

- **Artifact privato:** un artifact di un repository pubblico non è un download anonimo di release, ma non equivale a un file riservato al proprietario: utenti autenticati con accesso di lettura possono scaricarlo. Il workflow richiede repository privato. Non è stata cambiata la visibilità del fork; i fork pubblici non possono essere resi privati direttamente. Alternativa: nuovo repository privato autorizzato contenente questo ramo e solo collaboratori autorizzati. Nessuna release necessaria.
- **Firebase/FCM:** `app.json` richiede `./google-services.json`; il file è effettivamente tracciato. Non ne sono stampati i valori. La descrizione del workflow release e gli ignore non corrispondono al contenuto tracciato. Il nuovo workflow elimina quella copia e richiede `ANDROID_TEST_GOOGLE_SERVICES_JSON`, fornito dal proprietario di una configurazione utilizzabile legittimamente, con client Android `tech.guille.calistenia`. Il controllo verifica struttura minima e package, non autorizzazione o validità remota. Un file client Firebase non è una chiave amministrativa, ma non si presume autorizzato il suo riuso.
- Android usa `getDevicePushTokenAsync` per FCM e registra il token sul backend. Rimuovere Firebase/plugin per compilare impedirebbe un collaudo completo notifiche: nessun bypass implementato. Un progetto Firebase proprio può consentire compilazione e test locali, ma **non certifica push originali**: i server originali non possiedono le credenziali del nuovo progetto. Per push originali serve configurazione client autorizzata compatibile con il mittente originale; altrimenti segnare test bloccato, non superato.
- **Endpoint:** PB `https://gym.guille.tech` e IA `https://gym-server.guille.tech` provengono da `apps/mobile/eas.json` e dagli script esistenti. Sono endpoint pubblici, non credenziali inventate. La build non si autentica né modifica dati remoti. A runtime usare solo account autorizzato. OAuth bridge, scheme e app link rimangono quelli esistenti; l'associazione Android può dipendere dal certificato debug e va verificata separatamente.
- **Sentry/OpenPanel:** già disabilitati dall'app in `__DEV__`; nessuna modifica ai gate. Nessun secret di telemetria iniettato, nessun upload source map. `SENTRY_DISABLE_AUTO_UPLOAD` riguarda solo upload build. DSN e ID presenti nel codice non sono token amministrativi; non sono riprodotti qui. Il debug non collauda telemetria produzione.
- **Plugin nativi:** notifiche Expo, Notifee/servizio location, MapLibre, audio, font, widget Android e stringhe locali, Health Connect/delega permessi, build properties e signing restano abilitati. Min SDK 26, compile/target SDK 36, Expo 57/RN 0.86.2. Il plugin upload-signing modifica solo il signing release e non richiede keystore per debug. Apple targets non è una build iOS. La compatibilità completa della toolchain resta da dimostrare mediante Gradle.
- **Health Connect:** già implementato. Permessi per sonno, peso e grasso corporeo; non promettere passi o frequenza cardiaca. La sincronizzazione può scrivere `daily_health_cache` e dati sonno/peso: usare profilo Android separato con dati sintetici, mai importare salute personale in un account di test.
- **Debug e Metro:** assembleDebug standard richiede Metro per il JavaScript; l'APK non è un pacchetto autonomo offline. Non si modifica Gradle o il comportamento nativo per incorporare artificialmente un bundle. Il collaudo offline significa backend offline con Metro ancora raggiungibile. Avvio completamente offline senza computer non è certificabile con questa modalità. Un futuro APK autonomo richiede una scelta esplicita di variante di collaudo, preservando configurazioni native e accesso privato.

## Esecuzione realizzabile

Prima creare un repository privato autorizzato contenente il ramo (non duplicare segreti o aggiungerli nei commit). Aggiungere in **Settings → Secrets and variables → Actions → New repository secret** il secret `ANDROID_TEST_GOOGLE_SERVICES_JSON`, solo dopo avere una configurazione legittima. Se manca, fermarsi: non creare JSON fittizi e non rimuovere notifiche.

Il primo push del workflow sul ramo `feature/italian-localization` avvia la build nel repository privato. Per il pulsante manuale GitHub richiede che il workflow esista anche sul ramo predefinito: registrare lì lo stesso file dopo revisione, senza fondere la localizzazione o cambiare la PR #1. Poi **Actions → Android TEST debug APK (no release) → Run workflow → Branch: feature/italian-localization → Run workflow**. Se Actions è disabilitato, abilitarlo nel repository privato. Non selezionare **Build Mobile APK & Release**.

Aprire il run: un controllo privacy fallito non è una build fallita di Android. Solo dopo successo di Assemble debug e Upload, scaricare **Calistenia-TEST-debug-<run_id>** dalla sezione Artifacts entro 3 giorni; estrarre ZIP e confrontare SHA256. Annotare URL run/artifact, commit, dispositivo e risultato nel presente report. Non rendere pubblico il download.

Alternativa senza Actions: workstation autorizzata con rete, JDK 17, Android SDK, pnpm 10.34.5; configurazione Firebase legittima locale non committata; installazione frozen-lockfile, prebuild Android e assembleDebug con gli stessi comandi del workflow. Non richiede accesso amministrativo ai server originali. Senza configurazione FCM autorizzata rimane bloccato il collaudo completo; un progetto proprio limita il test dei push come descritto sopra.

## Installazione e avvio

Usare telefono/profilo Android di test (Android 8+; Health Connect secondo disponibilità del dispositivo), senza installazione originale o dati importanti. Stesso package della versione originale, firma debug differente: può apparire `INSTALL_FAILED_UPDATE_INCOMPATIBLE`. **Non disinstallare la versione personale per aggirarlo:** scegliere dispositivo/profilo separato. Il keystore debug non garantisce continuità tra run. Non cambiare package per eludere il conflitto.

Installazione: abilitare installazione da questa fonte solo sul dispositivo di test e aprire `Calistenia-TEST-debug.apk`, oppure:

```bash
adb install Calistenia-TEST-debug.apk
adb reverse tcp:8081 tcp:8081
```

Sul computer con lo stesso commit e dipendenze del lockfile, dalla root del repository:

```bash
EXPO_PUBLIC_PB_URL=https://gym.guille.tech EXPO_PUBLIC_AI_API_URL=https://gym-server.guille.tech pnpm --filter @calistenia/mobile exec expo start --localhost --port 8081
```

Aprire l'app installata sul telefono USB. Non usare Expo Go (i moduli nativi non sono equivalenti), non usare `--dev-client` perché non è dichiarato expo-dev-client. Senza override endpoint il codice debug può puntare al PB/IA del computer. Mantenere Metro raggiungibile durante il collaudo. Non caricare log completi contenenti dati personali, URL sensibili o token; annotare solo errori redatti.

## Checklist manuale non distruttiva

Per ogni voce registrare PASS/FAIL/BLOCCATO/NON ESEGUITO, versione Android, commit e prova redatta. Nessun PASS deriva dai test automatici. Non usare record condivisi né account personale; creare copie private con nomi TEST. Generazione IA può consumare quota: usarla solo con account e quota autorizzati.

- [ ] Avvio: installare, aprire, chiudere forzatamente, riaprire e riavviare telefono con Metro raggiungibile; nessun crash o perdita preferenze.
- [ ] Italiano automatico: profilo Android IT, installazione pulita senza preferenza salvata → UI impostata IT; registrare fallback EN/ES attesi perché la traduzione massiva non è iniziata.
- [ ] Cambio IT → EN → ES → IT: verificare schermate e riavvio; preferenza locale persiste. Non pretendere interfaccia già interamente tradotta.
- [ ] Login: account di test autorizzato, logout/login e ripristino sessione; OAuth/app link separatamente se autorizzati.
- [ ] Lingua server: annotare preferenza ES/EN iniziale; passare a IT e verificare che non venga scritto `it`. Cambi espliciti EN/ES seguono comportamento esistente. Verificare sia account con preferenza ES sia EN, senza console amministrativa o token nei log.
- [ ] Programmi: leggere elenco/dettagli/catalogo senza modificare originali; verificare fallback e contenuti coerenti.
- [ ] Editor: creare/duplicare copia privata TEST, riaprire, salvare senza modifiche; preservare mappe ES/EN e valori legacy. Modificare un solo campo, inserire esercizio e riaprire; cambiare UI durante editing e verificare lingua contenuto fissata. Controllare dati con strumenti autorizzati per il proprio account; se non disponibili segnare conservazione mappe non verificata.
- [ ] Sessioni/progressioni: eseguire minima sessione sulla copia TEST e verificare log, ripresa e progressione; non avanzare programmi personali o condivisi.
- [ ] IA allenamenti/alimentazione: una richiesta autorizzata ciascuna; contenuto compatibile ES/EN, nessun parametro server `it`; salvare solo copie TEST. Non approvare consumi non autorizzati.
- [ ] Notifiche: consenso concesso/negato, notifica locale e push originale separati; verificare lingua server e apertura app. FCM proprio non dimostra push originali.
- [ ] Otto widget: Today, Cardio, Nutrition, NutritionRing, Streak, MealStreak, Water, NextSession; aggiungere, ridimensionare, aggiornare, toccare, riavviare e cambiare lingua. Interazioni che scrivono acqua/alimenti solo sull'account TEST.
- [ ] Health Connect: profilo isolato, disponibilità SDK, permessi negati/concessi/revocati, soli dati sintetici sonno/peso/grasso; verificare import e assenza duplicati. Nessun dato sintetico disponibile → sincronizzazione non eseguita.
- [ ] Offline/sync: mantenere USB/Metro attivi, togliere Internet al telefono; leggere cache e riprendere app. Fare una sola modifica supportata su copia TEST, riconnettere e controllare assenza perdita/duplicati. Non assumere che tutte le funzioni funzionino offline.

## Blocchi prima della fase 4

Risolvere accesso realmente privato all'APK e disponibilità legittima della configurazione FCM. Verificare il trattamento del file Firebase già tracciato con il proprietario, senza riscrivere storia o rimuovere funzionalità in questa fase. Completare Gradle e download artifact, poi installazione/avvio, login/sync, editor reale, sessioni/IA/alimentazione, notifiche/widget e Health Connect su account/profilo isolato. Annotare crash e incompatibilità toolchain dal primo run utile; non ripetere run identici su prerequisiti mancanti. La fase 4 e la traduzione massiva restano non iniziate; PR #1 resta in bozza.
