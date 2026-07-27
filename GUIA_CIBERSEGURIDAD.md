# Guía de Refuerzo de Ciberseguridad para Base de Datos (PostgreSQL / Supabase)

Esta guía detalla los pasos de configuración y los comandos SQL listos para implementar las tres medidas de seguridad solicitadas para tu base de datos en producción.

---

## 1. Refuerzo de la API de Datos: Esquema Personalizado
Por defecto, la API REST expone automáticamente las tablas que se encuentran en el esquema `public`. Para evitar que tablas privadas, de configuración o de logs queden expuestas accidentalmente al exterior, debemos moverlas a un esquema personalizado que no esté expuesto en la API.

### Paso 1: Crear un esquema privado en PostgreSQL
Ejecuta la siguiente consulta para crear un esquema llamado `app_private` (o el nombre que prefieras):
```sql
CREATE SCHEMA app_private;
```

### Paso 2: Trasladar tablas privadas a dicho esquema
Mueve las tablas sensibles fuera del esquema `public` hacia el nuevo esquema personalizado:
```sql
-- Ejemplo: Mover una tabla de configuración interna
ALTER TABLE public.configuracion_interna SET SCHEMA app_private;

-- Ejemplo: Mover una tabla de logs de auditoría
ALTER TABLE public.logs_auditoria SET SCHEMA app_private;
```

### Paso 3: Configurar los esquemas expuestos en la API
1. Dirígete al panel de control de tu proyecto (en Supabase: **Project Settings > API**).
2. En la sección **Exposed Schemas** (Esquemas Expuestos), asegúrate de que **solo** figure el esquema `public`.
3. **No agregues** `app_private` a esta lista. Esto garantiza que cualquier tabla dentro de `app_private` solo sea accesible internamente por tu backend o funciones de base de datos seguras, y nunca mediante la API REST pública.

---

## 2. Seguridad a Nivel de Fila (RLS) y Políticas
La Seguridad a Nivel de Fila (RLS por sus siglas en inglés) garantiza que un usuario autenticado solo pueda interactuar con las filas que le pertenecen (por ejemplo, que un cliente solo pueda leer sus propias compras).

### Paso 1: Habilitar RLS en tus tablas
Por defecto, las tablas recién creadas no tienen RLS activo y son vulnerables si la API está expuesta. Activa RLS ejecutando:
```sql
-- Habilitar RLS en la tabla de pedidos
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en la tabla de perfiles de usuario
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Paso 2: Crear Políticas de Seguridad por Usuario (Supabase Auth)
En Supabase, usamos `auth.uid()` para obtener el identificador único del usuario que realiza la consulta en la web.

#### A) Política para lectura (SELECT)
Permite al usuario ver únicamente sus propios registros:
```sql
CREATE POLICY "Usuarios pueden ver solo sus propios pedidos" 
ON public.orders
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
```

#### B) Política para inserción (INSERT)
Permite al usuario agregar registros siempre y cuando el campo `user_id` coincida con su sesión activa:
```sql
CREATE POLICY "Usuarios pueden crear solo sus propios pedidos" 
ON public.orders
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);
```

#### C) Política para actualización (UPDATE)
Permite al usuario modificar solo sus propios registros:
```sql
CREATE POLICY "Usuarios pueden actualizar solo sus propios pedidos" 
ON public.orders
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### Paso 3: Indexación óptima para mejorar el rendimiento
Las políticas de RLS obligan al motor de la base de datos a filtrar por `user_id` en cada consulta. Sin índices adecuados, esto causará búsquedas secuenciales lentas a medida que crezca la base de datos.
```sql
-- Crear índice en la columna de relación del usuario
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
```

---

## 3. Lista de Verificación para Preparación de Producción
Implementa estas configuraciones en tu panel del servidor/base de datos para asegurar escalabilidad y protección a nivel empresarial.

### A) Enforzar SSL (Cifrado en Tránsito)
El cifrado SSL evita ataques de intermediario (Man-in-the-Middle) que intercepten datos de tus clientes en tránsito.
- **En Supabase**: El cifrado SSL está activado y es obligatorio por defecto para todas las conexiones API y cadenas de conexión a la base de datos.
- **En PostgreSQL tradicional**: Asegúrate de tener configurado tu archivo `pg_hba.conf` para rechazar conexiones no seguras:
  ```text
  # Solo permitir conexiones cifradas con SSL
  hostssl all all all scram-sha-256
  ```

### B) Restricciones de Red (Network Restrictions)
No permitas que tu base de datos (puerto 5432) esté abierta a cualquier IP del mundo.
1. Ve a **Project Settings > Database > Network Restrictions** en Supabase.
2. Habilita las restricciones y define una lista de IPs permitidas (IPv4 Allow List).
3. Añade únicamente las direcciones IP de tu backend (por ejemplo, la IP de tu servidor web en producción) y tus IPs de desarrollo de confianza.

### C) Configurar SMTP Personalizado para Autenticación
Por defecto, los servidores de autenticación (Supabase Auth) usan un servidor de correo SMTP de prueba con límites muy estrictos (máximo 3 correos por hora). En producción, esto impedirá que tus usuarios se registren o recuperen sus contraseñas.
1. Contrata un proveedor de correo transaccional (como **Resend**, **SendGrid**, **Mailgun** o **AWS SES**).
2. Ve a **Project Settings > Auth** en tu panel.
3. Desplázate hasta **SMTP Settings** y activa el interruptor **Enable Custom SMTP**.
4. Rellena los datos de conexión correspondientes:
   - **Sender Email**: `no-reply@tusitio.cl`
   - **SMTP Host**, **Port**, **Username** y **Password** proporcionados por tu proveedor de correo transaccional.

### D) Habilitar Copias de Seguridad PITR (Point-in-Time Recovery)
Las copias de seguridad estándar (snapshots) suelen ser diarias. Si tu servidor falla a las 11:00 PM, perderás todo el trabajo del día.
- **Point-in-Time Recovery (PITR)** graba continuamente los registros de escritura (WAL logs). Esto te permite restaurar tu base de datos a **cualquier segundo exacto en el pasado** (por ejemplo, volver al estado de ayer a las 14:02:45).
- **Activación**: Ve a **Project Settings > Database > Backups** y activa **Point-in-Time Recovery** (disponible en planes Pro o superiores de Supabase).
