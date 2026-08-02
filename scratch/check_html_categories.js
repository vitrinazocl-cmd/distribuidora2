const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const lines = htmlContent.split('\n');
console.log("=== Category links in index.html ===");
lines.forEach((line, i) => {
    if (line.includes('data-category')) {
        console.log(`  Line ${i+1}: ${line.trim()}`);
    }
});
