/**
 * Hausaufgaben-Statistik – Google Apps Script
 *
 * Einrichten:
 * 1. Neues Google Sheet anlegen (Name z. B. "Hausaufgaben Statistik").
 * 2. Erweiterungen → Apps Script → diesen Code einfügen → Speichern.
 * 3. Bereitstellen → Neue Bereitstellung → Typ "Web-App"
 *    Ausführen als: Ich   |   Zugriff: Jeder
 * 4. Die Web-App-URL (endet auf /exec) in config.js eintragen.
 *
 * doPost: die Übungs-Apps schicken hier jede beantwortete Aufgabe hin.
 * doGet:  die Statistik-Seite holt hier die Werte pro Tag ab.
 */

const SHEET_NAME = 'Antworten';
const TZ = 'Europe/Luxembourg';

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Zeit', 'Datum', 'Thema', 'Übung', 'Aufgabe', 'Richtig']);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Nimmt eine Liste von Antworten entgegen und hängt sie als Zeilen an
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const items = data.items || [data];
  const rows = items.map(x => [
    new Date(x.ts || Date.now()),
    "'" + x.date,               // als Text speichern, damit Sheets es nicht umwandelt
    x.topic || '',
    x.mode || '',
    x.task || '',
    x.ok ? 1 : 0
  ]);
  if (rows.length) {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    const sh = sheet_();
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

// Liefert pro Tag: Anzahl Aufgaben und Anzahl richtig (optional ?topic=teilbarkeit)
function doGet(e) {
  const topic = (e && e.parameter && e.parameter.topic) || '';
  const values = sheet_().getDataRange().getValues().slice(1);
  const byDay = {};
  values.forEach(r => {
    if (topic && r[2] !== topic) return;
    const day = r[1] instanceof Date ? Utilities.formatDate(r[1], TZ, 'yyyy-MM-dd') : String(r[1]);
    if (!day) return;
    byDay[day] = byDay[day] || { date: day, total: 0, right: 0 };
    byDay[day].total++;
    byDay[day].right += Number(r[5]) || 0;
  });
  const out = Object.keys(byDay).sort().map(k => byDay[k]);
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
