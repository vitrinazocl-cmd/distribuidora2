const fs = require('fs');
const path = require('path');

const scriptContent = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const lines = scriptContent.split('\n');
console.log("=== References to sucursal or branch in script.js ===");
lines.forEach((line, i) => {
    if (line.toLowerCase().includes('sucursal') || line.toLowerCase().includes('cerro') || line.toLowerCase().includes('laguna') || line.toLowerCase().includes('localstorage')) {
        console.log(`  Line ${i+1}: ${line.trim()}`);
    }
});
