// dbService.js
const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a PostgreSQL usando Pool de conexiones
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

const pool = new Pool(dbConfig);

/**
 * Mapea los códigos del carrito a los IDs de base de datos
 */
function getMappedId(itemId, itemName) {
    let searchId = String(itemId).toUpperCase();
    
    // Quitar sub-sabores (ej: L25-01 -> L25)
    if (searchId.includes('-') && !searchId.startsWith('JABAMIX')) {
        searchId = searchId.split('-')[0];
    }
    
    // Mapeo especial de Jabas Personalizadas a su ID Base correspondiente
    if (searchId.startsWith('JABAMIX')) {
        searchId = 'JM10';
    }
    if (searchId.startsWith('AND125_MIX')) {
        searchId = 'AND125';
    }
    if (searchId.startsWith('AND2_MIX')) {
        searchId = 'AND2';
    }
    if (searchId.startsWith('AND3_MIX')) {
        searchId = 'AND3';
    }
    if (searchId.startsWith('EXPRB_MIX')) {
        searchId = 'EXPRB';
    }
    if (searchId.startsWith('L125_MIX')) {
        searchId = 'L125';
    }
    if (searchId.startsWith('L2_MIX')) {
        searchId = 'L2';
    }
    
    return searchId;
}

/**
 * Descuenta el inventario de la base de datos PostgreSQL basado en los productos del carrito.
 * Utiliza una transacción para asegurar la consistencia (Atomicidad).
 * @param {Array} carrito Array de productos [{id, name, quantity}]
 */
async function actualizarInventario(carrito) {
    if (!carrito || carrito.length === 0) return;

    const client = await pool.connect();
    try {
        console.log("Iniciando transacción SQL para descontar inventario...");
        await client.query('BEGIN');

        for (const item of carrito) {
            const mappedId = getMappedId(item.id, item.name);
            const quantity = parseInt(item.quantity) || 1;

            // Descontar inventario asegurando que no baje de 0
            const updateQuery = `
                UPDATE public.products 
                SET stock = GREATEST(0, stock - $1) 
                WHERE id = $2 OR UPPER(name) = UPPER($3)
                RETURNING id, name, stock;
            `;
            const res = await client.query(updateQuery, [quantity, mappedId, item.name]);

            if (res.rowCount > 0) {
                console.log(`[DB SUCCESS] Descontadas ${quantity} unidades de ${res.rows[0].name}. Nuevo stock: ${res.rows[0].stock}`);
            } else {
                console.warn(`[DB WARNING] No se encontró el producto ${item.name} (ID: ${mappedId}) para descontar.`);
            }
        }

        await client.query('COMMIT');
        console.log("Transacción de descuento de inventario completada.");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al descontar inventario, transacción cancelada y revertida:", error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    actualizarInventario,
    pool
};
