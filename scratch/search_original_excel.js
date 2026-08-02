const xlsx = require('xlsx');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro.csv final.xlsx');

try {
    const workbook = xlsx.readFile(FILE_PATH);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
    console.log("Total products in original Excel:", data.length);
    
    const keywords = ['BIG', 'MINI', 'POWER', 'ALOE', 'CERVEZA', 'HUEVO', 'JUMEX', 'CYRO', 'KAPO', 'BOMBILLIN', 'SOPA', 'FRUNA', 'FASTYLE', 'SUEROX', 'ARROZ', 'ANDINA', 'WATTS'];
    
    keywords.forEach(kw => {
        const matches = data.filter(r => {
            const name = String(r['Nombre Comercial']).toUpperCase();
            return name.includes(kw);
        });
        console.log(`\nMatches for "${kw}" (count: ${matches.length}):`);
        matches.forEach(r => console.log(`  ${r['Código Producto']} | ${r['Nombre Comercial']} | Price: ${r['Precio Venta ($)']}`));
    });
    
} catch (e) {
    console.error("Error:", e.message);
}
