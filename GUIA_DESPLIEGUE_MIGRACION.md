# Guía de Despliegue: Migración a PostgreSQL / Supabase con Ciberseguridad Activa

Esta guía detalla los pasos para completar la migración del catálogo y el inventario del distribuidor (desde los archivos Excel) hacia una base de datos segura de PostgreSQL en Supabase.

---

## Prerrequisitos

1. **Crear una cuenta y un proyecto en [Supabase](https://supabase.com)** (es gratis en su capa base).
2. **Instalar Node.js** (ya viene incluido de forma portable en la carpeta `node-v26.3.0-win-x64`).
3. **Instalar dependencias necesarias**: Asegúrate de ejecutar `npm install` (o utilizar el servicio de instalación si ya está configurado). La librería `pg` ya fue instalada.

---

## Paso 1: Inicializar la Estructura en Supabase (DDL)

1. Ingresa al panel de control de tu proyecto en Supabase.
2. Haz clic en la pestaña **SQL Editor** en el menú de la izquierda.
3. Abre un **New Query** (Nueva Consulta).
4. Copia el contenido completo de tu archivo local [**`schema.sql`**](file:///c:/Users/pc/Desktop/Carpetas_y_Proyectos/distribuidora2%20(2)/distribuidora2/schema.sql).
5. Pega el código SQL y haz clic en **Run** (Ejecutar).

> [!NOTE]  
> Esto creará el esquema privado `app_private` (oculto a la API), las tablas `products`, `orders`, `order_items`, y configurará automáticamente las políticas RLS y la indexación óptima por `user_id`.

---

## Paso 2: Configurar las Variables de Entorno

Abre el archivo [**`.env`**](file:///c:/Users/pc/Desktop/Carpetas_y_Proyectos/distribuidora2%20(2)/distribuidora2/.env) y configura la URI de conexión de tu base de datos:

1. En Supabase, ve a **Project Settings > Database**.
2. En la sección **Connection string**, copia la URI en formato **URI** (comienza con `postgresql://...`).
3. Pega la URI en la variable `DATABASE_URL` reemplazando `[YOUR-PASSWORD]` con la contraseña real que creaste para tu base de datos:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
   ```

---

## Paso 3: Ejecutar la Migración de Datos (Carga Inicial)

Ejecuta el script de migración para cargar todos los productos y stock actuales desde `catalogo.js` y el Excel a tu nueva base de datos en la nube.

Abre tu consola de Git Bash o terminal en la ruta del proyecto y ejecuta:
```bash
node migrar_datos.js
```

Verás una salida similar a esta:
```text
--- Iniciando Migración de Datos a PostgreSQL / Supabase ---
Leyendo catálogo desde catalogo.js...
Cargados 310 productos desde catalogo.js.
Leyendo inventario desde Excel...
Cargado inventario de 103 productos desde Excel.
Conectando a base de datos en ...
Conexión exitosa a PostgreSQL.
Insertando productos en la base de datos...

--- Migración Finalizada con Éxito ---
Productos Nuevos Insertados: 310
Productos Actualizados: 0
Conexión a PostgreSQL cerrada.
```

---

## Paso 4: Levantar y Validar el Servidor

1. Inicia el servidor usando:
   ```bash
   node server.js
   ```
   (o haciendo doble clic en `iniciar_servidor.bat`).
2. Realiza una compra simulada en la web.
3. Al recibir la confirmación de pago de Webpay, verás en la consola del servidor que el stock se ha descontado de la base de datos en la nube en lugar de modificar el Excel local:
   ```text
   [DB SUCCESS] Descontadas 2 unidades de COCA COLA 1.5 LT. Nuevo stock: 998
   ```

---

## Paso 5: Lista de Ciberseguridad en Producción (Supabase)

Asegúrate de aplicar estos pasos finales en Supabase antes de lanzar a producción:

* **Restricciones de Red**: Ve a **Settings > Database > Network Restrictions** y activa la lista blanca. Agrega únicamente la IP de tu servidor backend para que nadie más pueda intentar conectarse directamente a tu base de datos mediante SQL externo.
* **SMTP de Correo**: Ve a **Settings > Auth > SMTP Settings**, activa *Enable Custom SMTP* y rellena los datos de tu proveedor de correo (ej. SendGrid o Mailgun) para el registro de usuarios y recuperación de contraseñas de tus clientes.
* **Copia de seguridad en tiempo real (PITR)**: En planes Pro, activa **Point-in-Time Recovery** en **Settings > Database > Backups** para protegerte contra cualquier pérdida accidental de datos.
