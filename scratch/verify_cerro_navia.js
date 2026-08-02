const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, '..', 'catalogo eleodoro final sucursal cerro navia.xlsx');

const ALCOHOL_CATEGORIES = [
    'Cervezas',
    'Licores y Destilados',
    'Gin',
    'Pisco',
    'Ron',
    'Vinos y Espumantes',
    'Whisky'
];

try {
    console.log("Verificando el archivo generado para Cerro Navia:", FILE_PATH);
    if (!fs.existsSync(FILE_PATH)) {
        console.error("Error: El archivo no existe!");
        process.exit(1);
    }
    
    const workbook = xlsx.readFile(FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Número total de filas generadas: ${data.length}`);
    
    // Verificar que ninguna fila tenga categoría con alcohol
    const alcoholRows = data.filter(r => ALCOHOL_CATEGORIES.includes(r['Categoría']));
    console.log(`Bebidas alcohólicas encontradas en el archivo: ${alcoholRows.length}`);
    if (alcoholRows.length > 0) {
        console.error("Error: Se encontraron bebidas alcohólicas!", alcoholRows.slice(0, 5));
    } else {
        console.log("✓ OK: No se encontraron bebidas alcohólicas.");
    }
    
    // Verificar IDs secuenciales
    const ids = data.map(r => r['ID Interno']);
    const isSequential = ids.every((val, i) => val === i + 1);
    console.log("IDs secuenciales de 1 a N:", isSequential ? "✓ OK" : "✗ Error en la secuencia");
    
    // Mostrar algunas categorías para confirmar
    const categories = new Set(data.map(r => r['Categoría']));
    console.log("Categorías restantes:", Array.from(categories));

} catch (e) {
    console.error("Error al verificar:", e.message);
}
