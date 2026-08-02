const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const HOJAS_FILE = path.join(__dirname, 'Catalogo_Eleodoro_Hojas_Escritas.xlsx');
const CERRO_NAVIA_FILE = path.join(__dirname, 'catalogo eleodoro final sucursal cerro navia.xlsx');
const LAGUNA_SUR_FILE = path.join(__dirname, 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

const newProductBases = [
    'BIGCOLA473',
    'BIGUVA17',
    'ALOE15',
    'SCOREW473',
    'ZOOM12',
    'EXPRESS24',
    'POWA850',
    'MINI250'
];

function isNewProductRow(row) {
    const code = String(row['Código Producto'] || '');
    return newProductBases.some(base => code.startsWith(base));
}

try {
    // 1. Leer los productos nuevos de las hojas escritas
    console.log(`Leyendo productos nuevos de: ${HOJAS_FILE}...`);
    if (!fs.existsSync(HOJAS_FILE)) {
        console.error("Error: El archivo de hojas escritas no existe.");
        process.exit(1);
    }
    const hojasWorkbook = xlsx.readFile(HOJAS_FILE);
    const hojasData = xlsx.utils.sheet_to_json(hojasWorkbook.Sheets[hojasWorkbook.SheetNames[0]]);
    const newProductRows = hojasData.filter(isNewProductRow);
    console.log(`Encontradas ${newProductRows.length} filas de nuevos productos.`);

    // 2. Procesar sucursal Cerro Navia
    if (fs.existsSync(CERRO_NAVIA_FILE)) {
        console.log(`\nProcesando archivo de Cerro Navia: ${CERRO_NAVIA_FILE}...`);
        const cnWorkbook = xlsx.readFile(CERRO_NAVIA_FILE);
        const cnSheetName = cnWorkbook.SheetNames[0];
        const cnSheet = cnWorkbook.Sheets[cnSheetName];
        let cnData = xlsx.utils.sheet_to_json(cnSheet);
        console.log(`Filas originales en Cerro Navia: ${cnData.length}`);

        // Filtrar para evitar duplicados si ya existen
        const existingCodes = new Set(cnData.map(r => String(r['Código Producto'])));
        const rowsToAdd = newProductRows.filter(r => !existingCodes.has(String(r['Código Producto'])));
        console.log(`Filas nuevas a agregar a Cerro Navia: ${rowsToAdd.length}`);

        if (rowsToAdd.length > 0) {
            // Unir y re-secuenciar IDs
            cnData = cnData.concat(rowsToAdd);
            cnData.forEach((row, index) => {
                row['ID Interno'] = index + 1;
            });

            const newCnSheet = xlsx.utils.json_to_sheet(cnData);
            cnWorkbook.Sheets[cnSheetName] = newCnSheet;
            xlsx.writeFile(cnWorkbook, CERRO_NAVIA_FILE);
            console.log(`Cerro Navia guardado correctamente. Nuevas filas totales: ${cnData.length}`);
        } else {
            console.log("No hay filas nuevas que agregar a Cerro Navia (ya existen).");
        }
    } else {
        console.warn(`Advertencia: No se encontró el archivo ${CERRO_NAVIA_FILE}`);
    }

    // 3. Procesar sucursal Laguna Sur
    if (fs.existsSync(LAGUNA_SUR_FILE)) {
        console.log(`\nProcesando archivo de Laguna Sur: ${LAGUNA_SUR_FILE}...`);
        const lsWorkbook = xlsx.readFile(LAGUNA_SUR_FILE);
        const lsSheetName = lsWorkbook.SheetNames[0];
        const lsSheet = lsWorkbook.Sheets[lsSheetName];
        let lsData = xlsx.utils.sheet_to_json(lsSheet);
        console.log(`Filas originales en Laguna Sur: ${lsData.length}`);

        // Obtener headers de Laguna Sur para mapear correctamente
        const firstRow = lsData[0] || {};
        const costHeader = Object.keys(firstRow).find(k => k.trim() === 'Precio Costo ($)') || 'Precio Costo ($)';
        const saleHeader = Object.keys(firstRow).find(k => k.trim() === 'Precio Venta ($)') || 'Precio Venta ($)';

        // Filtrar para evitar duplicados
        const existingCodes = new Set(lsData.map(r => String(r['Código Producto'])));
        const rowsToAdd = newProductRows.filter(r => !existingCodes.has(String(r['Código Producto'])));
        console.log(`Filas nuevas a agregar a Laguna Sur: ${rowsToAdd.length}`);

        if (rowsToAdd.length > 0) {
            // Mapear los nombres de columnas con espacios
            const mappedRowsToAdd = rowsToAdd.map(row => {
                const mappedRow = { ...row };
                if (costHeader !== 'Precio Costo ($)') {
                    mappedRow[costHeader] = row['Precio Costo ($)'];
                    delete mappedRow['Precio Costo ($)'];
                }
                if (saleHeader !== 'Precio Venta ($)') {
                    mappedRow[saleHeader] = row['Precio Venta ($)'];
                    delete mappedRow['Precio Venta ($)'];
                }
                return mappedRow;
            });

            lsData = lsData.concat(mappedRowsToAdd);
            lsData.forEach((row, index) => {
                row['ID Interno'] = index + 1;
            });

            const newLsSheet = xlsx.utils.json_to_sheet(lsData);
            lsWorkbook.Sheets[lsSheetName] = newLsSheet;
            xlsx.writeFile(lsWorkbook, LAGUNA_SUR_FILE);
            console.log(`Laguna Sur guardado correctamente. Nuevas filas totales: ${lsData.length}`);
        } else {
            console.log("No hay filas nuevas que agregar a Laguna Sur (ya existen).");
        }
    } else {
        console.warn(`Advertencia: No se encontró el archivo ${LAGUNA_SUR_FILE}`);
    }

    console.log("\nProceso completado con éxito.");

} catch (error) {
    console.error("Error al añadir productos:", error);
}
