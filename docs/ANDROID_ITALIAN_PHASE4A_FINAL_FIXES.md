# Calistenia Android — correzioni finali fase 4A

## Evidenza e ambito

Collaudo dell'utente sull'APK `232eb354ba1bba562ec8910dc73f302b36a20973`: contatore settimanale del profilo spezzato e voce Allenamento troncata. Nessuna fase 4B o release avviata.

## Correzioni

- `progressTab.weeksShort_one/other`: `{{count}} sett.` per entrambe le forme. Interpolazione numerica e calcolo della continuità invariati.
- `profile.tsx`, `StatTile`: valore su una riga con adattamento della dimensione (limite 70%); tile con `min-w-0`. Etichetta completa «Settimane consecutive» su massimo due righe, tracking ridotto da 2 a 0,5 px. Nessuna abbreviazione ambigua dell'etichetta.
- `nav.workout`: «Allenati». `_layout.tsx` usa già questa chiave esclusivamente per la navigazione mobile; i titoli estesi delle altre schermate usano chiavi diverse e restano invariati. Non serve modificare `_layout.tsx`.
- Modificati soltanto tre valori nel catalogo IT. EN/ES byte per byte invariati; web registra soltanto EN/ES e non importa IT. Nessuna modifica a backend, contratti API, algoritmi, identità degli esercizi, dati persistiti o protezioni linguistiche fase 3.

## Commitlint e cronologia

Il job `115465741385` del run `38446378147` falliva soltanto su `232eb354`: `type-empty` e `subject-empty`. Un nuovo commit conforme o un revert non eliminerebbe il messaggio non conforme dall'intervallo della PR.

Intervento minimo: sostituire soltanto l'ultimo commit di trigger con `cf5436104c5a59ab198d6767657ecd79abd03386`, messaggio `ci(android): trigger phase 4A standalone APK rebuild`, identico tree `0df566f7d0be13d99f19765beae5206dbf05ff95` e identico parent `47feba0330ea1c028b568ccbc3d6ebefee5bdf16`. Tutti i commit precedenti restano intatti. L'originale è conservato sul ramo di archivio `archive/apk-trigger-232eb354`.

L'aggiornamento del ramo della PR è protetto da expected SHA `232eb354ba1bba562ec8910dc73f302b36a20973`; se la testa cambia, fermarsi e riesaminare. Commitlint e workflow invariati: il commento di trigger originale viene mantenuto.

## Verifiche locali

- Core: 201 file, 2.789 test passati.
- Mobile: 21 file, 185 test passati.
- Web: 74 file, 688 test passati.
- Typecheck: tutti i workspace passati.
- Lint: mobile/web passati; 0 errori, 23 warning mobile preesistenti.
- Chiavi IT/EN e placeholder: parità completa; EN/ES byte-identici alla baseline.
- Interpolazione reale i18next: `0/1/2/52/999 sett.`; navigazione `Allenati`; navigazione EN/ES invariata.
- Commitlint: intervallo completo dalla base PR a `47feba03`, messaggio del trigger corretto e messaggio delle correzioni verificati.
- `git diff --check`: passato.

La verifica remota deve riferirsi al commit finale: CI mobile, Build & Deploy App, Build & Deploy AI API e Security Checks, inclusa Dependency Review. Gli esiti e i link definitivi sono riportati nel riepilogo della consegna. I job di deploy sulle PR devono restare skipped; i workflow APK manuali non sono eseguiti da queste correzioni.

## Residui e collaudo

`ANDROID_ITALIAN_PHASE4A_DEVICE_RESIDUAL.json` seleziona 605 chiavi candidate dall'inventario originale della fase 2 e dai residui 4A, con testi EN/IT e riferimenti storici. Include, fra gli altri: `Your program`, `Choose a program`, `Other ways to train`, `Free session`, `Library by muscle and equipment`, `NUTRITION`, `DAY`, `WEEKLY PLAN`, `Add what you have at home` e `Recalculate`.

La selezione è documentale, non una nuova analisi da zero né la traduzione 4B. Alcuni valori identici (Coach, min, ecc.) possono essere corretti anche in italiano. Gli screenshot del telefono non sono allegati a questo turno; le due immagini recuperabili dalla conversazione precedente mostrano la pagina Actions, quindi non si attribuiscono loro etichette dell'app non osservate.

Occorre un nuovo APK standalone del commit finale per confermare il risultato visivo: profilo a 0/1/più settimane, etichetta completa, barra inferiore, schermi stretti, font di sistema grandi e regressione EN/ES. I test automatici non sostituiscono questo collaudo sul dispositivo. PR #1 in bozza; nessun merge, tag o pubblicazione.
