const xlsx = require('xlsx');
const path = require('path');

const cnFile = path.join(__dirname, '..', 'catalogo eleodoro final sucursal cerro navia.xlsx');
const lsFile = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

try {
    const cnData = xlsx.utils.sheet_to_json(xlsx.readFile(cnFile).Sheets[xlsx.readFile(cnFile).SheetNames[0]]);
    const lsData = xlsx.utils.sheet_to_json(xlsx.readFile(lsFile).Sheets[xlsx.readFile(lsFile).SheetNames[0]]);
    
    console.log("=== Muestra Cerro Navia (con columnas normalizadas) ===");
    cnData.slice(0, 5).forEach(r => {
        console.log(`  Name: ${r['Nombre Comercial']} | Pack Price: ${r[' Precio Venta ($) ']} | Unit Price: ${r[' Precio Unitario ($) ']}`);
    });
    
    console.log("\n=== Muestra Laguna Sur (con columnas normalizadas) ===");
    lsData.slice(0, 5).forEach(r => {
        console.log(`  Name: ${r['Nombre Comercial']} | Pack Price: ${r[' Precio Venta ($) ']} | Unit Price: ${r[' Precio Unitario ($) ']}`);
    });
    
    // Verificamos los nuevos productos también
    console.log("\n=== Nuevos productos en Cerro Navia ===");
    const cnNew = cnData.filter(r => String(r['Código Producto']).startsWith('BIGCOLA473') || String(r['Código Producto']).startsWith('ALOE15'));
    cnNew.forEach(r => {
        console.log(`  Code: ${r['Código Producto']} | Name: ${r['Nombre Comercial']} | Pack Price: ${r[' Precio Venta ($) ']} | Unit Price: ${r[' Precio Unitario ($) ']}`);
    });
    
    console.log("\n=== Nuevos productos en Laguna Sur ===");
    const lsNew = lsData.filter(r => String(r['Código Producto']).startsWith('BIGCOLA473') || String(r['Código Producto']).startsWith('ALOE15'));
    lsNew.forEach(r => {
        console.log(`  Code: ${r['Código Producto']} | Name: ${r['Nombre Comercial']} | Pack Price: ${r[' Precio Venta ($) ']} | Unit Price: ${r[' Precio Unitario ($) ']}`);
    });
    
} catch (e) {
    console.error(e);
}
