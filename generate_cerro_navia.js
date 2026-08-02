const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const INPUT_FILE = path.join(__dirname, 'Catalogo_Detallado_Eleodoro_Por_Sabor.xlsx');
const OUTPUT_FILE = path.join(__dirname, 'catalogo eleodoro final sucursal cerro navia.xlsx');

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
    console.log(`Leyendo archivo de origen: ${INPUT_FILE}...`);
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Error: No se encontró el archivo ${INPUT_FILE}`);
        process.exit(1);
    }

    const workbook = xlsx.readFile(INPUT_FILE);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`Filas iniciales: ${data.length}`);
    
    // Filtrar excluyendo bebidas alcohólicas
    const filteredRows = data.filter(row => {
        const cat = row['Categoría'] || '';
        return !ALCOHOL_CATEGORIES.includes(cat);
    });

    console.log(`Filas filtradas (sin alcohol): ${filteredRows.length}`);

    // Re-secuenciar ID Interno a partir de 1
    const finalRows = filteredRows.map((row, index) => {
        return {
            ...row,
            'ID Interno': index + 1
        };
    });

    // Crear libro y hoja
    const newWorkbook = xlsx.utils.book_new();
    const newWorksheet = xlsx.utils.json_to_sheet(finalRows);
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Cerro_Navia_Sin_Alcohol');

    // Escribir archivo
    xlsx.writeFile(newWorkbook, OUTPUT_FILE);
    console.log(`¡Archivo guardado con éxito en: ${OUTPUT_FILE}!`);

} catch (error) {
    console.error('Ocurrió un error al procesar el archivo:', error);
}
