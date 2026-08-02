const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor.xlsx');

try {
    console.log("Verificando el archivo generado:", FILE_PATH);
    if (!fs.existsSync(FILE_PATH)) {
        console.error("Error: El archivo no existe!");
        process.exit(1);
    }
    
    const workbook = xlsx.readFile(FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Número total de filas generadas: ${data.length}`);
    console.log("Primeras 3 filas:");
    console.log(JSON.stringify(data.slice(0, 3), null, 2));
    
    // Verificar unicidad de ID Interno, Código Producto y SKU
    const ids = data.map(r => r['ID Interno']);
    const codes = data.map(r => r['Código Producto']);
    const skus = data.map(r => r['SKU']);
    
    console.log("\nUnicidad:");
    console.log("  IDs únicos:", new Set(ids).size === ids.length ? "✓ OK" : "✗ Duplicados encontrados");
    console.log("  Códigos únicos:", new Set(codes).size === codes.length ? "✓ OK" : "✗ Duplicados encontrados");
    console.log("  SKUs únicos:", new Set(skus).size === skus.length ? "✓ OK" : "✗ Duplicados encontrados");
    
    // Mostrar algunos productos divididos
    console.log("\nEjemplo de división de LIFE3:");
    const lifeRows = data.filter(r => String(r['Código Producto']).startsWith('LIFE3'));
    lifeRows.forEach(r => console.log(`  Code: ${r['Código Producto']} | Name: ${r['Nombre Comercial']} | SKU: ${r['SKU']} | Stock: ${r['Stock Actual']}`));
    
    console.log("\nEjemplo de división de WATTSD:");
    const wattsRows = data.filter(r => String(r['Código Producto']).startsWith('WATTSD'));
    wattsRows.forEach(r => console.log(`  Code: ${r['Código Producto']} | Name: ${r['Nombre Comercial']} | SKU: ${r['SKU']} | Stock: ${r['Stock Actual']}`));

} catch (e) {
    console.error("Error al verificar:", e.message);
}
