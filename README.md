# Hausaufgaben

Übungs-Apps und Übungsblätter zum Ausdrucken.

**Online:** https://claudedirkes.github.io/hausaufgaben/

## Themen

| Thema | App | Blätter |
| --- | --- | --- |
| Teilbarkeitsregeln | [teilbarkeit/](teilbarkeit/) | [bunt](teilbarkeit/uebungsblatt.pdf) · [schlicht](teilbarkeit/uebungsblatt-einfach.pdf) |

## Statistik

Jede gelöste Aufgabe wird an ein Google Sheet geschickt. Die Seite [statistik.html](statistik.html) zeigt den Verlauf pro Tag.

Einrichtung: Code aus [apps-script/Code.gs](apps-script/Code.gs) in ein Google Sheet einfügen (Erweiterungen → Apps Script) und als Web-App bereitstellen. Die URL kommt in [config.js](config.js) bei `statsUrl`.

Neue Übungs-Apps binden `../config.js` ein und rufen pro Antwort `HA_STATS.log(thema, übung, aufgabe, richtig)` auf.

## Neues Thema hinzufügen

1. Neuen Ordner anlegen, z. B. `bruchrechnen/`, mit `index.html` (App) und den PDFs.
2. In der `index.html` im Hauptordner eine weitere Themen-Karte einfügen.
3. Die Tabelle oben ergänzen.
