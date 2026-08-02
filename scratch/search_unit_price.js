const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const lines = content.split('\n');
console.log("=== Matches in script.js ===");
lines.forEach((line, i) => {
    if (line.includes('unitPrice') || line.includes('Unitario') || line.includes('unit-price') || line.includes('c/u')) {
        console.log(`  Line ${i+1}: ${line.trim()}`);
    }
});
