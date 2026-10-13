# Android italiano — compatibilità, fase 3

Data: 13 ottobre 2026. Base audit: `6a0961da7cb2564417ee1d2dd186d810eb13bbda`.
Ramo: `feature/italian-localization`. PR #1: mantenere in bozza.

## Valutazione

| Verifica | Esito |
| --- | --- |
| Compatibilità statica verificata | **Sì**, nei contratti e percorsi del repository esaminati; nessuna certificazione del server distribuito |
| Test automatici superati | **Parziale rispetto al collaudo richiesto**: tutte le suite passano; test puri e trasporti intercettati, senza montaggio dei flussi React/native |
| APK compilato | **No**: prebuild e bundle Android riusciti, Gradle bloccato dalla rete |
| Test autenticati eseguiti | **No** |
| Fase 4 autorizzabile | **No**, finché APK e collaudo dei percorsi autenticati non forniscono le prove residue |

Nessuna traduzione massiva. Nessuna modifica di `main`, `apps/web`, backend, migrazioni, cataloghi i18next o dati bundled. Nessuna chiave eliminata. Nessun account di produzione utilizzato e nessuna migrazione eseguita. I nuovi test intercettano fetch e PocketBase: non creano dati remoti.

## Contesti linguistici e politiche implementate

`CorePlatform.languages` è un adattatore opzionale, installato **soltanto quando Platform.OS è android**. Senza adattatore i consumer condivisi conservano il percorso originale. Non viene modificato temporaneamente `i18next.language`, né sostituito globalmente `localize()`.

| Contesto | Politica |
| --- | --- |
| UI | `es / en / it`; stessa chiave privata `i18nextLng`, cataloghi attuali e fallback EN |
| Contenuti/editing | Preferenza privata ES/EN per account (`androidContentLanguage:<id>`); namespace guest distinto. ES/EN espliciti seguono la scelta; IT mantiene la preferenza compatibile precedente, oppure il valore compatibile del record utente; in assenza di entrambi EN |
| Preferenza server | Con UI IT conserva `users.language` ES/EN valido; solo se assente usa la preferenza compatibile locale o EN. Scelte esplicite ES/EN continuano a sincronizzarsi. Nessun IT inviato |
| Wger | ES/EN, default specifico ES; ricerca, chiave cache, mapping e `wger_language` coerenti. Nessuna abilitazione del supporto italiano del provider |
| Open Food Facts | Nessuna modifica: default `lc=es`, barcode senza nuovo parametro, mapping originale |
| API senza lingua | Nessun campo nuovo e nessun cambio di testo/prompt o enum contrattuale |
| Widget | Contratto locale ES/EN/IT; IT usa temporaneamente i dizionari EN. Snapshot ES/EN invariati; lo snapshot iOS conserva il precedente contratto; lingua assente o ignota mantiene fallback ES storico |

La preferenza locale non passa da un account all'altro. Il server non viene usato come archivio della lingua UI. Non è introdotta alcuna impostazione visibile aggiuntiva. Non viene dedotta una nuova lingua dalla singola mappa di un record.

## Rischi risolti e motivazioni

1. **IT convertito automaticamente in EN nei push**: `syncUserLanguage` delega alla politica Android, che conserva ES/EN valido. La funzione originale di normalizzazione resta invariata per gli altri consumer.
2. **Nuove chiavi IT nei salvataggi**: editor e duplicazione usano la lingua contenuti. `toTranslatable` e `duplicatedName` rifiutano locale incompatibile quando è presente la politica Android; non trasformano silenziosamente un testo UI italiano in un testo EN.
3. **Default UI copiati nei dati**: nomi di fasi, giorni e focus destinati alla persistenza usano `getFixedT(contentLocale)`. Errori, pulsanti ed etichette continuano a usare il traduttore UI.
4. **Cambio UI durante editing**: l'editor fissa la lingua alla creazione, al reset e al caricamento; lettura, default successivi, inserimento dal catalogo, diff e scrittura condividono quella lingua.
5. **Picker → editor**: il picker mantiene la localizzazione UI per ricerca e presentazione, ma copia nome/muscoli/note con un mapper e il locale fissato dall'editor. Fixture con reali valori IT impediscono che l'overlay visuale sia salvato sotto ES/EN.
6. **Perdita delle mappe della riga principale**: prima `programs.update` sostituiva direttamente nome/descrizione/istruzioni. Android calcola ora la patch mediante lo stesso diff/merge, conservando le altre lingue. Gli altri consumer conservano il percorso precedente.
7. **Falso diff sulle mappe monolingua**: opzione Android `localizedReadFallback` confronta il valore con lo stesso fallback di `localize` impiegato nel load. ES-only letto in EN e EN-only letto in ES non diventano modifiche. L'opzione è disattivata per il percorso originale.
8. **Salvataggio senza modifiche**: per programma esistente non dirty Android ritorna prima di qualsiasi richiesta; non normalizza nomi, record legacy, valori tecnici o traduzioni. Anche con un edit che restituisce il medesimo testo, il diff evita la patch della traduzione.
9. **Nomi legacy trasformati durante l'editing**: Android mantiene il testo originale nei campi editabili, senza copiare il nome visuale risolto dal catalogo nel record remoto. Una stringa legacy invariata resta stringa; una modifica reale segue il serializer/merge preesistente.
10. **Sessioni e dati copiabili**: `usePrograms`, primo workout, preview/manual picker/circuit builder, ripristino sessioni e nomi delle progressioni usano il locale contenuti nei percorsi che producono oggetti riutilizzati/salvabili. Non sono cambiati ID, algoritmi, target, serie, reps, tempi, progressioni o strutture.
11. **Battles**: la creazione usa la lingua contenuti per congelare i nomi non risolvibili dal catalogo; IT non deve far classificare un nome EN come ES. Il serializer bilingue originale è invariato.
12. **Selettori**: profilo e onboarding su Android riconoscono Italiano, English ed Español tramite il resolver esistente. La preferenza UI resta privata e persistita.
13. **Widget**: tutti gli otto reader utilizzano un selettore sicuro; i tre writer e i tre tipi snapshot ammettono IT insieme. Nessun accesso a `STRINGS[it]` undefined. Il plugin genera anche `values-it` con 16 label/descrizioni minime del picker nativo.

## File e funzioni

| File / gruppo | Intervento |
| --- | --- |
| `packages/core/platform.ts` | `CorePlatform.languages`, `getLanguagePolicy`: iniezione opzionale, assenza compatibile |
| `packages/core/lib/android-language.ts` | Resolver separati contenuti/server/Wger, tipi ES/EN |
| `packages/core/lib/content-language.ts` | `contentLanguage`, `contentT`: accesso al contesto contenuti senza modificare il singleton UI |
| `apps/mobile/src/lib/language-context.ts` | `createLanguageContext`: storage locale per account, fallback e guest separati |
| `apps/mobile/src/lib/init-core.ts`, `i18n.ts` | Installazione Android dopo il normale bootstrap; conservazione preferenza storica e aggiornamento locale ai cambi UI |
| `packages/core/lib/language-sync.ts` | `syncUserLanguage`: preferenza server distinta |
| `packages/core/lib/i18n-db.ts` | Guardie dei serializer Android; `localize` invariato |
| `packages/core/lib/programEditorDiff.ts` | `DiffOptions.localizedReadFallback`, confronto coerente con load; merge originale preservato |
| `packages/core/hooks/useProgramEditor.ts` | `defaultPhases`, `dayDefaults`, load/save/reset, default di nuove fasi, locale fissato, patch della riga principale e no-op |
| `apps/mobile/src/app/program-editor.tsx`, `components/program-editor/ExercisePickerSheet.tsx`, `lib/editor-exercise.ts` | Trasmissione del locale fissato e `catalogToEditorExercise`; separazione presentazione/copia |
| `packages/core/hooks/usePrograms.ts` | Build phases/weekdays/workouts, catalog/enrollment e `duplicateProgram` con locale contenuti |
| `packages/core/hooks/useAutoProgression.ts`, `hooks/session-contexts/normalizeRestoredWorkout.ts` | Locale dei nomi copiabili, nessuna modifica agli algoritmi |
| `apps/mobile/src/lib/start-first-workout.ts`, `components/home/TodayBlock.tsx` | Primo allenamento con locale contenuti |
| `apps/mobile/src/app/free-session.tsx`, `components/free-session/AISessionPreview.tsx`, `components/circuit/CircuitBuilder.tsx` | Nomi da catalogo/default nei dati della sessione separati dalla UI |
| `apps/mobile/src/app/battle-create.tsx` | Locale del serializer `exercise_names` |
| `packages/core/hooks/useWgerSearch.ts`, `lib/wger.ts`, `lib/wger-mappings.ts` | Normalizzazione specifica Wger prima di ricerca/import/mapping |
| `apps/mobile/src/app/profile.tsx`, `components/onboarding/OnboardingFlow.tsx` | Selettori IT/EN/ES |
| `apps/mobile/src/lib/widget-language.ts` | `WidgetLanguage`, `widgetLanguage`, `widgetStrings` |
| `apps/mobile/src/lib/{widget,nutrition-widget,cardio-widget}-snapshot.ts` | Tipi locali IT |
| `apps/mobile/src/lib/sync-{widget-snapshot,nutrition-widget,cardio-widget}.ts` | Writer locali IT |
| `apps/mobile/src/widgets/{Today,Cardio,Nutrition,NutritionRing,Streak,MealStreak,Water,NextSession}Widget.tsx` | Tutti i reader con fallback sicuro; strutture e dati numerici invariati |
| `apps/mobile/plugins/with-widget-strings.js` | Generazione atomica EN/ES/IT nel prebuild; nessun sorgente Android generato committato |

## Prove dei contratti invariati

Il confronto byte per byte con il commit audit conferma che questi file non sono cambiati:

- Auth: `packages/core/hooks/useAuth.ts`.
- Chat/generazione workout: `apps/mobile/src/lib/use-free-session-chat.ts`, `components/free-session/AISessionForm.tsx` (messages/userContext e prompt iniziale originali).
- Piani/analisi/jobs: `packages/core/lib/plan-api.ts`, `ai-jobs-api.ts`, `hooks/useNutrition.ts`.
- Alimenti/OFF: `packages/core/hooks/useFoodCatalog.ts`, `lib/openfoodfacts.ts`.
- Registrazione push: `packages/core/lib/push-token.ts`.

`git diff --quiet <audit> -- apps/web pb_hooks pb_migrations mcp-server packages/core/locales` e `git diff --check` hanno esito positivo. Gli artefatti di fase 2 sono mantenuti integralmente e non rigenerati: restano riferiti alla revisione dichiarata nell'audit.

I test nuovi intercettano le richieste reali dei wrapper per UI ES/EN/IT e confrontano corpi JSON e FormData con fixture esatte: piani giorno/settimana, rigenerazione giorno, analisi alimenti. Verificano endpoint invariati e OFF default ES. Wger verifica parametro richiesto e metadati dell'import coerenti; conserva il mapping originale anche quando EN produce un nome solo sotto ES (comportamento già presente, non corretto in questa fase).

Non sono aggiunti parametri lingua a chat IA, piani, analisi, auth o sync. Non sono modificati enum, campi JSON, route, chiavi cache remote, identificatori o formati tecnici. La nuova chiave di preferenza e `lang=it` dei widget sono esclusivamente locali.

## Test e verifiche

| Controllo | Risultato |
| --- | --- |
| Baseline core | 193 file, 2.741 test passati |
| Baseline mobile | 17 file, 168 test passati |
| Suite core finale | 199 file, 2.782 test passati |
| Suite mobile finale | 20 file, 181 test passati |
| Typecheck core e mobile | Passati |
| Lint mobile | 0 errori; 23 warning già presenti nella baseline |
| Prebuild Android | Passato (`expo prebuild --platform android --no-install`) |
| Risorse picker generate | XML EN/ES/IT valido, 16 label/descrizioni per lingua, tutti gli otto widget |
| Bundle Android | Passato: Expo/Metro/Hermes, 5.184 moduli, senza autenticazione |
| APK `assembleDebug` | Fallito prima della compilazione, download Gradle 9.3.1: `java.net.SocketException: Network is unreachable` |
| Device/emulatore, hook React montati, servizi autenticati | Non eseguiti |

Comandi principali: `pnpm --filter @calistenia/core test`, `pnpm --filter @calistenia/mobile test`, typecheck di entrambi, `pnpm --filter @calistenia/mobile lint`. Dipendenze installate con lockfile congelato e senza lifecycle script. Prebuild/bundle eseguiti con URL loopback per PB/IA e telemetria Expo disabilitata. La build fallisce al wrapper Gradle: non è stata raggiunta la verifica completa della toolchain Android.

Fixture aggiunte: resolver Android, sync server con PocketBase mock, preferenze per account/riavvio, default editor con traduzioni UI IT diverse, mappe ES-only/EN-only/ES+EN/legacy, no-op e merge/duplica, rifiuto IT nei serializer, nomi battles senza indice, mapper picker con overlay IT e campi tecnici esatti, API senza lingua, Wger e roundtrip/rollover snapshot locali ES/EN/IT; resolver UI con dispositivo italiano e sequenza IT→EN→ES→IT.

Durante lo sviluppo i test hanno prima riprodotto il falso diff monolingua e il serializer IT. Sono stati corretti errori nelle fixture (assunzione che Wger EN producesse sempre due chiavi, tipo CatalogExercise incompleto) e nel conteggio delle risorse native, che includeva anche alias `*_description`. Non restano fallimenti nelle suite finali; il fallimento Gradle rimane aperto.

La revisione indipendente ha individuato due copie visuali verso dati persistenti, picker editor e nomi custom battles; entrambe corrette con fixture. **I test di roundtrip/diff sono test delle funzioni pure, non un'esecuzione completa dei callback React di load/save/duplica con UI montata.** Non si dichiara testata l'integrazione hook/PocketBase/dispositivo. Chat/streaming, login/OAuth, sync offline e notifiche remote sono verificati staticamente; non collaudati contro il servizio distribuito.

## Rischi aperti e blocchi prima della fase 4

- APK non costruito né installato: resta da verificare bootstrap/hydration, eventi lingua, restart, rendering headless, picker, permessi e dipendenze native.
- Schema/ACL/revisione distribuita, servizi IA e provider originali non interrogati autenticati. Test automatici offline non dimostrano la compatibilità end-to-end.
- Le fixture pure coprono la semantica delle mappe, ma il salvataggio completo del wizard, l'upload media, cache invalidation e le code offline richiedono il collaudo APK.
- IT nei widget usa EN e il loro rendering effettivo non è stato verificato su launcher. Il picker nativo segue il locale del sistema Android; gli snapshot seguono la lingua UI dell'app.
- Contenuti IA, testi liberi remoti, programmi custom e push possono restare ES/EN. Nessun overlay italiano dei dati bundled è introdotto; eventuali overlay futuri devono restare fuori da sessioni/log/template e campi editabili.
- Warning lint preesistenti restano; non sono parte di questa fase.

## Procedura APK non distruttiva

1. In un ambiente Android con rete/toolchain funzionanti, usare il ramo indicato, lockfile congelato, prebuild e `assembleDebug`. Non eseguire script di migrazione, reseed, repair, clean o publish. Verificare esplicitamente i soli URL pubblici dei servizi autorizzati e non usare credenziali di produzione per costruire/testare.
2. Usare un dispositivo/emulatore e account di test autorizzati ES ed EN. Conservare un export/backup dei soli dati di test. Le verifiche di scrittura devono usare copie di programmi di test, mai programmi personali/ufficiali o dati di altri account. Se manca l'account autorizzato, fermare quel collaudo.
3. Dispositivo italiano e app nuova: UI IT, contenuti/default storici EN; poi cold restart. Preferenza locale ES/EN preesistente: passare a IT e verificare che la preferenza server non cambi. Eseguire IT→EN→ES→IT attendendo ogni sync; verificare `users.language` ES/EN e nessun IT.
4. Login, refresh, logout, cambio account: controllare che contenuti e preferenze non siano ereditati dall'altro account. Ripetere dopo riavvio e offline/online; nessun reset dei dati e nessuna duplicazione delle code.
5. Sui soli programmi di test ES-only, EN-only, ES/EN e legacy, acquisire payload redatti e stato prima/dopo: apertura + salva senza edit non scrive; stesso valore digitato non cambia mappe; edit reale preserva le altre lingue; duplicazione preserva mappe. Cambiare UI mentre il wizard è aperto e aggiungere un esercizio; verificare che nome/muscoli/note usino il locale fissato. Testare media su copie autorizzate.
6. Sessioni, primo workout, ripristino e template: confrontare ID, serie, reps, rest, timer, progressioni e log. UI IT non deve tradurre/rinominare i valori tecnici o il contenuto originale. Per battles usare solo una configurazione/account di test autorizzato, nessun invito ad altri utenti.
7. IA e alimentazione: controllare i payload redatti confrontati con ES/EN (messages/userContext, enum, macro, date, FormData); nessun nuovo `language/locale`. Verificare streaming, parsing, retry e salvataggi solo su dati di test autorizzati. Non dedurre il supporto IT del servizio dalla lingua di una risposta occasionale.
8. Wger/OFF: verificare letture, poi eventuale import soltanto su dati di test autorizzati; ricerca e `wger_language` ES/EN coerenti, OFF dati nutrizionali e barcode invariati.
9. Aggiungere tutti gli otto widget, provarli con snapshot ES/EN già presenti e nuovi IT, dati assenti/stale/rollover; cambiare lingua e riavviare processo app/launcher. Controllare il picker su dispositivo IT. Verificare push preferenza ES/EN e UI delle notifiche, senza inviare notifiche ad altri account.
10. Registrare per ogni caso APK/versione, device/OS, risultato, evidenza redatta e servizi effettivamente verificati. **Solo con queste prove rivalutare l'autorizzazione della fase 4.**

## Commit di implementazione

- `9c16eeff4d81c3062b925e5d542d4ef3ddd66987` — politiche UI/contenuti/servizi e fixture dei contratti.
- `67b11b3815c19301c3c38efd12488638bb0a8a6b` — preservazione programmi, default, picker e contenuti persistibili.
- `d96501ada11ea17987e2a1f9a4f887f1215a434f` — selettori Android e aggiornamento atomico dei widget.

Questo report viene salvato nel commit documentale successivo. Non autorizza merge o traduzione massiva.
