const fs = require('fs');
const path = require('path');

const files = ['server.js', 'script.js', 'excelService.js', 'catalogo.js', 'index.html'];

files.forEach(f => {
    const filePath = path.join(__dirname, '..', f);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    console.log(`=== Matches in ${f} ===`);
    lines.forEach((line, i) => {
        if (line.toLowerCase().includes('flavor') || line.toLowerCase().includes('sabor')) {
            console.log(`  Line ${i+1}: ${line.trim()}`);
        }
    });
});
