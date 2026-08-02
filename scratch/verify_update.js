const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const CERRO_NAVIA_FILE = path.join(__dirname, '..', 'catalogo eleodoro final sucursal cerro navia.xlsx');
const LAGUNA_SUR_FILE = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

try {
    console.log("Verificando archivos actualizados:");
    
    // Cerro Navia
    if (fs.existsSync(CERRO_NAVIA_FILE)) {
        const cnWorkbook = xlsx.readFile(CERRO_NAVIA_FILE);
        const data = xlsx.utils.sheet_to_json(cnWorkbook.Sheets[cnWorkbook.SheetNames[0]]);
        console.log(`\nCerro Navia - Total Filas: ${data.length}`);
        // Verificar que no tenga alcohol
        const alcohol = data.filter(r => ['Cervezas', 'Licores y Destilados', 'Gin', 'Pisco', 'Ron', 'Vinos y Espumantes', 'Whisky'].includes(r['Categoría']));
        console.log(`  Bebidas alcohólicas encontradas: ${alcohol.length}`);
        // Verificar que contenga los nuevos productos
        const newItems = data.filter(r => String(r['Código Producto']).startsWith('BIGCOLA473') || String(r['Código Producto']).startsWith('ALOE15'));
        console.log(`  Nuevos productos en Cerro Navia: ${newItems.length} filas`);
    }

    // Laguna Sur
    if (fs.existsSync(LAGUNA_SUR_FILE)) {
        const lsWorkbook = xlsx.readFile(LAGUNA_SUR_FILE);
        const data = xlsx.utils.sheet_to_json(lsWorkbook.Sheets[lsWorkbook.SheetNames[0]]);
        console.log(`\nLaguna Sur - Total Filas: ${data.length}`);
        // Verificar que contenga los nuevos productos
        const newItems = data.filter(r => String(r['Código Producto']).startsWith('BIGCOLA473') || String(r['Código Producto']).startsWith('ALOE15'));
        console.log(`  Nuevos productos en Laguna Sur: ${newItems.length} filas`);
        
        // Mostrar ejemplo de fila de Laguna Sur para ver que los headers con espacios se conservaron correctamente
        console.log("  Headers en Laguna Sur:", Object.keys(data[0]));
    }

} catch (e) {
    console.error("Error al verificar:", e.message);
}
