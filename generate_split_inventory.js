const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const INPUT_FILE = path.join(__dirname, 'Catalogo_Detallado_Eleodoro.csv final.xlsx');
const OUTPUT_FILE = path.join(__dirname, 'Catalogo_Detallado_Eleodoro_Por_Sabor.xlsx');

function parseFlavors(desc) {
    if (!desc) return [];
    const match = desc.match(/Sabores\/Variaciones:\s*(.*)/i);
    if (!match) return [];
    
    let flavorStr = match[1].trim();
    if (flavorStr.endsWith('.')) {
        flavorStr = flavorStr.slice(0, -1);
    }
    
    if (flavorStr.toLowerCase() === 'ninguno' || flavorStr.toLowerCase() === 'ninguna') {
        return [];
    }
    
    // Split by comma and clean
    const flavors = flavorStr.split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);
        
    return flavors;
}

try {
    console.log(`Leyendo archivo original: ${INPUT_FILE}...`);
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Error: No se encontró el archivo ${INPUT_FILE}`);
        process.exit(1);
    }

    const workbook = xlsx.readFile(INPUT_FILE);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log(`Procesando ${data.length} filas originales...`);
    const newRows = [];
    let idCounter = 1;

    data.forEach((row, index) => {
        const desc = row['Descripción Detallada'] || '';
        const flavors = parseFlavors(desc);

        if (flavors.length > 1) {
            // El producto tiene múltiples sabores, creamos una fila para cada sabor
            flavors.forEach((flavor, fIndex) => {
                const flavorNum = String(fIndex + 1).padStart(2, '0');
                const newCode = `${row['Código Producto']}-${flavorNum}`;
                const newSku = `SKU-${newCode}`;
                
                // Formateamos el Nombre Comercial agregando el sabor al final
                const newName = `${row['Nombre Comercial']} - ${flavor}`;
                
                // Dividimos el stock de forma equitativa (Opción A)
                const originalStock = parseFloat(row['Stock Actual']);
                let newStock = 0;
                if (!isNaN(originalStock) && originalStock > 0) {
                    // Dividimos y redondeamos
                    newStock = Math.round(originalStock / flavors.length);
                }

                // Creamos una nueva descripción donde se especifica el sabor único
                let newDesc = desc;
                // Reemplazamos la sección de Sabores/Variaciones para que muestre solo este sabor
                if (desc.includes('Sabores/Variaciones:')) {
                    newDesc = desc.replace(/Sabores\/Variaciones:\s*(.*)/i, `Sabor/Variación: ${flavor}.`);
                }

                const newRow = {
                    ...row,
                    'ID Interno': idCounter++,
                    'Código Producto': newCode,
                    'SKU': newSku,
                    'Nombre Comercial': newName,
                    'Stock Actual': newStock,
                    'Descripción Detallada': newDesc
                };
                newRows.push(newRow);
            });
        } else {
            // Producto no tiene sabores o tiene solo 1, se queda en una sola fila
            const flavor = flavors.length === 1 ? flavors[0] : null;
            let newCode = row['Código Producto'];
            let newSku = row['SKU'];
            let newName = row['Nombre Comercial'];
            let newDesc = desc;

            // Si tiene 1 sabor que no sea genérico, podemos agregarlo o dejarlo como está.
            // Para mantener consistencia con los productos no divididos (por ejemplo NEST15 con sabor Ninguno),
            // lo dejamos con su código original, pero si tiene un sabor específico (ej: "2GRADO" o "ORIGINAL"),
            // lo dejamos igual ya que no se divide en múltiples variaciones.
            
            const newRow = {
                ...row,
                'ID Interno': idCounter++,
                'Código Producto': newCode,
                'SKU': newSku,
                'Nombre Comercial': newName,
                'Stock Actual': row['Stock Actual'], // Mantenemos el stock original
                'Descripción Detallada': newDesc
            };
            newRows.push(newRow);
        }
    });

    console.log(`Generación completada. Total filas nuevas: ${newRows.length}`);
    
    // Crear un nuevo libro de Excel y hoja
    const newWorkbook = xlsx.utils.book_new();
    const newWorksheet = xlsx.utils.json_to_sheet(newRows);
    
    // Añadir la hoja al libro
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Catalogo_Separado');
    
    // Escribir el archivo
    xlsx.writeFile(newWorkbook, OUTPUT_FILE);
    console.log(`¡Archivo guardado con éxito en: ${OUTPUT_FILE}!`);

} catch (error) {
    console.error('Ocurrió un error al procesar el archivo:', error);
}
