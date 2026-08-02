const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelFile = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');
const originalJsFile = path.join(__dirname, '..', 'catalogo.js');
const outputJsFile = path.join(__dirname, '..', 'catalogo.js');
const catalogoDir = path.join(__dirname, '..', 'catalogo');

try {
    // 1. Cargar las categorías del catalogo.js original
    let originalProducts = [];
    if (fs.existsSync(originalJsFile)) {
        const originalContent = fs.readFileSync(originalJsFile, 'utf8');
        // Evaluar temporalmente el contenido para extraer la variable
        const evalEnv = {};
        const runContent = originalContent.replace('const catalogoProductos =', 'evalEnv.catalogoProductos =');
        try {
            eval(runContent);
            originalProducts = evalEnv.catalogoProductos || [];
        } catch (e) {
            console.warn("No se pudo evaluar catalogo.js original, se usará mapeo alternativo:", e.message);
        }
    }

    const categoryMap = {};
    originalProducts.forEach(p => {
        if (p && p.id) {
            categoryMap[p.id.toUpperCase()] = p.category;
        }
    });

    // Categorías manuales de respaldo para nuevos productos
    const manualCategories = {
        'BIGCOLA473': 'BEBIDAS',
        'BIGUVA17': 'BEBIDAS',
        'ALOE15': 'BEBIDAS',
        'SCOREW473': 'ENERGÉTICAS',
        'ZOOM12': 'ENERGÉTICAS',
        'EXPRESS24': 'BEBIDAS',
        'POWA850': 'BEBIDAS',
        'MINI250': 'BEBIDAS'
    };

    // 2. Leer archivo de Laguna Sur (339 filas)
    if (!fs.existsSync(excelFile)) {
        console.error("No existe el archivo de Laguna Sur:", excelFile);
        process.exit(1);
    }

    const workbook = xlsx.readFile(excelFile);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

    console.log(`Leídas ${rows.length} filas de Laguna Sur.`);

    // 3. Procesar cada fila
    const webProducts = [];

    rows.forEach(r => {
        const id = String(r['Código Producto'] || "").trim();
        if (!id) return;

        const name = String(r['Nombre Comercial'] || "").trim();
        const baseCode = id.includes('-') ? id.split('-')[0] : id;

        // Determinar precio
        let price = 0;
        if (r[' Precio Venta ($) '] !== undefined && r[' Precio Venta ($) '] !== "") {
            price = parseInt(r[' Precio Venta ($) ']) || 0;
        } else if (r['Precio Venta ($)'] !== undefined && r['Precio Venta ($)'] !== "") {
            price = parseInt(r['Precio Venta ($)']) || 0;
        }

        // Determinar categoría
        let category = categoryMap[baseCode.toUpperCase()];
        if (!category) {
            category = manualCategories[baseCode.toUpperCase()];
        }
        if (!category) {
            // Regla de respaldo
            const descUpper = name.toUpperCase();
            if (descUpper.match(/AGUA|CACHANTUN|BENECDITINO|VITAL/)) category = 'AGUA';
            else if (descUpper.match(/CERVEZA|CRISTAL|ESCUDO|ROYAL|CORONA|BAVARIA|SOL|HEINEKEN|KUNSTMANN/)) category = 'CERVEZA';
            else if (descUpper.match(/PISCO|WHISKY|RON|VODKA|GIN|TEQUILA|ESPUMANTE|ALTO DEL CARMEN|MISTRAL/)) category = 'LICORES';
            else if (descUpper.match(/RED BULL|MONSTER|SCORE|ENERGY|ZOOM/)) category = 'ENERGÉTICAS';
            else category = 'BEBIDAS';
        }

        // Determinar ruta de imagen
        let imageLocalPath = `catalogo/${baseCode}.webp`;
        if (!fs.existsSync(path.join(__dirname, '..', imageLocalPath))) {
            // Intentar con .jpg
            const jpgPath = `catalogo/${baseCode}.jpg`;
            if (fs.existsSync(path.join(__dirname, '..', jpgPath))) {
                imageLocalPath = jpgPath;
            } else {
                // Intentar con .jpeg
                const jpegPath = `catalogo/${baseCode}.jpeg`;
                if (fs.existsSync(path.join(__dirname, '..', jpegPath))) {
                    imageLocalPath = jpegPath;
                } else {
                    // Fallback a la columna del Excel (quitando el slash inicial si existe)
                    let excelImg = String(r['Ruta Imagen'] || "").trim();
                    if (excelImg.startsWith('/')) excelImg = excelImg.substring(1);
                    imageLocalPath = excelImg || 'logo.jpg.jpeg';
                }
            }
        }

        webProducts.push({
            id: id,
            name: name,
            price: price,
            category: category,
            image: imageLocalPath
        });
    });

    // 4. Escribir catalogo.js
    const jsContent = `const catalogoProductos = [\n${webProducts.map(p => 
        `  { id: '${p.id}', name: "${p.name}", price: ${p.price}, category: "${p.category}", image: "${p.image}" }`
    ).join(',\n')}\n];\n`;

    fs.writeFileSync(outputJsFile, jsContent, 'utf8');
    console.log(`¡Exito! catalogo.js generado correctamente con ${webProducts.length} productos separados.`);

} catch (e) {
    console.error("Error al construir catalogo.js:", e);
}
