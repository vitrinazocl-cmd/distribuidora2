const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, 'catalogo.js');

try {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    
    const lines = jsContent.split('\n');
    let currentId = null;
    const newLines = lines.map(line => {
        const idMatch = line.match(/id:\s*'([^']+)'/);
        if (idMatch) {
            currentId = idMatch[1];
        }
        
        if (currentId && line.includes('image:')) {
            const updatedLine = line.replace(/image:\s*"[^"]+"/, `image: "catalogo/${currentId}.jpg"`);
            return updatedLine;
        }
        
        return line;
    });
    
    fs.writeFileSync(jsPath, newLines.join('\n'), 'utf8');
    console.log('catalogo.js actualizado con éxito con las nuevas rutas de imágenes unificadas.');
} catch (e) {
    console.error('Error actualizando catalogo.js:', e);
}
