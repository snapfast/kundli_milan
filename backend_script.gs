// =========================================================================
// CONFIGURATION
// =========================================================================
const CONFIG = {
  // Replace this string with your actual Google Spreadsheet ID
  SHEET_ID: '1ec2m5XCXeJrZhk78frakz4d_Dru8a5Yyeyqgo8cS7Lo',

  // The name of the tab inside your spreadsheet.
  // The script will automatically create this sheet if it does not exist!
  SHEET_NAME: 'Users'
};

// =========================================================================
// UTILITY FUNCTIONS
// =========================================================================

/**
 * Formats data into a structured JSON response for the API caller
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fetches the target sheet. Dynamically creates it if it doesn't exist.
 */
function getSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  return ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
}

/**
 * Safely parses the incoming JSON data from the request payload
 */
function parseJsonData(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('No post data or contents received');
  }
  return JSON.parse(e.postData.contents);
}

/**
 * Ensures the target sheet has the baseline headers or dynamically appends new incoming keys.
 */
function getHeaders(sheet, incomingData) {
  const lastColumn = sheet.getLastColumn();
  const baselineHeaders = ["uid", "name", "email", "dob", "tob", "gender", "location", "lat", "lon", "currentLocation", "currentLat", "currentLon", "nakshatraIdx", "moonSignIdx", "isMoonManglik", "isLaganManglik", "matches", "nearest", "updatedAt"];

  // Initialize completely empty sheet with baseline headers
  if (lastColumn === 0) {
    sheet.getRange(1, 1, 1, baselineHeaders.length).setValues([baselineHeaders]);
    return baselineHeaders;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];

  // Dynamically catch any unexpected extra parameters passed in payload to prevent data loss
  const incomingKeys = new Set(Object.keys(incomingData));
  const newHeaders = Array.from(incomingKeys).filter(key => !existingHeaders.includes(key));

  if (newHeaders.length > 0) {
    const updatedHeaders = existingHeaders.concat(newHeaders);
    sheet.getRange(1, lastColumn + 1, 1, newHeaders.length).setValues([newHeaders]);
    return updatedHeaders;
  }

  return existingHeaders;
}

/**
 * Converts JSON data object into a flat array matching header columns
 */
function jsonToRow(data, headers) {
  return headers.map(header => {
    if (header === 'updatedAt') return new Date();
    if (header === 'matches') return JSON.stringify(data[header] || []);
    if (header === 'nearest') return JSON.stringify(data[header] || []);
    return data[header] ?? '';
  });
}

/**
 * Formats spreadsheet row data back into clean JSON objects for GET requests
 */
function rowsToJson(values) {
  if (values.length <= 1) return [];
  const [headers, ...rows] = values;
  return rows.map(row =>
    headers.reduce((obj, header, i) => {
      let val = row[i] ?? '';
      // Parse stringified arrays back to standard JSON object structures
      if ((header === 'matches' || header === 'nearest') && typeof val === 'string' && val !== '') {
        try { val = JSON.parse(val); } catch(err) { val = []; }
      }
      obj[header] = val;
      return obj;
    }, {})
  );
}

// =========================================================================
// MAIN API HANDLERS
// =========================================================================

/**
 * Main POST handler - Creates or updates user data
 */
function doPost(e) {
  try {
    const data = parseJsonData(e);

    if (!data.uid) {
      throw new Error('Missing uid');
    }

    const sheet = getSheet();

    // Handle Deletion
    if (data.action === 'delete') {
      const lastRow = sheet.getLastRow();
      if (lastRow <= 1) {
        return jsonResponse({ status: 'success', message: 'Sheet is empty' });
      }

      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const uidIndex = headers.indexOf('uid');
      const searchColumnIndex = uidIndex !== -1 ? uidIndex + 1 : 1;
      const uids = sheet.getRange(1, searchColumnIndex, lastRow, 1).getValues().flat();

      const foundIdx = uids.indexOf(data.uid);
      if (foundIdx > 0) { // 0 is header row
        sheet.deleteRow(foundIdx + 1);
        return jsonResponse({ status: 'success', message: 'User deleted successfully' });
      }
      return jsonResponse({ status: 'success', message: 'User not found or is header' });
    }

    // Handle Upsert
    const headers = getHeaders(sheet, data);
    const rowData = jsonToRow(data, headers);

    const lastRow = sheet.getLastRow();
    let rowIndex = -1;

    if (lastRow > 1) {
      // Find uid column dynamically in case layout shifts
      const uidIndex = headers.indexOf('uid');
      const searchColumnIndex = uidIndex !== -1 ? uidIndex + 1 : 1;
      const uids = sheet.getRange(1, searchColumnIndex, lastRow, 1).getValues().flat();

      const foundIdx = uids.indexOf(data.uid);
      if (foundIdx > 0) { // 0 is header row
        rowIndex = foundIdx + 1; // 1-based index conversion
      }
    }

    if (rowIndex > 1) { // Ensure we never overwrite header
      // Update existing record safely
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
      return jsonResponse({ status: 'success', message: 'User updated successfully' });
    } else {
      // Append brand new profile
      const startRow = lastRow + 1;
      sheet.getRange(startRow, 1, 1, rowData.length).setValues([rowData]);
      return jsonResponse({ status: 'success', message: 'User registered successfully' });
    }

  } catch (error) {
    return jsonResponse({
      status: 'error',
      message: error.message
    });
  }
}

/**
 * Main GET handler - Retrieves all users
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    // If sheet doesn't exist or only has header row, return an empty array gracefully
    if (!sheet || sheet.getLastRow() <= 1) {
      return jsonResponse({
        status: 'success',
        data: [],
        count: 0
      });
    }

    const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
    const data = rowsToJson(values);

    return jsonResponse({
      status: 'success',
      data: data,
      count: data.length
    });

  } catch (error) {
    return jsonResponse({
      status: 'error',
      message: error.message
    });
  }
}
