const fs = require('fs');
const path = require('path');

const lockFile = path.join(__dirname, '..', '~$Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');
const targetFile = path.join(__dirname, '..', 'Catalogo_Detallado_Eleodoro_Por_Sabor LAGUNA SUR .xlsx');

console.log("Checking target file path:", targetFile);
console.log("Does target exist?", fs.existsSync(targetFile));
try {
    const fd = fs.openSync(targetFile, 'r+');
    fs.closeSync(fd);
    console.log("Target is writable and NOT locked.");
} catch (e) {
    console.log("Target is LOCKED:", e.message);
}

console.log("Checking lock file path:", lockFile);
console.log("Does lock file exist?", fs.existsSync(lockFile));
