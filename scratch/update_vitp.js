const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const cnFile = path.join(__dirname, '..', 'catalogo eleodoro final sucursal cerro navia.xlsx');
const lsFile = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

function updateVitpInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    let updated = false;
    const updatedData = data.map(r => {
        if (String(r['Código Producto']).startsWith('VITP')) {
            r[' Precio Venta ($) '] = 8280;
            r[' Precio Costo ($) '] = 6133;
            r[' Precio Unitario ($) '] = 1380;
            updated = true;
        }
        return r;
    });
    
    if (updated) {
        workbook.Sheets[sheetName] = xlsx.utils.json_to_sheet(updatedData);
        xlsx.writeFile(workbook, filePath);
        console.log(`Actualizado VITP en: ${filePath}`);
    }
}

try {
    updateVitpInFile(cnFile);
    updateVitpInFile(lsFile);
    console.log("¡Precio de VITP actualizado con éxito!");
} catch (e) {
    console.error(e);
}
