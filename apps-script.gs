// Paste this whole file into Extensions → Apps Script of your Google Sheet.
// See README.md for the deploy steps.

// Optional: set a code that members must type once before they can edit,
// e.g. const PASSCODE = 'pole2026';  Leave '' to let anyone with the link edit.
const PASSCODE = '';

const COLUMNS = ['id', 'month', 'pole', 'week', 'text'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('events');
  if (!sh) {
    sh = ss.insertSheet('events');
    sh.appendRow(COLUMNS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// The ' prefix stores values as plain text, so "2026-10" isn't turned into a date
// and an event starting with "=" isn't treated as a formula.
const asText_ = v => "'" + String(v);

// GET → every event
function doGet() {
  const rows = sheet_().getDataRange().getDisplayValues().slice(1);
  const events = rows
    .filter(r => r[0])
    .map(r => ({ id: r[0], month: r[1], pole: r[2], week: Number(r[3]), text: r[4] }));
  return json_({ events });
}

// POST → add / update / delete one event
function doPost(e) {
  const b = JSON.parse(e.postData.contents);
  if (PASSCODE && b.code !== PASSCODE) return json_({ error: 'wrong code' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();

    if (b.action === 'add') {
      const text = String(b.text || '').trim().slice(0, 300);
      if (!text) return json_({ error: 'empty event' });
      const id = Utilities.getUuid();
      sh.appendRow([id, asText_(b.month), asText_(b.pole), Number(b.week), asText_(text)]);
      return json_({ ok: true, id });
    }

    const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getDisplayValues().map(r => r[0]);
    const row = ids.indexOf(String(b.id)) + 1;
    if (row < 2) return json_({ error: 'event not found, refresh the page' });

    if (b.action === 'update') {
      sh.getRange(row, 5).setValue(asText_(String(b.text).trim().slice(0, 300)));
    } else if (b.action === 'delete') {
      sh.deleteRow(row);
    } else {
      return json_({ error: 'unknown action' });
    }
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
