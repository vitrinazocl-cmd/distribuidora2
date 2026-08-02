const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

try {
    console.log("Inspeccionando:", FILE_PATH);
    if (!fs.existsSync(FILE_PATH)) {
        console.error("Error: El archivo no existe!");
        process.exit(1);
    }
    const workbook = xlsx.readFile(FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log("Número total de filas:", data.length);
    if (data.length > 0) {
        console.log("Columnas:", Object.keys(data[0]));
        console.log("Primeras 2 filas:\n", JSON.stringify(data.slice(0, 2), null, 2));
    }
} catch (e) {
    console.error("Error:", e.message);
}
