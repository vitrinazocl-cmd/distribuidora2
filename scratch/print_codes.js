const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('INVENTARIOREAL2026.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log("First 30 codes in INVENTARIOREAL2026:");
    data.slice(0, 30).forEach(r => {
        console.log(`  ${r.CODIGO} | ${r.DESCRIPCION}`);
    });
} catch (e) {
    console.error("Error:", e.message);
}
