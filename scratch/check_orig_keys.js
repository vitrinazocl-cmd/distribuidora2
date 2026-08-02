const xlsx = require('xlsx');
const path = require('path');

const originalFile = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro.csv final.xlsx');

try {
    const workbook = xlsx.readFile(originalFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log("Original File First Row Keys:");
    Object.keys(data[0]).forEach(k => console.log(`"${k}"`));
} catch (e) {
    console.error(e);
}
