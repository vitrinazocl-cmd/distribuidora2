const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('Catalogo_Detallado_Eleodoro.csv final.xlsx');
    console.log("Sheet names:", workbook.SheetNames);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log("Number of rows:", data.length);
    if (data.length > 0) {
        console.log("Columns:", Object.keys(data[0]));
        console.log("First row:", JSON.stringify(data[0], null, 2));
        console.log("Second row:", JSON.stringify(data[1], null, 2));
    }
} catch (e) {
    console.error("Error:", e.message);
}
