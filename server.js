const express = require('express');
const cors = require('cors');
const { WebpayPlus } = require('transbank-sdk');
require('dotenv').config(); // Cargar variables de entorno

const bicomService = require('./bicomService'); // Importar el servicio de Bicom

// Webpay ya viene configurado para el entorno de pruebas (Integration) por defecto.
const app = express();
const PORT = 3000;

// Configuración de middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir los archivos estáticos de tu frontend actual
app.use(express.static(__dirname));

// ==========================================
// RUTAS DE PRUEBA
// ==========================================
app.get('/api/estado', (req, res) => {
    res.json({ mensaje: '¡El backend está funcionando correctamente!' });
});

// ==========================================
// RUTAS WEBPAY
// ==========================================
app.post('/api/pagar', async (req, res) => {
    try {
        // Validación Legal Horarios en Backend
        const currentHour = new Date().getHours();
        if (currentHour >= 1 && currentHour < 9) {
            return res.status(403).json({ error: 'Las compras están restringidas entre la 01:00 AM y 09:00 AM por cumplimiento legal.' });
        }

        // Recibimos el total a cobrar desde el frontend
        const total = req.body.total;
        
        // Generamos un ID de orden y sesión aleatorios (luego Bicom dará el número real)
        const buyOrder = "ORDEN-" + Math.floor(Math.random() * 100000);
        const sessionId = "SESION-" + Math.floor(Math.random() * 100000);
        const returnUrl = "http://localhost:3000/api/confirmar-pago";

        // Crear la transacción en Webpay
        const tx = new WebpayPlus.Transaction();
        const response = await tx.create(buyOrder, sessionId, total, returnUrl);

        // Devolvemos la URL y el Token al Frontend para que redirija al usuario
        res.json({
            url: response.url,
            token: response.token
        });

    } catch (error) {
        console.error("Error al iniciar pago en Webpay:", error);
        res.status(500).json({ error: error.message || error.toString() });
    }
});

app.get('/api/confirmar-pago', async (req, res) => {
    try {
        const token = req.query.token_ws;
        const tbkToken = req.query.TBK_TOKEN;
        
        // Si viene TBK_TOKEN pero no token_ws, significa que el usuario anuló la compra
        if (tbkToken && !token) {
            return res.redirect('/index.html?pago=abortado');
        }
        
        if (!token) {
            return res.redirect('/index.html?pago=error');
        }

        // Confirmar la transacción con Webpay usando el Token
        const tx = new WebpayPlus.Transaction();
        const response = await tx.commit(token);

        if (response.status === 'AUTHORIZED') {
            // Pago exitoso
            console.log(`Pago autorizado. Orden: ${response.buy_order}. Generando Boleta...`);
            try {
                await bicomService.generarDocumentoTributario(response.buy_order, token);
            } catch (err) {
                console.error("Aviso: No se pudo emitir la boleta de inmediato:", err.message);
            }

            return res.redirect('/index.html?pago=exito&orden=' + response.buy_order);
        } else {
            // Pago rechazado (sin saldo, etc.)
            return res.redirect('/index.html?pago=rechazado');
        }

    } catch (error) {
        console.error("Error al confirmar pago:", error);
        return res.redirect('/index.html?pago=error');
    }
});

// ==========================================
// ESQUELETO RUTAS BICOM
// ==========================================

// Obtener productos desde Bicom
app.get('/api/bicom/productos', async (req, res) => {
    try {
        const productos = await bicomService.obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enviar un pedido a Bicom
app.post('/api/bicom/pedidos', async (req, res) => {
    try {
        const pedido = req.body;
        const resultado = await bicomService.crearPedido(pedido);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sincronizar stock
app.get('/api/sincronizar-stock', async (req, res) => {
    try {
        const resultado = await bicomService.sincronizarStock();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Servidor Backend iniciado con éxito`);
    console.log(`🌐 Escuchando en el puerto: http://localhost:${PORT}`);
    console.log(`=================================================`);
});
