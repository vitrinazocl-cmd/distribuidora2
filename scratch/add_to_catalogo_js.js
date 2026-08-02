const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'catalogo.js');

const newProducts = [
    { id: 'BIGCOLA473', name: "BIG COLA LATA 473ML x 6 unidades", price: 3180, category: "BEBIDAS", image: "catalogo/BIGCOLA473.jpg", flavors: ["COLA"] },
    { id: 'BIGUVA17', name: "BIG UVA 1.7L x 6 unidades", price: 5250, category: "BEBIDAS", image: "catalogo/BIGUVA17.jpg", flavors: ["UVA"] },
    { id: 'ALOE15', name: "ALOE VERA 1.5L x 12 unidades", price: 20280, category: "BEBIDAS", image: "catalogo/ALOE15.jpg", flavors: ["ORIGINAL", "PIÑA", "FRUTILLA"] },
    { id: 'SCOREW473', name: "SCORE WATER 473ML x 24 unidades", price: 18000, category: "ENERGÉTICAS", image: "catalogo/SCOREW473.jpg", flavors: ["ALOE VERA", "SIN GAS", "CON GAS"] },
    { id: 'ZOOM12', name: "ENERGY ZOOM 473ML x 12 unidades", price: 7800, category: "ENERGÉTICAS", image: "catalogo/ZOOM12.jpg", flavors: ["WHITE", "PURPLE"] },
    { id: 'EXPRESS24', name: "COCA COLA EXPRESS 250ML x 24 unidades", price: 10104, category: "BEBIDAS", image: "catalogo/EXPRESS24.jpg", flavors: ["COCA COLA", "COCA COLA ZERO", "FANTA", "SPRITE"] },
    { id: 'POWA850', name: "POWERADE 850ML x 6 unidades", price: 5850, category: "BEBIDAS", image: "catalogo/POWA850.jpg", flavors: ["AZUL", "ROJO"] },
    { id: 'MINI250', name: "COCA COLA MINI 250ML x 6 unidades", price: 6200, category: "BEBIDAS", image: "catalogo/MINI250.jpg", flavors: ["COCA COLA", "COCA COLA ZERO", "FANTA", "SPRITE"] }
];

try {
    let content = fs.readFileSync(jsPath, 'utf8');
    
    // Buscar la posición del corchete de cierre del arreglo
    const lastBracketIndex = content.lastIndexOf('];');
    if (lastBracketIndex === -1) {
        console.error("No se encontró el final del arreglo catalogoProductos.");
        process.exit(1);
    }
    
    // Formatear las líneas a insertar
    const linesToInsert = newProducts.map(p => 
        `{ id: '${p.id}', name: "${p.name}", price: ${p.price}, category: "${p.category}", image: "${p.image}", flavors: ${JSON.stringify(p.flavors)} }`
    ).join(',\n');
    
    // Insertar antes del ];
    const preContent = content.substring(0, lastBracketIndex).trim();
    // Quitar coma final si existe, y luego ponerla
    const needsComma = !preContent.endsWith(',');
    const newContent = preContent + (needsComma ? ',\n' : '\n') + linesToInsert + '\n];\n';
    
    fs.writeFileSync(jsPath, newContent, 'utf8');
    console.log("catalogo.js actualizado exitosamente con los 8 nuevos productos!");
} catch (e) {
    console.error("Error al actualizar catalogo.js:", e.message);
}
