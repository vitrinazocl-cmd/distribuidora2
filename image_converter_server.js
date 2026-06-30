const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

app.post('/api/save-image', (req, res) => {
    try {
        const { id, dataUrl } = req.body;
        if (!id || !dataUrl) {
            return res.status(400).json({ error: 'Faltan datos de ID o imagen.' });
        }
        
        // El formato de dataUrl es: "data:image/jpeg;base64,..."
        const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
        const imgPath = path.join(__dirname, 'catalogo', `${id}.jpg`);
        
        // Asegurarse de que el directorio catalogo existe
        const dir = path.dirname(imgPath);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(imgPath, base64Data, 'base64');
        console.log(`[OK] Guardada imagen limpia para: ${id}`);
        res.json({ success: true });
    } catch (e) {
        console.error('Error guardando imagen:', e);
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/done', (req, res) => {
    console.log('=== PROCESO DE CONVERSIÓN COMPLETADO ===');
    res.json({ success: true });
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

app.listen(PORT, () => {
    console.log(`Servidor de conversión de imágenes iniciado en http://localhost:${PORT}`);
});
