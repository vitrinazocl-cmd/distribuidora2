const xlsx = require('xlsx');
const path = require('path');

const cnFile = path.join(__dirname, '..', 'catalogo eleodoro final sucursal cerro navia.xlsx');
const lsFile = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

try {
    const cnData = xlsx.utils.sheet_to_json(xlsx.readFile(cnFile).Sheets[xlsx.readFile(cnFile).SheetNames[0]]);
    const lsData = xlsx.utils.sheet_to_json(xlsx.readFile(lsFile).Sheets[xlsx.readFile(lsFile).SheetNames[0]]);
    
    console.log("=== Muestra Cerro Navia ===");
    cnData.slice(0, 5).forEach(r => {
        console.log(`  Name: ${r['Nombre Comercial']} | Pack Price: ${r['Precio Venta ($)']} | Unit Price: ${r['Precio Unitario ($)']}`);
    });
    
    console.log("\n=== Muestra Laguna Sur ===");
    lsData.slice(0, 5).forEach(r => {
        console.log(`  Name: ${r['Nombre Comercial']} | Pack Price: ${r[' Precio Venta ($) ']} | Unit Price: ${r[' Precio Unitario ($) ']}`);
    });
} catch (e) {
    console.error(e);
}
