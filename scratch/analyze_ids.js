const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('Catalogo_Detallado_Eleodoro.csv final.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    const ids = data.map(r => r['ID Interno']);
    const codes = data.map(r => r['Código Producto']);
    const skus = data.map(r => r['SKU']);
    const barcodes = data.map(r => r['Código Barras']);
    
    console.log("IDs length:", ids.length);
    console.log("Unique IDs count:", new Set(ids).size);
    console.log("Min ID:", Math.min(...ids.filter(x => typeof x === 'number')));
    console.log("Max ID:", Math.max(...ids.filter(x => typeof x === 'number')));
    
    console.log("\nCodes length:", codes.length);
    console.log("Unique Codes count:", new Set(codes).size);
    
    console.log("\nSKUs length:", skus.length);
    console.log("Unique SKUs count:", new Set(skus).size);
    
    console.log("\nBarcodes length:", barcodes.length);
    console.log("Unique Barcodes count:", new Set(barcodes).size);
    
    // Check if barcode can be string or number
    console.log("\nSample barcodes:", barcodes.slice(0, 5));
    
} catch (e) {
    console.error("Error:", e.message);
}
