const xlsx = require('xlsx');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor.xlsx');

try {
    const workbook = xlsx.readFile(FILE_PATH);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
    const categories = [
        'Aguas y Aguas Saborizadas',
        'Bebidas Gaseosas',
        'Bebidas Analcohólicas',
        'Energéticas',
        'Promociones Especiales',
        'Snacks y Abarrotes'
    ];
    
    categories.forEach(cat => {
        console.log(`\n=== Categoría: ${cat} ===`);
        const items = data.filter(r => r['Categoría'] === cat);
        items.slice(0, 10).forEach(r => console.log(`  ${r['Código Producto']} | ${r['Nombre Comercial']}`));
        if (items.length > 10) {
            console.log(`  ... y ${items.length - 10} más`);
        }
    });
} catch (e) {
    console.error("Error:", e.message);
}
