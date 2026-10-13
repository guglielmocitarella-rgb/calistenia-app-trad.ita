# Audit della localizzazione italiana Android — fase 2

Data: 13 ottobre 2026. Ramo: `feature/italian-localization`. PR: https://github.com/guglielmocitarella-rgb/calistenia-app-trad.ita/pull/1

Revisione analizzata: `9f0570c807d002d721a23ab8d0bda940554de793`.

## Perimetro confermato e limite bloccante

Obiettivo confermato: **solo l'interfaccia Android completamente italiana**. Non abbiamo accesso o controllo sui server originali. Testi remoti, contenuti IA e dati dell'utente devono restare nel formato e nella lingua del servizio; nessuna traduzione dei dati persistiti è richiesta.

Audit statico completato, con inventari riproducibili. Non è stata avviata la fase 3. Nessun file applicativo, catalogo, algoritmo, sito o backend è stato modificato.

**L'italiano dell'interfaccia NON certifica la compatibilità dei salvataggi né rende italiani i contenuti server.** È stata individuata una soluzione compatibile a livello di contratti nel repository: separare UI `it`, lingua dei contenuti/editing `es|en` e parametri specifici dei servizi; lasciare immutati gli endpoint privi di parametro linguistico. La soluzione è descritta sotto, ma non implementata né verificata sul server distribuito. **Fase 3 non autorizzata finché la separazione compatibile non è verificata; i percorsi di scrittura devono essere provati con fixture e APK.** I test su un backend di prova controllato non sono attualmente disponibili; sull'originale usare soltanto un account di test e azioni autorizzate, senza migrazioni o admin access. Non si autorizza alcun nuovo valore persistente lato server.

## Risultati quantitativi

I cataloghi es/en/it contengono tutti 5.305 chiavi piatte, senza differenze di presenza.

| Classificazione primaria, mutuamente esclusiva | Chiavi |
| --- | ---: |
| Riferimento statico diretto nel codice mobile | 1.773 |
| Riferimento statico in moduli core raggiungibili, senza precedente riferimento mobile | 27 |
| Potenziali: famiglie dinamiche, costanti e chiavi server note | 502 |
| Apparentemente web: riferimenti nel web, senza evidenza mobile rilevata | 2.588 |
| Non determinabili con questo audit | 415 |
| Totale | 5.305 |

**1.800 chiavi con uso statico confermato nel perimetro Android; 502 ulteriori candidate: 2.302 chiavi nel primo perimetro di lavoro.** Non è una lista definitiva di tutte le chiavi richieste a runtime: 173 chiamate dinamiche, di cui 81 senza pattern delimitabile, possono ampliare il perimetro. Le 2.588 chiavi apparentemente web e le 415 non determinate NON sono dichiarate inutilizzate o eliminabili.

5.176 valori italiani sono identici a quelli inglesi; 1.729 di questi appartengono alle 1.800 chiavi statiche. Uguaglianza non equivale automaticamente a mancata traduzione (unità, nomi propri e termini identici sono possibili). Il conteggio è sui valori reali di questa revisione, non sulla precedente descrizione della PR.

Analizzati 352 file JS/TS mobile non di test e 288 moduli core raggiungibili per import/export transitivi. 0 errori sintattici AST, 0 chiavi statiche mancanti nei tre cataloghi. 627 posizioni di testo/literal UI o mappe locali candidate in 80 file; ulteriori 1.835 literal da revisione contestuale. Questi conteggi includono unità, marchi, etichette e messaggi interni: non sono 627 traduzioni già approvate.

## Metodo, precisione e incertezze

Lo script `scripts/audit-android-localization.cjs` usa l'AST TypeScript 5/6, non una ricerca testuale per decidere l'assenza delle chiavi. Identifica `t`, chiamate `.t`, ternarie di literal, template, varianti plurali, literal di chiavi fuori dalle chiamate e import/export. Distingue mobile, core raggiungibile e riferimenti web. Il web è letto soltanto per confronto; non viene modificato.

Tutti i moduli mobile sono radici conservative (incluse route Expo e widget Android); la chiusura è per file, non per singolo export né per esecuzione dei rami condizionali. Può sovrastimare moduli condivisi e codice non eseguito su Android. Le chiavi potenziali possono appartenere a costanti non effettivamente passate a `t`. Non si pretende una prova di copertura runtime, tree shaking, reflection, alias di traduttori arbitrari o codice creato dal server.

I template delimitano famiglie come `day.*`, `dayShort.*`, `month.*`, `nutrition.tabs.*`, `achievements.*.name/desc`, `cardio.*`, `difficulty.*`, `notifSettings.*`. Chiamate come `t(key)`, `t(program.title_key)`, `t(getEquipmentLabelKey(eq))` sono esplicitamente conservate nell'inventario. Le famiglie `communityProgram.*` restano potenziali perché PocketBase invia `title_key` e `description_key`: il contenuto delle righe live non è stato richiesto. Per stabilire esclusività web definitiva servono valori server e tracciamento delle chiavi durante test APK.

9 import non inclusi nella chiusura JS/TS: CSS e risorse JSON esistenti, elencati nell'inventario. I tre cataloghi sono confrontati separatamente; esercizi, feature e changelog sono censiti in `ANDROID_LOCALIZED_RESOURCES.json`. Non sono dipendenze mancanti. Directory native iOS e target Swift sono esclusi; moduli JS comuni restano conservativi.

## Artefatti e riproduzione

- `ANDROID_ITALIAN_LOCALIZATION_INVENTORY.json`: ogni chiave, stato, presenza es/en/it, uguaglianza dei valori, file/riga/colonna e motivazione; elenco chiamate dinamiche, meccanismi e chiusura degli import.
- `ANDROID_ITALIAN_HARDCODED.json`: posizioni sintattiche di testo UI e literal più candidati contestuali. I nomi `confirmedSyntaxSites` indicano certezza della posizione sintattica, non obbligo di tradurre ogni testo.
- `ANDROID_ITALIAN_HARDCODED.md`: elenco leggibile delle 627 posizioni, con file/riga/colonna.
- `ANDROID_LOCALIZED_RESOURCES.json`: 6.654 mappe locali nelle risorse JSON, con percorso JSON e lingue presenti; esterno alle 5.305 chiavi i18next.
- `ANDROID_LANGUAGE_BOUNDARIES.json`: indice file/riga delle letture della lingua, helper di localizzazione e confini da revisionare; è un indice lessicale, non una certificazione di data flow.
- `scripts/audit-android-localization.cjs`: scanner riutilizzabile, senza modifiche applicative.

Dopo l'installazione ordinaria delle dipendenze del progetto:

```sh
pnpm --filter @calistenia/core exec node ../../scripts/audit-android-localization.cjs
```

In alternativa rendere TypeScript 5/6 disponibile tramite `NODE_PATH`. TypeScript 7 non espone la stessa compiler API. Lo scanner sovrascrive soltanto gli inventari prodotti dall'audit, non traduzioni o sorgenti. Il Markdown narrativo e l'indice Markdown hardcoded devono essere aggiornati insieme ai nuovi risultati.

## Testi hardcoded e componenti da modificare

L'elenco completo delle posizioni è nell'indice Markdown e nel JSON. I candidati devono essere validati nel componente: non tradurre ID, slug, enum, URL, campi JSON, query, classi CSS, unità e marchi automaticamente.

| Priorità | Componente/percorso | Evidenza e intervento minimo futuro |
| --- | --- | --- |
| P0 | `src/app/profile.tsx:204,650-655` | `it` visualizzato come `es`; selettore solo Español/English. Aggiungere IT e risolvere la lingua UI senza conversione binaria. |
| P0 | `src/components/onboarding/OnboardingFlow.tsx:73,362` | Stessa conversione e solo ES/EN. |
| P1 | `src/app/health.tsx:60-171` | Schermata Health Connect con testo spagnolo, anche spiegazioni e azioni secondarie. |
| P1 | `src/app/cardio/[id].tsx:130-236` | TIEMPO, DESNIVEL, FC MEDIA/MÁX, NOTA, Volver. |
| P1 | `src/app/friends.tsx:116-342`, `src/app/add-friend/[userId].tsx:51` | Amici, ricerca, errori, inviti e stato di follow in spagnolo. |
| P1 | `src/components/free-session/AISessionForm.tsx:126-139` | Prompt iniziale spagnolo: distinto dalle etichette UI e dagli enum contrattuali. |
| P1 | `src/widgets/*.tsx`, `plugins/with-widget-strings.js:44-73` | Dizionari autonomi es/en e risorse Android del picker dei widget; non dipendono solo da i18next. |
| P1 | `src/components/share/*.tsx` | Testi impressi nelle immagini condivise; revisionare anche quelli costruiti nei helper core. |
| P1 | `packages/core/lib/first-workout.ts` e `data/workouts.ts` | Titoli, note, regressioni, nomi e gruppi muscolari nei dati locali. |
| P2 | `src/components/nutrition/*`, modali/WhatsNew/Discover, badge | Testi locali, fallback e mappe bilingual esterne al catalogo. |

I percorsi `src/...` della tabella sono relativi a `apps/mobile`. L'indice include anche `new Error()` e literal `name/title/...` nei moduli condivisi: alcuni sono diagnostica, fixture dati o valori tecnici e vanno esclusi dopo verifica, non tradotti in massa.

## Percorso completo della lingua

- `src/lib/language-resolver.ts`: dispositivo `it`/`it-IT` → `it`, ES → es, altri → en; preferenza salvata es/en/it ha precedenza. Il valore salvato `it-IT` non viene accettato: solo tag base. Non è un errore sul percorso attuale che salva `it`, ma va coperto se si introducono tag regionali.
- `src/lib/i18n.ts:19-48`: legge `i18nextLng`, include la risorsa it, fallback inglese, persiste `languageChanged`. `src/lib/storage.ts` fornisce lo storage; `_layout.tsx:243-259` attende hydrate/auth prima di initI18n e poi attiva language sync.
- Le stringhe ancora inglesi in IT non attivano il fallback: la chiave esiste, quindi viene usato il valore inglese dello scaffold.
- Selettori manuali non completi: profilo e onboarding sono P0.
- `toLocaleDateString('it')` è valido; le conversioni esplicite en/else-es riportate sotto producono invece mesi/giorni spagnoli.
- `safeLocale`/`currentLanguage` accettano il locale attivo; non risolvono la separazione tra visualizzazione e scrittura.

## Incompatibilità es/en e rischi principali

| File e posizione | Funzione/comportamento | Conseguenza di UI it | Intervento minimo proposto |
| --- | --- | --- | --- |
| `packages/core/lib/language-sync.ts:21` | toUserLanguage / syncUserLanguage | it normalizzato a en e scritto in users.language; nessun it oggi, ma possibile cambio della precedente lingua server | Separare preferenza server e UI; conservare es/en già presente per UI it. |
| `packages/core/lib/i18n-db.ts:23` | localize | it assente → es → primo valore; stringhe legacy passano inalterate | Locale contenuto esplicito; overlay locale italiano solo in lettura per ID stabili. |
| `packages/core/lib/i18n-db.ts:31` | toTranslatable | Scrive {it: testo}; la firma permissiva non prova supporto di tutti i consumer | Usare locale contenuti verificato es/en per editing; mai UI locale nel serializer. |
| `packages/core/hooks/useProgramEditor.ts:1128` | loadProgram / saveProgram (salvataggio anche :1290,1294-1458,1503) | Nuove chiavi it su programmi/fasi/giorni/esercizi; diff può creare patch anche senza reale edit del contenuto | Stessa lingua es/en per load, state, save e diff; preservare tutte le mappe originali. |
| `packages/core/lib/programEditorDiff.ts:86` | readLocale / mergeTranslatable | Merge conserva altre lingue per mappe, ma scalar legacy sostituito da mappa; locale errato causa patch | Fixture mixed es/en, legacy e edit inesistente; non usare solo fallback visuale in diff. |
| `packages/core/hooks/usePrograms.ts:826` | duplicateProgram | Mappe es/en preservate, ma suffix copia ignora it; legacy avvolto con locale attivo | Passare content locale verificato, mai it per string legacy. |
| `packages/core/lib/i18n-db.ts:35` | duplicatedName | Suffix senza it ricade in spagnolo | Separare nome persistito e overlay UI. |
| `packages/core/lib/localize-reps.ts:31` | localizeReps | Qualsiasi non-es usa sostituzioni inglesi: it → reps inglesi | Aggiungere rendering IT locale senza cambiare reps persistite. |
| `packages/core/data/battle-presets.ts:193` | preset metadata | it → es, mappe solo es/en | Localizzare presentazione separata dalle preset/ID. |
| `packages/core/lib/battle-exercise-names.ts:40` | exercise name maps | it → es; nomi salvati esplicitamente es/en | Conservare serializer bilingue e identity; overlay IT solo per lettura. |
| `apps/mobile/src/lib/sync-widget-snapshot.ts:38` | build snapshot | it → es nel salvataggio locale widget | Allargare il solo contratto locale Android, insieme ai consumer e default. |
| `apps/mobile/src/lib/sync-nutrition-widget.ts:54` | nutrition snapshot | it → es | Aggiornamento atomico snapshot + STRINGS + tipi locali. |
| `apps/mobile/src/lib/sync-cardio-widget.ts:60` | cardio snapshot | it → es | Come sopra; mai applicare questo tipo locale al server. |
| `apps/mobile/src/lib/widget-snapshot.ts:37` | WidgetSnapshot | Tipo non ammette it; STRINGS[it] sarebbe undefined con cast isolato | Aggiornare tutti i consumer/fallback prima di scrivere it locale. |
| `apps/mobile/src/lib/nutrition-widget-snapshot.ts:26` | NutritionWidgetSnapshot | Solo es/en | Come sopra. |
| `apps/mobile/src/lib/cardio-widget-snapshot.ts:15` | CardioWidgetSnapshot | Solo es/en | Come sopra. |
| `apps/mobile/src/components/onboarding/StepPersonalizing.tsx:59` | month labels | it → es | Usare Intl it o dizionario UI it. |
| `apps/mobile/src/components/nutrition/PantryPlanSection.tsx:33` | date formatting | non-en → es-ES | Usare safe UI locale. |
| `apps/mobile/src/components/WhatsNewModal.tsx:452` | date formatting | it → es | Separare data UI dalla lingua dei changelog. |
| `packages/core/lib/whats-new.ts:105` | release text | it → es; changelog bilingual | Overlay locale o aggiunta it a risorsa locale, nessun backend. |
| `packages/core/lib/app-urls.ts:49` | localizedWebUrl | it → es per URL web | Conservare es/en nelle route web esistenti; non introdurre /it senza contratto. |
| `packages/core/lib/wger-mappings.ts:103` | mapWgerToExerciseCatalog | it non mappato → ID ES ma wger_language può salvare it | Mantenere lingua richiesta e metadato coerenti es/en; endpoint esterno da testare. |
| `packages/core/hooks/useWgerSearch.ts:95` | importExercise | Persiste lingua fornita e mappe es/en | Usare service locale supportato prima di search/import/map. |
| `packages/core/lib/openfoodfacts.ts:46` | searchOFF / mapOFFToFoodItem | Ricerca default es, nome spagnolo preferito indipendentemente dalla UI | Non assumere che lc=it renda italiano il nome; cambiare solo presentazione dopo verifica provider. |

## Contenuti dinamici: ciò che il catalogo IT non traduce

| Contenuto | Origine/percorso | Locale e limite | Modifica locale o server |
| --- | --- | --- | --- |
| Catalogo esercizi, tecnica, muscoli | `src/lib/catalog.ts`, `init-core.ts`, core `exerciseCatalog.ts`/`catalogIndex.ts`, `useExerciseCatalog.ts` | Risorsa `exercise-catalog.json`: 6.285 mappe con es/en; PocketBase può sovrapporre record | Traducibili localmente con overlay per ID/slug; per contenuti nuovi o override remoti serve IT nei record o un servizio di traduzione. Non tradurre ID. |
| Primo allenamento/regressioni | core `first-workout.ts:223-316`, `data/workouts.ts` | Mappe inline es/en; fallback spagnolo e suffix inglese/spagnolo | Risorse locali/UI; mantenere valori dei workout salvati e algoritmi. |
| Programmi, fasi, giorni, focus, note | core `usePrograms.ts:46-244,354-375`, `useProgramDetail.ts`, `useProgramEditor.ts` | Campi JSON via localize; legacy string non traducibile automaticamente | Overlay locale su seed noti possibile; programmi custom/live necessitano gestione contenuto remota. Locale editing separato. |
| Progressioni automatiche | core `useAutoProgression.ts`, resolver/catalogo | Identità, target e algoritmi separati da name visuale, ma nomi localizzati possono entrare in snapshot | Non cambiare IDs, target o log; confrontare snapshot/sync in APK. |
| Piani/ricette e note IA | core `plan-api.ts`, `ai-jobs-api.ts`, `useMealPlans.ts`, `useDailyMealPlan.ts` | Risposte con testo libero, non chiavi i18next | Non traducibili con translation.json; richiedono capacità server o overlay separato. Salvare payload originale. |
| Alimenti/catalogo/OFF | core `useFoodCatalog.ts:79-114`, `openfoodfacts.ts:23-46` | PB `name_display` stringa, OFF preferisce product_name_es; categories/tags sono slug | Label UI locale per enum noti; nomi arbitrari restano quelli ricevuti. |
| Community/obiettivi | `useCommunityPrograms.ts:74-93` + schermi community | title_key/description_key dal server chiamati con t; possibili chiavi non note | Chiavi catalogo locali traducibili; tracciare valori reali senza presumere tutte le righe seed/live. |
| Notifiche, insight, errori API | `language-sync.ts`, `notifications.tsx`, servizi IA e PB | Server copy es/en o stringhe libere; non tutte sono chiavi | Tradurre notifiche strutturate e codici noti in lettura, senza cambiare payload; push OS remoti non diventano IT solo con UI it. |
| Changelog e Discover | `features.json`, `changelog.mobile.json`, `whats-new.ts` | 42 e 317 mappe con es/en, più eventuali mappe incomplete censite | Risorse locali traducibili per Android; non catalogo i18next. |
| Nomi/note dell'utente, amici, chat, template | PB e cache, `useFreeSessionTemplates.ts:13,61,115` | Testo libero originale | Non tradurre automaticamente né riscrivere dati dell'utente. |

## Contratti backend verificati nel codice (server non modificato)

La lettura dei sorgenti server è necessaria per l'audit di compatibilità; non implica interventi sul backend. La revisione distribuita, lo schema live, ACL e prompt Langfuse effettivi non sono stati verificati.

| Confine | Client / server di riferimento | Contratto osservato | Politica Android compatibile |
| --- | --- | --- | --- |
| Preferenza linguistica utente | `language-sync.ts:20-50`; `pb_migrations/1790300000_add_language_to_users.js:33-46`; `push-sender.ts:26-49` | Campo text max 10, non enum; consumer PushLanguage es/en, en-prefix altrimenti es. Client es-prefix altrimenti en. Quindi inviare it non è supporto italiano e produce incoerenza | UI it solo localmente; per server preservare es/en valido già presente. Se assente usare l'attuale normalizzazione client (en per it), senza cambiare politica generale. |
| Program editor | `useProgramEditor.ts:1128-1252,1290-1503`; `programEditorDiff.ts:61-98,141-143` | JSON locale-keyed; lettura e diff hanno semantiche diverse. Tipo Record permissivo non prova consumer IT | Content locale storico es/en stabile per sessione di editing; leggere/modificare/salvare/diff nella stessa lingua; mantenere altre voci e forma legacy fino al punto già previsto dal codice. |
| Duplicazione programmi | `usePrograms.ts:824-841`, `i18n-db.ts:35-55` | Duplica mappe originali; stringa legacy avvolta nel locale passato | Non creare voce it. Non sostituire mappe con stringhe visualizzate. |
| Battles | `battle-exercise-names.ts:24-40`; `pb_hooks/utils/battles/state.js:380-385` | Nomi per es/en, controllo esplicito di quelle due lingue; identità catalogo separata | Preservare formato/serializer es/en, ID e preset. UI overlay it fuori dai nomi spediti. |
| Sessione IA chat | `src/lib/use-free-session-chat.ts:34-45,98-119`; `AISessionForm.tsx:126-139`; `mcpuse/api-routes.ts:581-597` | body messages + userContext. Nessun parametro locale/language estratto dalla route | Non aggiungere locale e non tradurre enum level/goal/equipment/location. Prompt testuale distinto: conservare il testo spagnolo iniziale nel percorso compatibile; la chat dell'utente resta testo libero. |
| Piani nutrizionali | `plan-api.ts:15-34,65-89`, `meal-plan-spec.ts`, `ai-jobs-api.ts:17-104`; `mcpuse/api-routes.ts` route meal/pantry/jobs | Budget/macros, goal, date, pantry items, meals; nessun locale inviato dal client | Payload invariato. Non introdurre language=en/it, non tradurre goal, meal_type, unit, score o category. |
| Analisi e lookup cibo | `useNutrition.ts:335,359`, `useFoodCatalog.ts:240`, `ai-jobs-api.ts:17-45` | FormData/JSON con immagini, descrizione libera e macro; errori liberi dal server | Nessuna conversione linguistica automatica del payload. Mappare soltanto codici errori conosciuti nell'UI. |
| Insight manuali | `useCrossInsights.ts:166-170`, `useSleepInsight.ts:139`, `useNutritionCoach.ts:307`; `mcpuse/api-routes.ts:506-536,565-577` | Route estraggono context oppure meals/goal/previous_week_score; non accettano una lingua nel percorso osservato | Non aggiungere parametri. In particolare la funzione cross insight ha language opzionale ma la route manuale non lo inoltra. |
| Insight/push automatici | `weekly-insight-dispatcher.ts:64,93,114`; `cross-insight-generator.ts:174-183` | Usa users.language normalizzato es/en e languageNote inglese quando en | Preservare server language es/en; lingua UI distinta. |
| Wger | `wger.ts:70-72`, `wger-mappings.ts:9-11,100-108,154`, `useWgerSearch.ts:42-95` | Service language string; mapping locale IDs ES=4 EN=2, default ES; import salva wger_language | ES/EN coerente tra ricerca, mapping e metadato. Supporto italiano del provider non verificato, non abilitarlo ora. |
| Open Food Facts | `openfoodfacts.ts:23-24,46`, `useFoodCatalog.ts:110-114` | lc default es; mapping non locale-aware; dati tecnici e nomi originali | Mantenere contratto attuale. Eventuale IT di sola presentazione separato dalla persistenza, con test provider. |
| Auth/sync/cache | `useAuth.ts`, `src/lib/storage.ts`, session contexts, progress-map/query keys | Token e ID non dipendono da translation.json; cache può contenere nomi/testi localizzati e queue offline | Non rinominare storage key, user IDs, exercise IDs, enum, client_id o query contract. Nessun re-login o reset storage imposto dalla lingua. |

### Prompt testuali e parametri contrattuali

`AISessionForm.handleSubmit()` costruisce `Sesión de ...` come testo del messaggio: non è un campo enum lingua. `UserContext` contiene invece codici tecnici che devono rimanere identici. Tradurre le etichette visuali non deve tradurre i relativi `value`. Il generatore server (`free-session-generator.ts:241,283`) carica prompt tramite `getPromptWithMeta`; il contenuto remoto Langfuse può differire dal fallback nel repository (`api/prompts.ts:448-459`). Non si può assicurare una risposta italiana aggiungendo soltanto istruzioni al messaggio senza verificarne effetti e parsing strutturato.

Il caso cross insight è distinto: `cross-insight-generator.ts:177-183` aggiunge una nota inglese solo se language=en; il dispatcher passa questa lingua, la route manuale no. Non applicare una regola globale "ogni IA in inglese".

## Adattatore Android proposto (solo progetto, non implementazione)

Introdurre tre responsabilità separate, senza cambiare `i18next.language` durante le richieste:

1. **uiLocale**: es/en/it; dispositivo, preferenza locale `i18nextLng`, t(), date e componenti. IT può essere persistito nello storage privato dell'app, non è un nuovo valore server.
2. **backendPreference**: es/en; per UI es/en segue la scelta esistente. Per UI it conserva il valore es/en del record autenticato o l'ultima preferenza compatibile nota; in sua assenza applica l'attuale default client en. Non convertire preferenze es esistenti a en soltanto perché UI è italiana. Validare per utente e reset al cambio account, senza migrare dati server.
3. **contentLocale**: es/en che riproduce la lingua di elaborazione precedente all'introduzione di IT, conservata separatamente dalla UI. Per editor/load/save/diff usare lo stesso locale storico e gli stessi fallback esistenti; **non aggiungere una nuova selezione automatica per record né migrazioni della forma dei dati**. In un'installazione nuova su dispositivo italiano il resolver originario avrebbe scelto en; una precedente preferenza es/en valida deve essere conservata. Dove il servizio aveva default es (Wger/OFF, preset), mantenerlo: backendPreference non impone en a tutti. Per account/dati esistenti verificare il locale precedente con fixture e APK, senza dedurlo solo dall'UI it.

Un'interfaccia futura potrebbe offrire `getBackendPreference()` e `getContentLocale(record, operation)`, oltre ad una policy per singolo servizio. Iniettare dall'inizializzazione Android tramite un'opzione di piattaforma o un resolver esplicito nei soli hook interessati; default core conserva il comportamento web attuale. Gli hook core leggono oggi il singleton i18next: un helper nel solo mobile senza instradare `useProgramEditor`, `usePrograms` e `language-sync` non è sufficiente. Non fare monkey patch globale di localize/toTranslatable o uno switch temporaneo della lingua UI, che introdurrebbe gare tra richieste/render.

Per salvare una modifica esistente: conservare record originale e tutte le sue mappe, presentare nell'editor il contenuto della stessa contentLocale che verrà serializzata, applicare il diff esistente con quella lingua. **Non mostrare un overlay italiano nel campo editabile e poi salvarlo sotto es/en**: sarebbe perdita semantica/sovrascrittura, pur con un JSON formalmente valido. L'eventuale overlay italiano deve essere solo di lettura e non entrare in state persistiti, log, template o payload.

Per API senza locale: identità del payload, zero parametri aggiunti. Per Wger/OFF: policy del provider separata, non quella i18next. Per widget: lingua IT locale Android può essere aggiunta solo insieme a tutti i consumer STRINGS/tipi e gestione snapshot precedenti; ciò non estende alcun contratto server.

Questa architettura conserva i contratti osservati e consente un'UI italiana senza supporto IT del backend. I testi IA, push remoti e programmi custom possono restare ES/EN: ciò è un limite documentato dei contenuti dei servizi, **non un incarico a tradurli o cambiare i server**. Il risultato richiesto resta l'interfaccia italiana.

## Controlli eseguiti e non eseguiti

Eseguiti:

- Scanner AST su sorgenti reali: 0 parse diagnostics; inventario 5.305 chiavi uniche; somma degli stati verificata e presenza di ciascuna chiave nei tre cataloghi.
- 0 chiavi statiche mancanti; parità placeholder `{{...}}` IT/EN verificata su tutte le chiavi.
- Smoke test eseguendo i moduli TypeScript puri tramite transpile: 10 casi del language resolver, inclusi it, it-IT dispositivo, preferenze salvate e fallback; 4 casi contenuti/helper.
- Riprodotto fallback di localize(es/en, it) a ES, pass-through legacy, emissione di `{it:...}` da toTranslatable e conversione di `10 repeticiones` a `10 reps` per it. Sono rischi osservati, non correzioni.
- Rigenerazione deterministica degli inventari e `git diff --check` prima del commit; verifica che i soli file aggiunti siano documentazione e scanner.

Non eseguiti: suite Vitest completa, lint/typecheck applicativi e build APK (dipendenze del monorepo non installate nel checkout); nessun test autenticato su PocketBase, API IA, Health Connect o dispositivo. È stato installato soltanto TypeScript 5.9.3 in un percorso temporaneo esterno al repository per l'audit. Non sono stati usati account/credenziali, né creati record server per provare il salvataggio. L'assenza di errori statici non certifica login, sync, workout o nutrizione end-to-end.


### Valori localizzati che possono raggiungere il salvataggio

L'adattatore non deve limitarsi ai parametri chiamati locale/language. `useProgramEditor.ts:351,404-405,925` genera nomi di fasi, giorni e focus tramite `i18n.t()` e li mette nello state poi serializzato. Con UI it questi valori potrebbero essere italiani anche sotto una chiave es/en. Per preservare il comportamento usare un traduttore fissato alla contentLocale storica **solo per i default destinati ai dati**; usare t/UI it per etichette e messaggi di errore. Dati persistiti e testo visuale vanno tenuti separati fin dall'origine, senza rinominare campi o cambiare formato. Anche `usePrograms.ts:159-160` genera giorni/focus di riposo tramite i18n.t: verificare ogni consumer che li copia in editor/sessioni/template.

`first-workout.ts`, normalizzazione delle sessioni ripristinate, template liberi e share helpers possono copiare nomi già localizzati in snapshot, log o contenuti condivisi. Un overlay IT puramente visuale deve restare fuori da questi oggetti. `toTranslatable()` oggi accetta it, ma questo audit **non lo modifica e non autorizza a usare quel valore**. I helper di merge mantengono le altre mappe per gli oggetti già multilingua; la gestione legacy resta quella esistente.

## Test bloccanti sull'APK (server originale, senza interventi amministrativi)

| Percorso | Verifica richiesta prima di abilitare nuove scritture con UI it |
| --- | --- |
| Avvio/lingua | Dispositivo IT, cambio manuale, cold restart, storage hydration e passaggio ES/EN/IT senza reset. |
| Login/sync | Account server es e en: login, refresh token, logout/cambio account; UI it non modifica la lingua server già valida; snapshot e code offline si sincronizzano una sola volta. |
| Program editor | Fixture es-only, en-only, es/en e legacy: apertura/salvataggio senza edit produce nessuna modifica di testo; edit modifica solo voce corretta; nessuna nuova voce it; duplicate conserva tutte le altre lingue. |
| Allenamento/progressione | Confrontare ID, serie, reps, timer, target, variante, log e progressione prima/dopo cambio lingua; sospensione/ripristino sessione e sync offline. |
| IA | Richieste registrate/redatte confrontate: stessi enum e schema; streaming, parsing esercizi, errori e retry invariati. Non dedurre supporto IT dalle sole risposte occasionali del modello. |
| Alimentazione | Piani giorno/settimana/pantry e jobs, lookup/analyze/score, salvataggio meal, macros e consumption invariati; nomi display non riscrivono originali. |
| Notifiche/widget | Push es/en preservati; in-app keys tradotte; tutti gli otto widget con snapshot nuovi/vecchi e fallback, nessun accesso a STRINGS undefined. |
| Servizi esterni | Wger search/import stessa lingua e metadati, OFF nome/codice/nutrimenti; Health Connect autorizzazione/sync e messaggi di errore. |

## Piano prioritizzato della fase 3 (non avviata)

**P0 — Compatibilità prima delle scritture:** implementare e verificare separazione UI/backend/content locale con fixture; garantire identità dei payload privi di locale e conservazione delle mappe. Aggiornare selettori UI e loro test; non modificare server/web. Eseguire APK test bloccanti sul servizio originale con account di test, nei limiti dell'accesso disponibile. Il piano è una proposta, non autorizzazione a procedere.

**P1 — Traduzione mirata:** iniziare dalle 1.800 chiavi con riferimenti statici, poi 502 candidate validate; mantenere placeholder/plurali. Aggiungere chiavi per hardcoded visibili confermati. Priorità login/onboarding, profilo, health, allenamento, library, nutrition, secondarie/modali/errori e share cards. Completare widget/tipi/risorse native Android in modo atomico.

**P1 — Contenuti locali:** overlay italiano per catalogo e dati bundled per ID stabile; feature/changelog, primo workout, preset, reps e badge. Dimostrare che overlay non entra nei dati salvati. Non toccare algoritmi, ID, slug o seed server.

**P2 — Copertura dinamica:** tracciamento dev Android delle chiavi richieste e mancanti nei percorsi testati; confrontare i title_key server reali. Rivedere le 415 non determinate e le 2.588 apparentemente web solo quando emerge prova mobile. Non cancellare chiavi.

**P2 — Limiti dei servizi originali:** documentare ciò che resta ES/EN (IA, push OS, programmi personalizzati/record remoti, alimenti). Nessuna modifica o traduzione lato server e nessuna migrazione dei dati sono previste o richieste.
