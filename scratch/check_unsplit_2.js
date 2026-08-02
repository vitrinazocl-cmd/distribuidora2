const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('INVENTARIOREAL2026.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log("Checking specific codes:");
    const list = ['CRISLT', 'PISAL', 'WHISBUCH', 'HEX', 'H1', 'SOL650'];
    list.forEach(item => {
        const found = data.filter(r => String(r.CODIGO).includes(item));
        if (found.length > 0) {
            found.forEach(r => console.log(`  ${r.CODIGO} | ${r.DESCRIPCION}`));
        } else {
            console.log(`  ${item} not found`);
        }
    });
} catch (e) {
    console.error("Error:", e.message);
}
