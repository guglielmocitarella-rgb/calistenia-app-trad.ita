# Fase 3B — APK Android di collaudo, requisiti rivalutati

13 ottobre 2026. PR #1 in bozza, fase 4 non iniziata.

## Verifica preliminare CI

Commit `591962b510726294404ea3f8ea21df9505473aee`: tutti i run conclusi e verdi, verificati nuovamente prima di intervenire sulla build.

| Workflow | Run | Job |
| --- | --- | --- |
| Build & Deploy App | [38419853426](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38419853426) | CI, E2E, Docker passati; deploy escluso sulle PR |
| Build & Deploy AI API | [38419853999](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38419853999) | CI, E2E, test API e Docker passati; deploy escluso sulle PR |
| CI (mobile) | [38419853576](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38419853576) | CI ed E2E passati |
| Security Checks | [38419853679](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/actions/runs/38419853679) | Gitleaks passato; Dependency Review passato al tentativo 2 |

## Rettifica dei prerequisiti precedenti

Il precedente workflow imponeva repository privato e un nuovo secret Firebase. Questi vincoli non sono necessari per la **compilazione** di un client di test senza segreti effettivi. Il requisito di artifact privato è stato esplicitamente rivalutato su richiesta dell'utente: si resta sul fork pubblico, senza creare repository o release.

| Distinzione | Soluzione e limite |
| --- | --- |
| Configurazione Firebase client | `google-services.json` già tracciato: identificatori client pubblici, package verificato. Validazione ricorsiva rifiuta private key, service account, client secret e token privilegiati; valori non stampati. Nessuna copia di credenziali amministrative |
| Segreti effettivi | Nessun token server/admin, keystore produzione, token Sentry o secret Actions fornito alla build. La firma usa il fallback debug già implementato dal progetto |
| Compilazione / uso dei servizi | Generare risorse client non autentica ai servizi e non modifica i server. Il file pubblico non autorizza operazioni privilegiate né certifica validità/restrizioni API, FCM, OAuth o ACL distribuiti |
| Artifact / release pubblica | Solo artifact temporaneo Actions, retention 3 giorni. Su repository pubblico è scaricabile da utenti GitHub con accesso in lettura: non è owner-private. Nessun tag, GitHub Release, store, upload AAB o deploy |
| Debug con Metro | `assembleDebug` originale lascia il JS fuori dall'APK; richiede computer/Metro. Non viene presentato come autonomo |
| APK autonomo di test | `assembleRelease` originale incorpora JS/assets; il plugin esistente sceglie firma debug quando mancano le proprietà della chiave upload. Variante release non equivale a pubblicare una release. Nessuna patch a codice, Expo, plugin, Gradle generato o funzionalità |

Fonti primarie:

- [Firebase: il config Android contiene identificatori non segreti](https://firebase.google.com/docs/android/google-services-plugin-and-file).
- [Firebase: configurazioni client pubbliche e controllo accessi separato](https://firebase.google.com/docs/projects/learn-more).
- [Firebase: API key e autorizzazione](https://firebase.google.com/docs/projects/api-keys).
- [React Native: varianti debuggable senza bundle, varianti non debuggable con bundle](https://reactnative.dev/docs/react-native-gradle-plugin).
- [GitHub: chi può scaricare artifact](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts).

## Interventi limitati all'infrastruttura

Modificati soltanto `.github/workflows/build-android-test-apk.yml`, questo report e `scripts/smoke-android-test-apk.sh`. Il workflow release originale resta invariato. Nessuna traduzione, modifica applicativa, eliminazione di funzionalità, migrazione o modifica ai servizi originali.

Workflow **Android TEST APK (standalone, no publication)**:

1. Push del solo workflow/script sul ramo di localizzazione, oppure dispatch quando disponibile; `contents: read`, checkout senza credenziali persistenti.
2. Validazione della configurazione client già nel repository; nessun nuovo secret necessario.
3. Node 22, pnpm da packageManager, lockfile congelato, JDK 17, SDK Android; core/mobile test, typecheck e lint.
4. Prebuild Android originale, `:app:assembleRelease`, ABI arm64-v8a (telefono) e x86_64 (emulatore). Non è un pacchetto per telefoni ARM32.
5. Verifica di `assets/index.android.bundle` e firma `CN=Android Debug` con apksigner; copia APK, checksum SHA256, certificato pubblico e BUILD-INFO. Nessun keystore o file di configurazione separato nell'artifact.
6. Upload artifact **prima** dello smoke: un eventuale fallimento di avvio non fa scomparire un APK realmente compilato.
7. Job smoke separato: download, verifica checksum, emulatore effimero Android API 35/x86_64. Wi-Fi e dati disattivati prima dell'avvio, nessun account e nessun Metro. Installa e avvia, richiede che la vera schermata React login mostri `CALISTENIA`, salva screenshot/UI dump e stato distinto. La presenza del processo da sola non prova l'avvio della UI.
8. Tutti i nuovi run PR e il run build devono essere seguiti fino alla conclusione, inclusi i job dipendenti. Esiti finali e SHA corrente sono registrati nella PR #1 e nel riepilogo consegnato, senza committare risultati previsti come se fossero osservati.

KVM/emulatore segue le indicazioni [GitHub](https://github.blog/changelog/2024-04-02-github-actions-hardware-accelerated-android-virtualization-now-available/) e [android-emulator-runner](https://github.com/ReactiveCircus/android-emulator-runner).

## Stato al commit infrastrutturale

| Attività | Stato |
| --- | --- |
| Sintassi YAML e shell | Verificata localmente |
| APK compilato con workflow rivalutato | In attesa del run; non dichiarato prodotto |
| Artifact / checksum | Da fornire solo dopo upload riuscito e verifica del file |
| Installazione | Da verificare nel job smoke |
| Avvio senza Metro | Da verificare tramite UI React renderizzata |
| Collaudo funzionale/autenticato | Non eseguito, distinto dal solo smoke anonimo |
| CI nuova head | Da verificare fino alla conclusione, non sostituita dal verde della base |

Gli esiti definitivi accompagnano il [riepilogo della PR #1](https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/pull/1), con link run/artifact e SHA effettivamente verificato. Un job fallito o non verificato impedisce di dichiarare la fase completata.

## Installazione manuale e collaudo autorizzato

L'APK ha lo stesso package e versionCode dell'app originale, ma firma debug diversa. Non può necessariamente aggiornare l'installazione originale; usare telefono, emulatore o profilo Android separato, senza cancellare dati personali per superare un conflitto di firma.

Scaricare artifact TEST, estrarre ed eseguire `sha256sum -c SHA256SUMS.txt`. Installare con `adb install Calistenia-TEST-standalone.apk` oppure tramite il gestore file. Questo APK non richiede Metro. Un APK standard `debug`, invece, va usato con Metro sullo stesso commit e `adb reverse tcp:8081 tcp:8081`.

Il superamento dello smoke significa esclusivamente installazione e rendering iniziale della UI anonima, con rete disabilitata. Non prova login, API, sync, push, IA, nutrizione, widget o Health Connect. Non prova compatibilità OAuth/app link con il certificato debug. I contenuti restano ES/EN e le stringhe IT ancora scaffold: la traduzione non è iniziata.

Con account di test autorizzato e dati isolati, registrare separatamente PASS/FAIL/BLOCCATO/NON ESEGUITO per:

- IT automatico, IT→EN→ES→IT, restart e preferenza server ES/EN preservata.
- Login/refresh/logout, lettura programmi, copia privata TEST, editor load/save senza edit e mappe es-only/en-only/bilingui/legacy.
- Sessione minima e ripristino, valori tecnici/log/progressioni invariati, sync offline/online senza duplicati.
- IA e alimentazione solo con quota/account autorizzati; payload originali, nessun nuovo parametro IT.
- Notifica locale, push originale, widget tutti e otto; FCM e OAuth possono dipendere da restrizioni client/firma: non dichiararli funzionanti dalla sola compilazione.
- Health Connect su profilo isolato e soli dati sintetici; sonno/peso/grasso, permessi concessi/negati/revocati, nessuna importazione di dati personali nei test.

Nessuna credenziale amministrativa o modifica ai server richiesta. Se il servizio non consente una funzione al client firmato debug, documentare il blocco senza aggirare ACL o rimuovere la funzione. La PR rimane in bozza; la fase 4 non viene avviata.
