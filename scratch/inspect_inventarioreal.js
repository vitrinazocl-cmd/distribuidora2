const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('INVENTARIOREAL2026.xlsx');
    console.log("Sheet names:", workbook.SheetNames);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log("Number of rows in INVENTARIOREAL2026:", data.length);
    if (data.length > 0) {
        console.log("Columns:", Object.keys(data[0]));
        console.log("First 3 rows:\n", JSON.stringify(data.slice(0, 3), null, 2));
    }
} catch (e) {
    console.error("Error:", e.message);
}
