const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const CERRO_NAVIA_FILE = path.join(__dirname, '..', 'catalogo eleodoro final sucursal cerro navia.xlsx');
const LAGUNA_SUR_FILE = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

const packQuantities = {
    'LIFE3': 6, 'MASC': 12, 'NEST15': 1, 'ALOEO': 24, 'AND400': 6, 'ANDVA15': 6, 'ANDMANLATA': 6,
    'ANDMULTI': 1, 'ANDPACK': 1, 'ARROZ': 10, 'BAV470': 24, 'BEN3': 6, 'BEN5': 12, 'BOMB200': 24,
    'PROD004': 1, 'PROD005': 1, 'CATUNSG16': 6, 'CATUNSG25': 6, 'CATUNSG5': 12, 'MASP': 6, 'KFE': 6,
    'CCU125DES': 6, 'L125': 12, 'L25': 6, 'L2': 9, 'L3': 6, 'CCU600': 12, 'AND15DES': 6, 'AND125': 10,
    'AND2': 8, 'AND3DES': 6, 'AND3': 6, 'AND591': 6, 'LATAC': 6, 'ICE275': 24, 'COR330': 18, 'COR620': 12,
    'CRISLT': 24, 'CRIS12': 12, 'LIN': 1, 'ZO': 24, 'ESPAMAR': 1, 'ESPCARM': 1, 'EXP500': 1, 'EXPRB': 30,
    'SXF': 6, 'FR2': 6, 'FR500': 12, 'GATO1A': 6, 'GATO750': 6, 'GINGORD': 1, 'TQRAYBOS': 1, 'TQRAYLOND': 1,
    'TQRAYROY': 1, 'TQRAYSEVI': 1, 'H1': 180, 'HEX': 180, 'IRON': 1, 'JABAMIX': 10, 'JAL': 6, 'JC2': 6,
    'JUMEXM': 24, 'KAPOF': 24, 'LATAK6': 6, 'ESC710': 24, 'MINIC': 6, 'MAL355': 24, 'MONSO6': 6, 'PISAL': 1,
    'POWA1': 6, 'PROD002': 6, 'PROD006': 1, 'PROD001': 1, 'RB355': 12, 'RB473': 12, 'RB250': 12, 'RSTAR': 12,
    'RONANEJ': 1, 'RONBL': 1, 'RONDOR1': 1, 'RONANE': 1, 'ROY470': 24, 'SCOREG': 24, 'ENER250': 16, 'ENERGY': 24,
    'SOL650': 12, 'SOPA': 9, 'AND125DES': 6, 'SX': 12, 'LIPT15': 6, 'VIN120M': 6, 'VINMED': 3, 'VMREAL': 3,
    'VINCAR': 1, 'VINCHARDONNAY': 1, 'VINREAL': 2, 'VITSG16': 6, 'VITP': 6, 'VIT330': 12, 'VITSG600': 12,
    'PROD003': 1, 'WATTSD': 6, 'WB300': 24, 'WHISBUCH': 1, 'WHISKEY': 1, 'WHISBLACK': 1, 'WHISGOLD': 1,
    'WHISRED': 1, 'WHISSAND': 1, 'WHISHOR': 1,
    
    // Productos nuevos
    'BIGCOLA473': 6, 'BIGUVA17': 6, 'ALOE15': 12, 'SCOREW473': 24, 'ZOOM12': 12, 'EXPRESS24': 24, 'POWA850': 6, 'MINI250': 6
};

function parsePackQuantity(name) {
    if (!name) return 1;
    const upperName = name.toUpperCase();
    let qty = 1;
    const matchX = upperName.match(/\bX\s*(\d+)/i);
    if (matchX) {
        qty = parseInt(matchX[1], 10);
    } else {
        const matchUnits = upperName.match(/(\d+)\s*(?:UNIDADES|UNIDAD|UNID|U|BEBIDAS|FRASCOS|POTS|LATAS|LIBRAS|PACK|CAJA)\b/i);
        if (matchUnits) {
            qty = parseInt(matchUnits[1], 10);
        }
    }
    return qty;
}

function cleanAndProcessFile(filePath) {
    console.log(`\nProcesando y limpiando: ${filePath}...`);
    if (!fs.existsSync(filePath)) {
        console.warn(`El archivo no existe: ${filePath}`);
        return;
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    const cleanedRows = rows.map((row) => {
        const newRow = {};
        
        // Copiar y limpiar valores
        newRow['ID Interno'] = row['ID Interno'];
        newRow['Código Producto'] = row['Código Producto'];
        newRow['SKU'] = row['SKU'];
        newRow['Código Barras'] = row['Código Barras'];
        newRow['Nombre Comercial'] = row['Nombre Comercial'];
        newRow['Marca'] = row['Marca'];
        newRow['Categoría'] = row['Categoría'];
        newRow['Proveedor'] = row['Proveedor'];

        // Encontrar valor de Precio Costo de cualquier variante de header (con o sin espacio)
        let costVal = "";
        if (row[' Precio Costo ($) '] !== undefined && row[' Precio Costo ($) '] !== "") {
            costVal = row[' Precio Costo ($) '];
        } else if (row['Precio Costo ($)'] !== undefined && row['Precio Costo ($)'] !== "") {
            costVal = row['Precio Costo ($)'];
        }
        newRow[' Precio Costo ($) '] = costVal !== "" ? parseFloat(costVal) : "";

        // Encontrar valor de Precio Venta
        let saleVal = "";
        if (row[' Precio Venta ($) '] !== undefined && row[' Precio Venta ($) '] !== "") {
            saleVal = row[' Precio Venta ($) '];
        } else if (row['Precio Venta ($)'] !== undefined && row['Precio Venta ($)'] !== "") {
            saleVal = row['Precio Venta ($)'];
        }
        const salePrice = saleVal !== "" ? parseFloat(saleVal) : 0;
        newRow[' Precio Venta ($) '] = salePrice > 0 ? salePrice : "";

        // Calcular precio unitario
        const code = String(newRow['Código Producto'] || "");
        const baseCode = code.includes('-') ? code.split('-')[0] : code;
        let qty = packQuantities[baseCode];
        if (qty === undefined) {
            qty = parsePackQuantity(newRow['Nombre Comercial']);
        }
        
        const unitPrice = salePrice > 0 ? Math.round(salePrice / qty) : 0;
        newRow[' Precio Unitario ($) '] = unitPrice > 0 ? unitPrice : "";

        newRow['Margen Comercial (%)'] = row['Margen Comercial (%)'];
        newRow['Stock Actual'] = row['Stock Actual'];
        newRow['Stock Mínimo Alerta'] = row['Stock Mínimo Alerta'];
        newRow['Ruta Imagen'] = row['Ruta Imagen'];
        newRow['Descripción Detallada'] = row['Descripción Detallada'];

        return newRow;
    });

    // Escribir el nuevo archivo limpio
    const newSheet = xlsx.utils.json_to_sheet(cleanedRows);
    workbook.Sheets[sheetName] = newSheet;
    xlsx.writeFile(workbook, filePath);
    console.log(`Guardado con éxito. Filas: ${cleanedRows.length}`);
}

try {
    cleanAndProcessFile(CERRO_NAVIA_FILE);
    cleanAndProcessFile(LAGUNA_SUR_FILE);
    console.log("\nProceso de normalización y adición de precios unitarios completado.");
} catch (e) {
    console.error("Error durante el proceso:", e);
}
