// Gemeinsame Einstellungen für alle Übungs-Apps.
// statsUrl: Web-App-URL des Apps Scripts (endet auf /exec). Leer = keine Statistik.
window.HA_CONFIG = {
  statsUrl: ""
};

// Speichert Antworten zuerst lokal und schickt sie gesammelt ans Google Sheet.
// Ohne Internet bleiben sie gespeichert und werden später nachgeschickt.
window.HA_STATS = (function () {
  const KEY = "ha-queue";
  let timer = null;
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const write = q => { try { localStorage.setItem(KEY, JSON.stringify(q)); } catch (e) {} };
  const today = () => new Date().toLocaleDateString("sv-SE"); // yyyy-mm-dd, lokale Zeit

  async function flush() {
    const url = window.HA_CONFIG.statsUrl;
    const q = read();
    if (!url || !q.length) return;
    try {
      // text/plain + no-cors: so akzeptiert Google Apps Script den Aufruf ohne Vorab-Prüfung
      await fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" },
                         body: JSON.stringify({ items: q }) });
      write(read().slice(q.length));
    } catch (e) { /* offline: später erneut */ }
  }

  function log(topic, mode, task, ok) {
    if (!window.HA_CONFIG.statsUrl) return;
    const q = read();
    q.push({ ts: Date.now(), date: today(), topic, mode, task, ok: !!ok });
    write(q);
    clearTimeout(timer);
    timer = setTimeout(flush, 3000);
  }

  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("online", flush);
  setTimeout(flush, 1000);
  return { log, flush };
})();
