-- =====================================================================
-- 1. CREACIÓN DE ESQUEMAS Y CONFIGURACIÓN INICIAL
-- =====================================================================

-- Esquema privado para almacenar información interna o sensible que no debe exponerse a la API
CREATE SCHEMA IF NOT EXISTS app_private;

-- =====================================================================
-- 2. TABLAS DEL ESQUEMA PÚBLICO (Expuestas en la API REST)
-- =====================================================================

-- Tabla de Productos / Catálogo
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
    image TEXT,
    is_custom BOOLEAN DEFAULT FALSE,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    flavors TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Pedidos / Órdenes
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Vinculado a Supabase Auth
    customer_name TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    total INTEGER NOT NULL CHECK (total >= 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Detalles de Pedidos (Relación muchos a muchos entre Orders y Products)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 3. TABLAS DEL ESQUEMA PRIVADO (Ocultas de la API)
-- =====================================================================

-- Tabla interna de auditoría y logs
CREATE TABLE IF NOT EXISTS app_private.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 4. SEGURIDAD A NIVEL DE FILA (RLS)
-- =====================================================================

-- Habilitar RLS en las tablas del esquema público
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 4.1 Políticas para public.products
-- Cualquiera (incluso no autenticados) puede leer los productos
CREATE POLICY "Permitir lectura publica de productos"
ON public.products
FOR SELECT
USING (true);

-- Solo administradores (Service Role) o usuarios autenticados con rol específico (si aplica) pueden modificar productos
CREATE POLICY "Solo administradores pueden modificar productos"
ON public.products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4.2 Políticas para public.orders
-- Los usuarios autenticados solo pueden ver sus propios pedidos
CREATE POLICY "Usuarios pueden ver sus propios pedidos"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Los usuarios autenticados pueden crear sus propios pedidos
CREATE POLICY "Usuarios pueden crear sus propios pedidos"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4.3 Políticas para public.order_items
-- Los usuarios autenticados solo pueden ver los ítems de sus propios pedidos
CREATE POLICY "Usuarios pueden ver items de sus propios pedidos"
ON public.order_items
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
);

-- Los usuarios autenticados pueden registrar ítems para sus propios pedidos
CREATE POLICY "Usuarios pueden registrar items de sus propios pedidos"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
);

-- =====================================================================
-- 5. INDEXACIÓN PARA MÁXIMO RENDIMIENTO
-- =====================================================================

-- Índices en claves foráneas y columnas filtradas constantemente por RLS
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON app_private.audit_logs(created_at);
