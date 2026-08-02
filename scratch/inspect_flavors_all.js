const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('Catalogo_Detallado_Eleodoro.csv final.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    data.forEach((row, i) => {
        const desc = row['Descripción Detallada'] || '';
        const match = desc.match(/Sabores\/Variaciones:\s*(.*)/i);
        const flavorStr = match ? match[1] : 'NO_MATCH';
        console.log(`${row['Código Producto']} | ${row['Nombre Comercial']} | ${flavorStr}`);
    });
} catch (e) {
    console.error("Error:", e.message);
}
