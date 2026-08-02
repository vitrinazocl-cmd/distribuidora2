const xlsx = require('xlsx');
const path = require('path');

const cnFile = path.join(__dirname, '..', 'catalogo eleodoro final sucursal cerro navia.xlsx');
const lsFile = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

try {
    const cnData = xlsx.utils.sheet_to_json(xlsx.readFile(cnFile).Sheets[xlsx.readFile(cnFile).SheetNames[0]]);
    const lsData = xlsx.utils.sheet_to_json(xlsx.readFile(lsFile).Sheets[xlsx.readFile(lsFile).SheetNames[0]]);
    
    console.log("VITP en Cerro Navia:");
    cnData.filter(r => String(r['Código Producto']).startsWith('VITP')).forEach(r => {
        console.log(`  Code: ${r['Código Producto']} | Sale Price: ${r[' Precio Venta ($) ']} | Cost Price: ${r[' Precio Costo ($) ']}`);
    });
    
    console.log("VITP en Laguna Sur:");
    lsData.filter(r => String(r['Código Producto']).startsWith('VITP')).forEach(r => {
        console.log(`  Code: ${r['Código Producto']} | Sale Price: ${r[' Precio Venta ($) ']} | Cost Price: ${r[' Precio Costo ($) ']}`);
    });
} catch (e) {
    console.error(e);
}
