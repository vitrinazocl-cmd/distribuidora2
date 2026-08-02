const xlsx = require('xlsx');
const path = require('path');

const cnFile = path.join(__dirname, '..', 'catalogo eleodoro final sucursal cerro navia.xlsx');
const lsFile = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

try {
    const cnData = xlsx.utils.sheet_to_json(xlsx.readFile(cnFile).Sheets[xlsx.readFile(cnFile).SheetNames[0]]);
    const lsData = xlsx.utils.sheet_to_json(xlsx.readFile(lsFile).Sheets[xlsx.readFile(lsFile).SheetNames[0]]);
    
    const countCategories = (data) => {
        const counts = {};
        data.forEach(r => {
            const cat = r['Categoría'] || 'Sin Categoría';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return counts;
    };
    
    console.log("=== DESGLOSE LAGUNA SUR (339 filas) ===");
    const lsCounts = countCategories(lsData);
    Object.keys(lsCounts).sort().forEach(cat => {
        console.log(`  ${cat}: ${lsCounts[cat]} productos`);
    });
    
    console.log("\n=== DESGLOSE CERRO NAVIA (302 filas) ===");
    const cnCounts = countCategories(cnData);
    Object.keys(cnCounts).sort().forEach(cat => {
        console.log(`  ${cat}: ${cnCounts[cat]} productos`);
    });
    
} catch (e) {
    console.error(e);
}
