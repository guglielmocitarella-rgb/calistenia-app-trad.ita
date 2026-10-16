# Glossario italiano Android — fase 4A

Registro terminologico locale del progetto, basato sulle stringhe effettive del blocco. Tono diretto, seconda persona singolare; pulsanti con verbo all'imperativo. Nessun glossario remoto DeepL creato o modificato.

| Termine di origine | Italiano UI | Nota |
| --- | --- | --- |
| workout / training | allenamento | Non «formazione» o «treno» |
| session | sessione | Sessione libera per free session |
| set / sets | serie | Non «insiemi» |
| rep / reps | ripetizione / ripetizioni | Le unità tecniche nei dati restano originali |
| rest | riposo | Recupero quando si parla del processo fisiologico |
| streak | serie di settimane consecutive | Nel profilo/dashboard conta settimane, non giorni |
| deload | scarico | Settimana di scarico |
| goal | obiettivo | Peso obiettivo per goal weight |
| pace | ritmo | Ritmo del cambiamento di peso; andatura per cardio |
| sign in / sign up | accedi / iscriviti | Create account → crea un account |
| save / cancel / discard | salva / annulla / scarta | Distinguere chiusura e perdita dei progressi |
| settings | impostazioni | |
| light / dark theme | tema chiaro / scuro | Intensità leggera, attività leggermente attivo |
| pull-ups / push-ups | trazioni / piegamenti | Solo etichette UI del profilo; PR e identità invariati |
| handstand | verticale | Solo visualizzazione |
| core / muscle-up / planche / L-sit / pistol squat | Core / muscle-up / planche / L-sit / pistol squat | Termini calistenici consolidati |
| community | community | Coerente in navigazione e guida |
| personal records | record personali | |
| program / phase | programma / fase | Nomi e testi dei programmi ricevuti non riscritti |
| progress | progressi | |
| nutrition | nutrizione | Etichetta di navigazione; blocco nutrizione successivo |

Unità, numeri, URL, e-mail di assistenza, marchi, ID, enum, chiavi API e placeholder restano invariati. Le abbreviazioni dei giorni sono Lun, Mar, Mer, Gio, Ven, Sab, Dom. Giorni inseriti nelle frasi e mesi iniziano in minuscolo. I nomi delle lingue nel selettore restano autònimi: Italiano, English, Español.

## Estensione fase 4B

Le decisioni e i valori approvati della 4A sono conservati. Nel blocco allenamenti:

| Termine di origine | Italiano UI | Contesto |
| --- | --- | --- |
| rest | recupero / riposo | Recupero tra serie, esercizi e round; riposo nei giorni senza allenamento |
| free session | sessione libera | Non «sessione gratuita» |
| exercise library | catalogo esercizi | Non biblioteca |
| push / pull | spinta / trazione | Etichette di categoria; gli enum originali restano invariati |
| round | round | Invariabile; non confondere round e serie |
| warm-up / cooldown | riscaldamento / defaticamento | Intestazioni e comandi |
| resume | riprendi | Comando del timer/sessione |
| discard / delete | scarta / elimina | Distinguere rinuncia alla sessione ed eliminazione di record |
| pace / splits | andatura / tempi parziali | Cardio GPS |
| sets / reps | serie / ripetizioni | Target e valori nei dati invariati |
| freestanding handstand | verticale senza appoggio | «obj 60s libre»: obiettivo 60s senza appoggio, solo visualizzazione |
| maximum in every benchmark | max in tutti i test | «máx en todo»: prove di forza, non numero di serie |

Nei badge e nei contatori stretti: «Sett.», «Miei», «Cambia», «Serie», «Info». Core, calisthenics, muscle-up, planche, L-sit, pistol squat, Tabata, EMOM, TRX, BOSU, fitball e kettlebell mantengono la terminologia consolidata. Nessun glossario remoto DeepL creato o modificato.

## Estensione fase 4C — nutrizione

| Origine | Italiano UI | Contesto |
| --- | --- | --- |
| meal / log meal | pasto / registra pasto | Log è un comando, non accesso |
| food log | diario alimentare | |
| daily / weekly meal plan | piano giornaliero / piano settimanale | Piano alimentare per meal plan |
| fasting / finish fast | digiuno / termina digiuno | Fast non significa veloce |
| custom hours | durata personalizzata (ore) | Durata, non orari del giorno |
| pantry / shopping list | dispensa / lista della spesa | |
| fat / lose fat | grassi / riduci il grasso corporeo | Macronutriente distinto da obiettivo |
| protein / carbs | proteine / carboidrati | PROT / CARB nei riepiloghi stretti |
| unit | pz | Solo etichetta di unidad/ud/unidades; valore contrattuale invariato |
| logged / regenerate | registrato / rigenera | |
| quality / score | qualità / punteggio | Lettere A–E invariate |
| calorie surplus | surplus calorico | |
| receipt | scontrino | |

Date e decimali italiani soltanto nel rendering. Gli input e i parser numerici conservano il comportamento esistente; non cambiano quantità, unità, timestamp o strutture salvate. Nomi, ricette, ingredienti e messaggi IA remoti rimangono originali. Gli esempi dispensa mostrano italiano ma inviano esattamente la stringa originaria della baseline (EN per UI IT, ES/EN per le rispettive UI). Traduzione iniziale tramite DeepL e revisione contestuale locale; glossari remoti non disponibili sul piano Free e non modificati.

## Estensione fase 4D

| Termine di origine | Italiano UI | Contesto |
| --- | --- | --- |
| statistics | statistiche | Dati e filtri di allenamento |
| achievements | traguardi | Titolo della schermata; etichette approvate del profilo conservate |
| weekly streak | continuità settimanale | Numero di settimane consecutive con obiettivo raggiunto |
| best streak | serie migliore | Contatore compatto; `{{count}} sett.` resta invariato |
| weighted volume | volume con carico | Valore in kg già calcolato dall'app |
| personal record | record personale | Record e celebrazioni |
| body measurements | misurazioni corporee | Circonferenze in cm |
| lean mass | massa magra | Valore stimato originale |
| front / side / back | frontale / laterale / posteriore | Categorie delle foto; enum originali invariati |
| back | schiena | Gruppo muscolare; non il comando «Indietro» |
| insights | analisi / riepilogo | Cornice locale; contenuto IA originale |
| wins / watch outs | risultati / da monitorare | Sezioni delle analisi |
| arm left/right short | Br. sx / Br. dx | Cronologia misure |
| thigh left/right short | Co. sx / Co. dx | Cronologia misure |

Date di calendario mostrate come `gg/mm/aaaa` (o `gg/mm` nelle miniature), senza cambiare le stringhe ISO originali. Virgola decimale soltanto sulle stringhe numeriche di presentazione, mantenendo precisione e unità. Serie, ripetizioni, carichi e condizioni dei traguardi non cambiano. EN/ES e il glossario remoto non sono modificati.
