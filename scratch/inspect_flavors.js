const xlsx = require('xlsx');

try {
    const workbook = xlsx.readFile('Catalogo_Detallado_Eleodoro.csv final.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    console.log("Total rows:", data.length);
    let withFlavors = 0;
    let withoutFlavors = 0;
    
    data.forEach((row, i) => {
        const desc = row['Descripción Detallada'] || '';
        const match = desc.match(/Sabores\/Variaciones:\s*(.*)/i);
        if (match) {
            withFlavors++;
            if (withFlavors <= 10) {
                console.log(`Row ${i} (${row['Nombre Comercial']}):`);
                console.log(`  Code: ${row['Código Producto']}`);
                console.log(`  Flavors part: "${match[1]}"`);
            }
        } else {
            withoutFlavors++;
        }
    });
    
    console.log(`\nWith flavors: ${withFlavors}`);
    console.log(`Without flavors: ${withoutFlavors}`);
} catch (e) {
    console.error("Error:", e.message);
}
