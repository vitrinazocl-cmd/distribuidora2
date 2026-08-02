const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, '..', 'Catalogo_Eleodoro_Hojas_Escritas.xlsx');

try {
    console.log("Verificando el archivo compilado desde las hojas manuscritas:", FILE_PATH);
    if (!fs.existsSync(FILE_PATH)) {
        console.error("Error: El archivo no existe!");
        process.exit(1);
    }
    
    const workbook = xlsx.readFile(FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Número total de filas generadas: ${data.length}`);
    console.log("\nPrimeras 5 filas:");
    console.log(JSON.stringify(data.slice(0, 5), null, 2));

    // Verificar unicidad de ID Interno, Código Producto y SKU
    const ids = data.map(r => r['ID Interno']);
    const codes = data.map(r => r['Código Producto']);
    const skus = data.map(r => r['SKU']);
    
    console.log("\nUnicidad:");
    console.log("  IDs únicos:", new Set(ids).size === ids.length ? "✓ OK" : "✗ Duplicados encontrados");
    console.log("  Códigos únicos:", new Set(codes).size === codes.length ? "✓ OK" : "✗ Duplicados encontrados");
    console.log("  SKUs únicos:", new Set(skus).size === skus.length ? "✓ OK" : "✗ Duplicados encontrados");
    
    // Verificar si se crearon los nuevos productos correctamente
    console.log("\nEjemplo de productos nuevos:");
    const newItemsCodes = ['BIGCOLA473', 'BIGUVA17', 'ALOE15', 'SCOREW473', 'ZOOM12', 'EXPRESS24', 'POWA850', 'MINI250'];
    newItemsCodes.forEach(code => {
        const found = data.filter(r => String(r['Código Producto']).startsWith(code));
        if (found.length > 0) {
            console.log(`  Encontrado nuevo producto para ${code} (filas: ${found.length}):`);
            found.forEach(r => console.log(`    Code: ${r['Código Producto']} | Name: ${r['Nombre Comercial']} | SKU: ${r['SKU']} | Price: ${r['Precio Venta ($)']} | Stock: ${r['Stock Actual']}`));
        } else {
            console.log(`  ✗ Error: Producto ${code} no encontrado`);
        }
    });

} catch (e) {
    console.error("Error al verificar:", e.message);
}
