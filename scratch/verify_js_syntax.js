const fs = require('fs');
const path = require('path');

const jsFiles = [
    path.join(__dirname, '..', 'catalogo.js'),
    path.join(__dirname, '..', 'script.js'),
    path.join(__dirname, '..', 'excelService.js'),
    path.join(__dirname, '..', 'server.js')
];

jsFiles.forEach(file => {
    try {
        console.log(`Verificando sintaxis de: ${file}...`);
        const content = fs.readFileSync(file, 'utf8');
        // Usar la función Function constructor para compilar el código sin ejecutarlo
        new Function(content);
        console.log(`  Sintaxis CORRECTA`);
    } catch (e) {
        console.error(`  Error de sintaxis en ${file}:`, e.message);
    }
});
