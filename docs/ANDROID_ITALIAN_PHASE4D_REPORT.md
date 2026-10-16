# Calistenia Android — report fase 4D

Data: 16 ottobre 2026. Ramo `feature/italian-localization`; PR #1 aperta/in bozza.

**Localizzazione implementata e verificata localmente. CI del commit finale e APK: verifica di consegna in corso. La chiusura richiede revisione indipendente e collaudo reale sul telefono.**

## Baseline e ambito

Baseline iniziale verificata: `f2fa7af7366239f4f37cabd47cf7b20f7c641cf3`, uguale al commit atteso della 4C. PR #1 aperta e draft. Tutti i quattro workflow della baseline, inclusi i singoli job, sono completed/success; deploy skipped: Mobile `38736418006`, Security `38736418181`, AI API `38736418015`, App `38736417985`.

Riutilizzati audit/inventario fase 2, compatibilità fase 3, glossario e report 4A/4B/4C e revisione dispositivo 4C. Nessun audit generale ripetuto. Lo scanner è eseguito come controllo finale e i suoi inventari storici sono conservati byte per byte.

Perimetro: sola presentazione italiana Android di Progressi, Statistiche, Calendario, Traguardi, Misurazioni corporee, Foto/comparatore, Analisi cross-metriche e relativa cronologia, celebrazioni/condivisione record e widget di continuità. Nessuna nuova funzionalità di progressione o misurazione.

## Copertura e inventari

- **395 chiavi revisionate; 356 valori italiani modificati.** Nessuna chiave aggiunta o eliminata: 5.305 per lingua.
- Scanner conservativo sulle famiglie revisionate: 173 android_direct, 60 android_potential, 150 web_apparent, 12 undetermined. La revisione di una famiglia non implica che tutte le chiavi siano usate su Android.
- **19 forme hardcoded locali** adattate, raggruppate per origine in `ANDROID_ITALIAN_PHASE4D_HARDCODED.json`; restano i fallback originali EN/ES/iOS.
- Due risorse Android di sola presentazione aggiunte: `progress-ui-labels.ts` e `use-progress-display.ts`; nessun asset grafico o immagine personale modificato.
- Glossario 4A esteso con terminologia 4D. Le 2.024 chiavi inventariate nelle fasi precedenti sono conservate senza modifiche.

### Schermate effettive

| Percorso / componente | Copertura |
| --- | --- |
| `(tabs)/progress.tsx` | Settimane, obiettivo, contatori, mappa mensile, righe cronologia e collegamenti; distanza cardio con virgola |
| `stats.tsx`, `components/stats/*` | Filtri, totali/medie/volume, muscoli/equilibrio, classifica, record, andamento e giorni; decimali solo nel rendering |
| `calendar.tsx` | Titoli, mesi/giorni già italiani conservati, dettagli attività, riposo/pianificazione, benessere, foto e peso visuale |
| `achievements.tsx` | Tutti gli 8 traguardi locali tramite identità stabile, requisiti, stati, progressi e date di sblocco |
| `body-measurements.tsx` | Modulo, storico, circonferenze, grasso corporeo, massa magra, differenze e date visuali |
| `progress-photos.tsx`, `PhotoComparator` | Permessi locali già tradotti, categorie, caricamento, note, confronto, slider, date e comandi |
| `insights.tsx`, `InsightsCard` | Cornice, sezioni, periodi settimanali/mensili e tempi relativi italiani; payload IA originali |
| `PRCelebration`, `PRShareCard`, `ProgressPhotoShareCard` | Etichette locali, numeri/date visuali, categorie foto e messaggio nativo PR; URL e dati personali conservati |
| `StreakWidget` | Dizionario IT del reader, senza cambi a snapshot, writer, contatori o azioni |
| Dettaglio sessione / progressioni | Verificata continuità con 4B: chiavi già tradotte e formati basati sul locale. Nessuna modifica a log o logica |

Il collegamento Peso e misure usa la schermata esistente di misurazioni. Non è stato introdotto un tracker del peso o un grafico Android nuovo. Le chiavi di sezioni legacy/web (esportazione, 1RM, foto di fase e grafici legacy) sono riviste terminologicamente, senza trasformarle in funzioni Android. Le quattro chiavi anatomiche/foto con scaffold «Indietro» sono corrette in «Schiena»/«Posteriore»; non erano traduzioni approvate nei precedenti inventari.

## Confini di compatibilità

Nessuna modifica a server, backend PocketBase, migrazioni, API/endpoint/provider IA, `apps/web`, algoritmi core, dati numerici, identità, enum, serializer, cache, sincronizzazione o protezioni linguistiche della fase 3. I cataloghi EN/ES sono identici alla baseline. Il web carica soltanto EN/ES e conserva il comportamento precedente.

Gli adattatori sono attivi soltanto per Android con locale italiano. Accettano stringhe già destinate al rendering: virgola decimale senza cambiare precisione; date di calendario senza spostare il giorno; tempi relativi con la stessa granularità ore/giorni originale. Campi editabili, parser, stato del form, date ISO di navigazione/salvataggio, parametri delle richieste e oggetti dei grafici restano originali. I nomi e i contenuti remoti arbitrari non sono tradotti. Nessun `it` aggiunto ai dati dei server originali.

Il messaggio nativo PR sostituisce esclusivamente la struttura locale riconosciuta; nomi personali e suffisso con URL referral rimangono originali. Il modulo condiviso `share.ts` non cambia. Le categorie foto sconosciute mantengono il fallback precedente. Il calcolo di giorni/settimane nelle immagini condivise resta invariato.

Le label statistiche possono occupare due righe, il nome del record lascia spazio al badge e gli header dispongono di spazio tra titolo e pulsanti. Il layout fisico deve essere collaudato sul telefono; non è certificato dagli unit test.

## Verifiche locali

| Controllo | Esito |
| --- | --- |
| Core completo | 2.789 test passati |
| Mobile completo | 210 test passati, 8 nuovi rispetto alla baseline 4C |
| Web completo | 688 test passati |
| Totale | **3.687 test passati** |
| Typecheck completo | success |
| Lint mobile e web | 0 errori; 23 warning mobile preesistenti |
| Scanner Android | 0 parse diagnostics; 0 chiavi statiche mancanti |
| Placeholder/interpolazioni | parità completa conservata |
| Numeri, URL e tag delle chiavi modificate | parità con EN verificata |
| Plurali, contatori e giorni | suite core e test i18next reale passati |
| Adattatori | Date valide/invalide, anno bisestile, precisione decimale, EN/ES/iOS/ignoti, tempi relativi e URL PR verificati |
| Dati originali | Statistiche reali, serie/record, log serializzati e traguardi invariati dopo la presentazione IT |
| Confini linguistici e trasporti | Suite esistenti core/mobile comprese, incluse le protezioni fase 3 e i trasporti nutrizione 4C |
| `git diff --check` | success |
| Commitlint | messaggi dei tre commit di implementazione verificati; intervallo effettivo ricontrollato prima del push |

Il primo passaggio core ha rilevato soltanto due eccezioni JSX divenute obsolete dopo la traduzione delle schede PR: entrambe rimosse dalla baseline, rendendo il controllo più restrittivo. Suite core integrale rieseguita: 2.789/2.789. Nessun test disabilitato, indebolito o modificato. Web emette l'avviso jsdom/canvas preesistente, con tutte le suite verdi. Dipendenze installate con pnpm 10.34.5 e lockfile congelato, senza modifiche a configurazione o dipendenze; avviso preesistente per build script unrs-resolver ignorato.

Revisione tecnica interna separata: corretti un riferimento temporale improprio nel Calendario e due date ISO residue nel comparatore. Nessuna criticità di backend/persistenza rilevata; questa revisione non sostituisce l'approvazione indipendente richiesta dall'utente.

## CI e APK di consegna

Da completare con commit effettivi, workflow, singoli job, artifact e SHA-256 dopo la compilazione. La verifica preliminare verde riguarda la baseline, non viene attribuita ai nuovi sorgenti.

Riutilizzato `.github/workflows/build-android-test-apk.yml`: cambia esclusivamente il commento del trigger per avviare la build autorizzata dopo il push. Nessuna modifica operativa al workflow, nessun aggiramento applicativo dell'infrastruttura. APK autonomo richiesto, senza Metro e senza pubblicazione.

## Residui e test non eseguiti

Inventario: `ANDROID_ITALIAN_PHASE4D_RESIDUAL.json`. Nomi/descrizioni esercizi, note, programmi/sessioni e contenuti IA arbitrari restano ES/EN o nella lingua originale. Sonno autonomo, salute, integrazioni native, lombare e social restano fuori perimetro; i loro collegamenti esistenti non sono rimossi. L'etichetta statica reps delle schede PR per eventi tempo/carico è un limite preesistente del componente e non viene reinterpretata in 4D.

Non eseguiti: collaudo sul telefono, autenticazione ai servizi originali, verifiche funzionali reali di inserimento/modifica/salvataggio misure/foto, condivisione nativa, sincronizzazione/offline, generazione IA e layout con font grandi. Lo smoke di avvio su emulatore non certifica questi flussi.

La fase 7 IA personale è registrata soltanto in `ANDROID_ITALIAN_FUTURE_ROADMAP.md`; nessuna implementazione. PR #1 resta aperta/in bozza; nessun merge, nuova PR, modifica di main, tag, release, migrazione o avvio della 4E.

## Documenti di consegna

- `ANDROID_ITALIAN_PHASE4D_STRINGS.json`: chiavi, valori, sorgenti e raggiungibilità scanner.
- `ANDROID_ITALIAN_PHASE4D_HARDCODED.json`: forme locali e adattamenti di formato.
- `ANDROID_ITALIAN_PHASE4D_RESIDUAL.json`: residui e limiti.
- `ANDROID_ITALIAN_PHASE4D_CHECKLIST.md`: prove da eseguire sul telefono.
- `ANDROID_ITALIAN_PHASE4A_GLOSSARY.md`: terminologia estesa.
- `ANDROID_ITALIAN_FUTURE_ROADMAP.md`: sola proposta fase 7.
