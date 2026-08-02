const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, '..', 'CATALOGO ELEODORO JUNIO 26 ia FINAL.xlsx');

try {
    const workbook = xlsx.readFile(FILE_PATH);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const groups = new Set(data.map(r => r['GRUPO']));
    console.log("Grupos únicos en CATALOGO ELEODORO JUNIO 26 ia FINAL:", Array.from(groups));
} catch (e) {
    console.error("Error:", e.message);
}
