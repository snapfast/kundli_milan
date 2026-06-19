var SHEET_NAME = "Users";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  var headers = ["uid", "name", "email", "dob", "tob", "gender", "location", "lat", "lon", "nakshatraIdx", "moonSignIdx", "isManglik", "matches", "updatedAt"];

  // Initialize headers if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Invalid JSON"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var uid = data.uid;
  if (!uid) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Missing uid"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var rows = sheet.getDataRange().getValues();
  var uidColumnIndex = 0; // Assuming uid is in column A
  var rowIndex = -1;

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][uidColumnIndex] == uid) {
      rowIndex = i + 1;
      break;
    }
  }

  var rowData = [
    data.uid || "",
    data.name || "",
    data.email || "",
    data.dob || "",
    data.tob || "",
    data.gender || "",
    data.location || "",
    data.lat || "",
    data.lon || "",
    data.nakshatraIdx !== undefined ? data.nakshatraIdx : "",
    data.moonSignIdx !== undefined ? data.moonSignIdx : "",
    data.isManglik !== undefined ? data.isManglik : "",
    JSON.stringify(data.matches || []),
    new Date()
  ];

  if (rowIndex > -1) {
    // Update existing row
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    // Append new row
    sheet.appendRow(rowData);
  }

  return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({"status": "success", "data": [], "count": 0}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var data = [];

  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = rows[i][j];
      if (headers[j] === 'matches') {
        try {
          val = JSON.parse(val);
        } catch (e) {
          val = [];
        }
      }
      obj[headers[j]] = val;
    }
    data.push(obj);
  }

  return ContentService.createTextOutput(JSON.stringify({"status": "success", "data": data, "count": data.length}))
    .setMimeType(ContentService.MimeType.JSON);
}
