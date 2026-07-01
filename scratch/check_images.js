const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '..', 'catalogo.js');
const baseDir = path.join(__dirname, '..');

try {
    const content = fs.readFileSync(jsPath, 'utf8');
    
    // Parse the array in a basic way
    const matches = content.matchAll(/image:\s*"([^"]+)"/g);
    
    let count = 0;
    let missingCount = 0;
    
    for (const match of matches) {
        count++;
        const relPath = match[1];
        const absPath = path.join(baseDir, relPath);
        
        if (!fs.existsSync(absPath)) {
            console.log(`FALTA: ${relPath}`);
            missingCount++;
        } else {
            const stats = fs.statSync(absPath);
            if (stats.size < 1000) {
                console.log(`BROKEN/PEQUEÑO: ${relPath} (${stats.size} bytes)`);
                missingCount++;
            }
        }
    }
    
    console.log(`Total imágenes analizadas: ${count}. Incompletas/Faltantes: ${missingCount}`);
} catch (e) {
    console.error("Error running script:", e);
}
