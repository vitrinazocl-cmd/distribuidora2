const xlsx = require('xlsx');

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
    
    // Split by comma
    const flavors = flavorStr.split(',').map(f => f.trim()).filter(f => f.length > 0);
    return flavors;
}

try {
    const workbook = xlsx.readFile('Catalogo_Detallado_Eleodoro.csv final.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    let totalNewRows = 0;
    data.forEach((row, i) => {
        const desc = row['Descripción Detallada'] || '';
        const flavors = parseFlavors(desc);
        if (flavors.length > 1) {
            console.log(`Row ${i} (${row['Código Producto']}): ${flavors.join(' | ')}`);
            totalNewRows += flavors.length;
        } else {
            totalNewRows += 1;
        }
    });
    console.log("Original row count:", data.length);
    console.log("Estimated new row count:", totalNewRows);
} catch (e) {
    console.error("Error:", e.message);
}
