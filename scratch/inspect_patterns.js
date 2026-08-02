const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('INVENTARIOREAL2026.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log("Searching for codes in INVENTARIOREAL2026 matching some patterns:");
    const patterns = ['LIFE3', 'WATTSD', 'MASC', 'ALOEO', 'AND400'];
    
    patterns.forEach(pat => {
        console.log(`\nPattern: ${pat}`);
        const matches = data.filter(r => String(r.CODIGO).includes(pat));
        if (matches.length > 0) {
            matches.forEach(r => {
                console.log(`  ${r.CODIGO} | ${r.DESCRIPCION} | Stock: ${r.stock}`);
            });
        } else {
            console.log("  No matches found");
        }
    });
} catch (e) {
    console.error("Error:", e.message);
}
