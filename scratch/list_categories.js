const xlsx = require('xlsx');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor.xlsx');

try {
    const workbook = xlsx.readFile(FILE_PATH);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const categories = new Set(data.map(r => r['Categoría']));
    console.log("Categorías encontradas:", Array.from(categories));
} catch (e) {
    console.error("Error:", e.message);
}
