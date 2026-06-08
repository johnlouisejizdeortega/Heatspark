// ============================================================
// Auld Lead Tracker — Google Apps Script
// Deploy as: Web App → Execute as: Me → Who has access: Anyone
// ============================================================

var SHEET_NAME  = 'Sheet1';
var SECRET_KEY  = 'auld-secret-2026'; // must match GOOGLE_SHEETS_SECRET in Laravel .env

// ------------------------------------------------------------
// Receives POST from Laravel → appends row to Google Sheet
// ------------------------------------------------------------
function doPost(e) {
  try {
    // Guard: ensure postData exists
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'No POST body received' });
    }

    var raw  = e.postData.contents;
    var data = JSON.parse(raw);

    // Validate secret
    if (data.secret !== SECRET_KEY) {
      return jsonResponse({ success: false, error: 'Unauthorised' }, 403);
    }

    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ success: false, error: 'Sheet not found: ' + SHEET_NAME }, 500);
    }

    // Format timestamp to readable date/time
    var date = data.timestamp
      ? Utilities.formatDate(new Date(data.timestamp), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')
      : Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

    // Append row — columns must match Sheet1 headers:
    // Date | Full Name | Email Address | Phone Number | Postcode
    sheet.appendRow([
      date,
      data.name     || '',
      data.email    || '',
      data.phone    || '',
      data.postcode || ''
    ]);

    return jsonResponse({ success: true });

  } catch (err) {
    Logger.log('Error in doPost: ' + err.message);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

// ------------------------------------------------------------
// GET handler — health check
// ------------------------------------------------------------
function doGet(e) {
  return jsonResponse({ status: 'Auld Lead Tracker webhook is live.' });
}

// ------------------------------------------------------------
// Helper — returns a JSON ContentService response
// ------------------------------------------------------------
function jsonResponse(obj, statusCode) {
  var output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
