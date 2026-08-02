const xlsx = require('xlsx');
const path = require('path');

const originalFile = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro.csv final.xlsx');
const hojasFile = path.join(__dirname, '..', 'Catalogo_Eleodoro_Hojas_Escritas.xlsx');

try {
    const origData = xlsx.utils.sheet_to_json(xlsx.readFile(originalFile).Sheets[xlsx.readFile(originalFile).SheetNames[0]]);
    const hojasData = xlsx.utils.sheet_to_json(xlsx.readFile(hojasFile).Sheets[xlsx.readFile(hojasFile).SheetNames[0]]);
    
    console.log("Comparando precios de productos existentes...");
    
    // Crear mapa de precios originales por código base
    const origPrices = {};
    origData.forEach(r => {
        origPrices[r['Código Producto']] = parseFloat(r['Precio Venta ($)']);
    });
    
    let diffCount = 0;
    const compared = new Set();
    
    hojasData.forEach(r => {
        const code = String(r['Código Producto']);
        const baseCode = code.includes('-') ? code.split('-')[0] : code;
        
        if (compared.has(baseCode)) return;
        compared.add(baseCode);
        
        const origPrice = origPrices[baseCode];
        const hojasPrice = parseFloat(r['Precio Venta ($)']);
        
        if (origPrice !== undefined) {
            if (origPrice !== hojasPrice) {
                console.log(`DIFERENCIA: Producto ${baseCode} | Nombre: ${r['Nombre Comercial']} | Orig Price: ${origPrice} | Hojas Price: ${hojasPrice}`);
                diffCount++;
            }
        }
    });
    
    console.log(`\nTotal de productos existentes con diferencia de precio: ${diffCount}`);
    
} catch (e) {
    console.error(e);
}
