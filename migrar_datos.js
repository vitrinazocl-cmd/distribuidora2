const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { Client } = require('pg');
require('dotenv').config();

const EXCEL_PATH = path.join(__dirname, 'CATALOGO ELEODORO JUNIO 26 ia FINAL.xlsx');
const CATALOGO_JS_PATH = path.join(__dirname, 'catalogo.js');

async function runMigration() {
    console.log('--- Iniciando Migración de Datos a PostgreSQL / Supabase ---');

    // 1. Obtener y parsear catalogo.js
    console.log('Leyendo catálogo desde catalogo.js...');
    if (!fs.existsSync(CATALOGO_JS_PATH)) {
        console.error(`Error: No se encontró el archivo ${CATALOGO_JS_PATH}`);
        process.exit(1);
    }
    const jsContent = fs.readFileSync(CATALOGO_JS_PATH, 'utf8');
    
    // Evaluar el contenido del archivo catalogo.js para extraer catalogoProductos
    let catalogoProductos = [];
    try {
        // Adaptamos el script para poder evaluar catalogoProductos en Node.js
        const cleanContent = jsContent
            .replace('const catalogoProductos =', 'catalogoProductos =')
            .replace('export const catalogoProductos =', 'catalogoProductos =')
            .replace('export ', '');
        eval(cleanContent);
    } catch (err) {
        console.error('Error al evaluar catalogo.js:', err);
        process.exit(1);
    }
    console.log(`Cargados ${catalogoProductos.length} productos desde catalogo.js.`);

    // 2. Leer inventario desde el Excel
    console.log('Leyendo inventario desde Excel...');
    const stockMap = new Map();
    if (fs.existsSync(EXCEL_PATH)) {
        try {
            const workbook = xlsx.readFile(EXCEL_PATH);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });
            
            // Obtener columnas de ID y Stock
            const headers = Object.keys(data[0] || {});
            const idCol = headers.find(h => h.toUpperCase().includes('CODIGO') || h.toUpperCase().includes('ID'));
            const stockCol = headers.find(h => h.toUpperCase().includes('STOCK') || h.toUpperCase().includes('CANTIDAD'));

            if (idCol && stockCol) {
                data.forEach(row => {
                    const code = String(row[idCol]).trim().toUpperCase();
                    const stock = parseInt(row[stockCol]) || 0;
                    if (code) {
                        stockMap.set(code, stock);
                    }
                });
                console.log(`Cargado inventario de ${stockMap.size} productos desde Excel.`);
            } else {
                console.warn('Advertencia: No se encontraron columnas de ID/CÓDIGO o STOCK en el Excel. Se usarán valores por defecto.');
            }
        } catch (excelErr) {
            console.error('Error leyendo el Excel:', excelErr);
        }
    } else {
        console.warn(`Advertencia: No se encontró el archivo Excel en ${EXCEL_PATH}. Se asignará stock inicial de 0.`);
    }

    // 3. Conectar a la base de datos PostgreSQL
    const dbConfig = process.env.DATABASE_URL 
        ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'distribuidora',
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
          };

    console.log(`Conectando a base de datos en ${dbConfig.host || 'remoto'}...`);
    const client = new Client(dbConfig);
    try {
        await client.connect();
        console.log('Conexión exitosa a PostgreSQL.');
    } catch (connErr) {
        console.error('Error de conexión a la base de datos:', connErr.message);
        console.error('\nPor favor, verifica tus credenciales en el archivo .env.');
        process.exit(1);
    }

    // 4. Insertar productos en la tabla
    console.log('Insertando productos en la base de datos...');
    let insertados = 0;
    let actualizados = 0;

    try {
        // Asegurar que la tabla products existe (por si no se corrió schema.sql)
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price INTEGER NOT NULL,
                category TEXT NOT NULL,
                image TEXT,
                is_custom BOOLEAN DEFAULT FALSE,
                stock INTEGER DEFAULT 0,
                flavors TEXT[] DEFAULT '{}',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

        for (const prod of catalogoProductos) {
            if (!prod || !prod.id) continue;

            // Determinar el stock para el producto
            let codeToLookup = prod.id.toUpperCase();
            // Si el código contiene sabores divididos (ej: L25-01), buscamos el código base (L25)
            if (codeToLookup.includes('-') && !codeToLookup.startsWith('JABAMIX')) {
                codeToLookup = codeToLookup.split('-')[0];
            }
            
            // Si es un producto personalizado (Jabas), asignamos un stock por defecto alto
            let stock = 1000; 
            if (stockMap.has(codeToLookup)) {
                stock = stockMap.get(codeToLookup);
            } else if (prod.stock !== undefined) {
                stock = prod.stock;
            } else if (prod.isCustom) {
                stock = 1000; // Por defecto para las jabas
            } else {
                stock = 0; // Por defecto para productos individuales no mapeados
            }

            const flavorsArray = prod.flavors || [];

            // Query de inserción (Upsert)
            const queryText = `
                INSERT INTO public.products (id, name, price, category, image, is_custom, stock, flavors)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (id) 
                DO UPDATE SET 
                    name = EXCLUDED.name,
                    price = EXCLUDED.price,
                    category = EXCLUDED.category,
                    image = EXCLUDED.image,
                    is_custom = EXCLUDED.is_custom,
                    stock = EXCLUDED.stock,
                    flavors = EXCLUDED.flavors
                RETURNING (xmax = 0) AS inserted;
            `;

            const values = [
                prod.id,
                prod.name,
                prod.price || 0,
                prod.category || 'BEBIDAS',
                prod.image || null,
                prod.isCustom || false,
                stock,
                flavorsArray
            ];

            const res = await client.query(queryText, values);
            if (res.rows[0].inserted) {
                insertados++;
            } else {
                actualizados++;
            }
        }

        console.log(`\n--- Migración Finalizada con Éxito ---`);
        console.log(`Productos Nuevos Insertados: ${insertados}`);
        console.log(`Productos Actualizados: ${actualizados}`);

    } catch (dbErr) {
        console.error('Error durante la inserción en base de datos:', dbErr);
    } finally {
        await client.end();
        console.log('Conexión a PostgreSQL cerrada.');
    }
}

runMigration();
