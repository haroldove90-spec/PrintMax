-- ==============================================================================
-- LUMESA - SUPABASE SCHEMA & SEED DATA
-- Proyecto: lumesa@appdesign.appdesignproyectos.com's Project
-- Project ID: mzxmiwvesflacxxerlxl
-- ==============================================================================

-- 1. TABLA: site_content (Contenido autoadministrable de la web y tienda en línea)
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'lumesa_main',
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA: products (Catálogo oficial de multifuncionales, impresoras y consumibles)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  rental_price_monthly NUMERIC(12, 2),
  badge TEXT,
  short_description TEXT,
  description TEXT,
  image TEXT NOT NULL DEFAULT '',
  specs JSONB DEFAULT '{}'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 5,
  min_stock_alert INTEGER DEFAULT 2,
  datasheet_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  original_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migraciones seguras para columnas añadidas
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_stock_alert INTEGER DEFAULT 2;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS datasheet_url TEXT;

-- Limpieza de productos de muestra antiguos (no afecta productos reales importados)
DELETE FROM public.products WHERE id IN (
  'kyocera-taskalfa-3554ci',
  'kyocera-taskalfa-5054ci',
  'kyocera-ecosys-m3655idn',
  'kyocera-ecosys-ma4000cix',
  'kyocera-ecosys-p3155dn',
  'kyocera-taskalfa-pro-15000c',
  'toner-kyocera-tk-8527k',
  'toner-kyocera-tk-3182',
  'poliza-anual-mantenimiento-pro'
);

-- 3. TABLA: orders (Pedidos y cotizaciones de clientes con desglose de factura CFDI 4.0)
CREATE TABLE IF NOT EXISTS public.orders (
  order_id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  rfc TEXT,
  cfdi_use TEXT,
  tax_regime TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  payment_method TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  tax NUMERIC(12, 2) NOT NULL,
  shipping NUMERIC(12, 2) DEFAULT 0,
  discount_coupon TEXT,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente',
  tracking_number TEXT,
  invoice_status TEXT DEFAULT 'pendiente',
  invoice_pdf_url TEXT,
  invoice_xml_url TEXT,
  internal_notes TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cfdi_use TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tax_regime TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_coupon TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice_status TEXT DEFAULT 'pendiente';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice_pdf_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS invoice_xml_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- ==============================================================================
-- POLÍTICAS DE ACCESO (ROW LEVEL SECURITY - RLS)
-- Permitir lectura y escritura con la clave anónima (sb_publishable_...)
-- ==============================================================================

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas para site_content
DROP POLICY IF EXISTS "Permitir lectura publica de contenidos" ON public.site_content;
CREATE POLICY "Permitir lectura publica de contenidos" 
  ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir edicion de contenidos" ON public.site_content;
CREATE POLICY "Permitir edicion de contenidos" 
  ON public.site_content FOR ALL USING (true) WITH CHECK (true);

-- Políticas para products
DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.products;
CREATE POLICY "Permitir lectura publica de productos" 
  ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gestion de productos" ON public.products;
CREATE POLICY "Permitir gestion de productos" 
  ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Políticas para orders
DROP POLICY IF EXISTS "Permitir lectura de pedidos" ON public.orders;
CREATE POLICY "Permitir lectura de pedidos" 
  ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir creacion y actualizacion de pedidos" ON public.orders;
CREATE POLICY "Permitir creacion y actualizacion de pedidos" 
  ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 4. STORAGE BUCKET: product-images (Subida directa de imágenes de productos)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Lectura publica de imagenes de productos" ON storage.objects;
CREATE POLICY "Lectura publica de imagenes de productos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Subida y gestion de imagenes de productos" ON storage.objects;
CREATE POLICY "Subida y gestion de imagenes de productos"
  ON storage.objects FOR ALL
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- ==============================================================================
-- DATOS INICIALES: SEED DE CONTENIDO WEB OFICIAL LUMESA (SIN PRODUCTOS DE MUESTRA)
-- ==============================================================================

INSERT INTO public.site_content (id, content)
VALUES (
  'lumesa_main',
  '{
    "slides": [
      {
        "id": 1,
        "tag": "Presentación / Marca y Experiencia",
        "title": "Innovación y Tecnología Kyocera en México",
        "subtitle": "Más de 30 años respaldando el éxito y la productividad de tu empresa con soluciones documentales de vanguardia.",
        "ctaPrimaryText": "Explorar Soluciones",
        "ctaPrimaryAction": "hardware",
        "ctaSecondaryText": "Ir a Tienda en Línea",
        "ctaSecondaryAction": "tienda",
        "badgeText": "Distribuidor Oficial Autorizado",
        "imageUrl": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
        "features": [
          "Centro de distribución oficial de Kyocera Japón",
          "Sede en San Luis Potosí y cobertura en todo México",
          "+2,000 clientes corporativos satisfechos"
        ]
      },
      {
        "id": 2,
        "tag": "Hardware y Equipos Kyocera",
        "title": "Equipos de Impresión de Alto Rendimiento",
        "subtitle": "Venta de multifuncionales A3 y A4, tecnología ECOSYS y TASKalfa. Optimiza tu espacio de trabajo con tecnología eficiente y confiable.",
        "ctaPrimaryText": "Ver Catálogo de Equipos",
        "ctaPrimaryAction": "hardware",
        "ctaSecondaryText": "Calculadora de Renta",
        "ctaSecondaryAction": "contacto",
        "badgeText": "Tecnología ECOSYS y TASKalfa",
        "imageUrl": "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1920&q=80",
        "features": [
          "Multifuncionales A3 (hasta 11\" x 17\") y A4 compactos",
          "Renta 100% deducible de impuestos",
          "Mantenimiento y tóner original incluidos"
        ]
      },
      {
        "id": 3,
        "tag": "Software y Productividad Documental",
        "title": "Gestión Inteligente y Control de Costos MyQ",
        "subtitle": "Automatiza flujos de trabajo, reduce costos de impresión y protege la información confidencial de tu empresa.",
        "ctaPrimaryText": "Explorar Software Kyocera",
        "ctaPrimaryAction": "software",
        "ctaSecondaryText": "Contactar Asesor",
        "ctaSecondaryAction": "contacto",
        "badgeText": "Soluciones de Gestión Digital",
        "imageUrl": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80",
        "features": [
          "Monitoreo centralizado con Kyocera Fleet Services",
          "Seguridad documental y auditoría de impresiones",
          "Integración fluida con sistemas ERP y servidores"
        ]
      }
    ],
    "showTrustMetrics": false,
    "trustMetrics": [
      {
        "value": "+30",
        "label": "Años de Experiencia",
        "description": "Liderando soluciones de impresión y gestión documental en México"
      },
      {
        "value": "+2,000",
        "label": "Clientes Satisfechos",
        "description": "Empresas, corporativos, escuelas y despachos a nivel nacional"
      },
      {
        "value": "< 24h",
        "label": "Respuesta Técnica",
        "description": "Garantía de asistencia técnica y soporte en sitio"
      },
      {
        "value": "100%",
        "label": "Original Kyocera",
        "description": "Tóner, consumibles y refacciones genuinas de importación directa"
      }
    ],
    "about": {
      "headline": "Tres Décadas de Liderazgo en Gestión Documental",
      "subheadline": "Con base central en San Luis Potosí y cobertura a nivel nacional, respaldamos a más de 2,000 empresas con tecnología de impresión y soporte técnico especializado.",
      "queHacemosTitle": "Qué Hacemos",
      "queHacemosText": "Impulsamos la calidad, eficiencia y productividad en cada uno de sus procesos de gestión documental. Nos apasiona optimizar el rendimiento de su infraestructura tecnológica, por lo que ponemos a su disposición la venta, renta y soporte técnico especializado de equipos Kyocera. Respaldamos cada solución con ingenieros certificados directamente por Kyocera y un amplio stock de refacciones y consumibles originales, lo que nos permite garantizarle una respuesta y asistencia técnica en menos de 24 horas a partir de su llamada.",
      "sobreNosotrosTitle": "Sobre Nosotros",
      "sobreNosotrosText1": "Creemos firmemente que el motor de nuestro crecimiento como empresa y como personas es la absoluta satisfacción de cada cliente. Somos un centro de distribución oficial de Kyocera en México con sede en San Luis Potosí y más de dos décadas de trayectoria en el mercado.",
      "sobreNosotrosText2": "Como representantes líderes en el sector de la impresión digital, respaldamos a una cartera de más de 2,000 clientes a nivel nacional con servicios de renta, venta y soporte técnico especializado. Desde una impresora esencial hasta robustas soluciones de software para el control y gestión del trabajo, le ofrecemos asesoramiento profesional, trato totalmente personalizado y un equipo en constante capacitación.",
      "clientsCount": "+2,000",
      "experienceYears": "+30"
    },
    "contact": {
      "phone": "(444) 812-3000",
      "tollFree": "01 800 KYOCERA",
      "salesEmail": "ventas@lumesa.mx",
      "supportEmail": "soporte@lumesa.mx",
      "address": "Av. Venustiano Carranza #1450, Col. Tequisquiapan, San Luis Potosí, S.L.P. C.P. 78230",
      "schedule": "Lunes a Viernes de 09:00 a 18:00 hrs",
      "whatsapp": "524448123000"
    },
    "support": {
      "annualPolicyPrice": 14500,
      "responseTime": "Menos de 24 horas",
      "modalitySchedule": "09:00 a 18:00 hrs"
    }
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE 
SET content = EXCLUDED.content, updated_at = timezone('utc'::text, now());
