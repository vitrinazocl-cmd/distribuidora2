const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const cnFile = path.join(__dirname, '..', 'catalogo eleodoro final sucursal cerro navia.xlsx');

try {
    const workbook = xlsx.readFile(cnFile);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    console.log("Headers in Cerro Navia:", Object.keys(data[0]));
    console.log("First row in Cerro Navia:\n", JSON.stringify(data[0], null, 2));
} catch (e) {
    console.error(e);
}
