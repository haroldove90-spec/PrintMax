export const LUMESA_SUPABASE_SQL = `-- ==============================================================================
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
  image TEXT NOT NULL,
  specs JSONB DEFAULT '{}'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
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
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_stock_alert INTEGER DEFAULT 2;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS datasheet_url TEXT;

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

-- Migraciones seguras para orders
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
-- Permitir lectura y escritura con la clave pública de Supabase
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
-- DATOS INICIALES: SEED DE CONTENIDO WEB OFICIAL LUMESA (TODO EDITABLE)
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
    "visibility": {
      "showTrustMetrics": false,
      "showQuickPortals": true,
      "showQueHacemos": true,
      "showSobreNosotros": true,
      "showAboutStats": true,
      "showSlideImages": true,
      "showCoverageMap": true,
      "showSoftwareHighlights": true
    },
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
      "queHacemosText": "Ofrecemos soluciones integrales que permiten trabajar con calidad, eficiencia y productividad en los procesos de gestión documental de su empresa. En LUMESA nos ocupamos por brindarle el mejor servicio para optimizar el funcionamiento de sus equipos de marca Kyocera, ofreciendo servicios de venta, renta de impresoras y soporte técnico como una solución confiable cuando requiere productos tecnológicos.\n\nNuestro personal cuenta con amplia experiencia para dar una asistencia puntual a los equipos. Disponemos de refacciones y consumibles para garantizar la operatividad de sus dispositivos.",
      "queHacemosBullets": [
        "Ingenieros certificados directamente por Kyocera y un amplio stock de refacciones y consumibles originales.",
        "Garantía de respuesta y asistencia técnica en menos de 24 horas a partir de su llamada."
      ],
      "queHacemosChips": [
        "Renta Dedicada",
        "Venta de Hardware A3 / A4",
        "Tóner Original Certificado",
        "Pólizas Preventivas"
      ],
      "sobreNosotrosTitle": "Sobre Nosotros",
      "sobreNosotrosText1": "Creemos firmemente que el motor de nuestro crecimiento como empresa y como personas es la absoluta satisfacción de cada cliente. Somos un centro de distribución oficial de Kyocera en México con sede en San Luis Potosí y más de dos décadas de trayectoria en el mercado.",
      "sobreNosotrosText2": "Como representantes líderes en el sector de la impresión digital, respaldamos a una cartera de más de 2,000 clientes a nivel nacional con servicios de renta, venta y soporte técnico especializado. Desde una impresora esencial hasta robustas soluciones de software para el control y gestión del trabajo, le ofrecemos asesoramiento profesional, trato totalmente personalizado y un equipo en constante capacitación.",
      "clientsCount": "+2,000",
      "experienceYears": "+30",
      "pillars": [
        {
          "icon": "award",
          "title": "Certificación Directa Japón",
          "description": "Garantía oficial LUMESA y soporte avalado por la fábrica con personal en constante actualización."
        },
        {
          "icon": "cpu",
          "title": "Componentes Cerámicos ECOSYS",
          "description": "Cilindros de silicio amorfo de larga duración que reducen costos drásticamente."
        },
        {
          "icon": "map-pin",
          "title": "Hub San Luis Potosí",
          "description": "Envío exprés y distribución ágil de consumibles y piezas a todo el país."
        }
      ]
    },
    "coverage": {
      "tag": "Cobertura",
      "title": "Cobertura",
      "text": "Atendemos en San Luis Potosí. ¿Tu empresa está en otra ciudad? Escríbenos y revisamos las opciones de servicio para tu zona.",
      "ctaText": "Escríbenos y revisamos tu zona"
    },
    "hardwareSection": {
      "tag": "Catálogo Oficial: Renta / Venta de Multifuncionales",
      "title": "Equipos Kyocera en Renta y Venta Directa",
      "subtitle": "Adquiera su multifuncional mediante compra definitiva o arrendamiento 100% deducible con tóner original y garantía directa LUMESA.",
      "categories": [
        {
          "id": "a3",
          "name": "Multifuncionales A3",
          "subtitle": "Carta, Oficio, Doble Carta | B&N y Color",
          "description": "Tecnología ECOSYS de larga duración y línea TASKalfa para bajo a alto volumen (hasta 11\" x 17\")."
        },
        {
          "id": "a4",
          "name": "Multifuncionales A4",
          "subtitle": "Carta y Oficio | B&N y Color",
          "description": "Potencia y confiabilidad en formato compacto (hasta 8.5\" x 14\") para espacios reducidos."
        },
        {
          "id": "impresoras",
          "name": "Impresoras de Alto Rendimiento",
          "subtitle": "Carta, Oficio, Doble Carta | B&N y Color",
          "description": "Gama galardonada de productos con innovación Kyocera. Costos operativos extraordinariamente bajos."
        },
        {
          "id": "produccion",
          "name": "Impresión de Producción",
          "subtitle": "Inyección de Tinta de Hoja Suelta",
          "description": "Impresoras de inyección de tinta de alta velocidad y gran volumen para aplicaciones transaccionales y correo directo."
        }
      ]
    },
    "softwareSection": {
      "tag": "Gestión Digital & Flujos Inteligentes",
      "title": "Software: Soluciones Inteligentes para tu Negocio",
      "subtitle": "Optimice y asegure cada etapa del ciclo de vida de sus documentos. Transforme sus equipos multifuncionales Kyocera en centros neurálgicos de digitalización y ahorro corporativo.",
      "solutions": [
        {
          "id": "impresion",
          "title": "Software de Impresión",
          "tagline": "Agilice flujos de trabajo personalizados",
          "activeModule": "KYOCERA Command Center RX & KX Driver",
          "description": "Facilite y agilice sus flujos de trabajo personalizados, al tiempo que controla e incrementa la productividad de sus procesos documentales esenciales.",
          "benefits": [
            "Configuración remota de perfiles de usuario por departamento",
            "Políticas de restricción de impresión a color para reducir costos hasta 40%",
            "Balanceo de cargas automático entre multifuncionales de la misma red",
            "Impresión de códigos de barras y fuentes especiales directamente en el hardware"
          ]
        },
        {
          "id": "seguridad",
          "title": "Seguridad y Control de Costos",
          "tagline": "KYOCERA Net Manager y MyQ",
          "activeModule": "KYOCERA Net Manager y MyQ",
          "description": "Reduzca recursos, evite fugas de datos y pague solo por el color que utiliza. Libere impresiones mediante tarjeta de proximidad RFID o PIN seguro.",
          "benefits": [
            "Liberación segura Follow-Me: recoja su trabajo en cualquier equipo de la empresa",
            "Auditoría y reportes detallados por usuario, centro de costos y departamento",
            "Autenticación mediante credenciales corporativas (Active Directory / LDAP)",
            "Cifrado AES de 256 bits en disco duro y sobreescritura de datos al terminar el ciclo"
          ]
        },
        {
          "id": "movil",
          "title": "Solución Móvil y Nube",
          "tagline": "Impresión desde smartphones y conectividad cloud",
          "activeModule": "Kyocera Cloud Print & Scan",
          "description": "Aproveche la movilidad de su equipo de trabajo. Imprima y digitalice directamente desde Google Drive, Microsoft OneDrive, Dropbox y teléfonos iOS / Android.",
          "benefits": [
            "Compatibilidad nativa con Apple AirPrint, Mopria y Kyocera Mobile Print",
            "Escaneo con reconocimiento de texto (OCR) directo a la nube corporativa",
            "Sin necesidad de instalar drivers en computadoras portátiles ni tablets",
            "Cero servidores locales requeridos para entornos de trabajo híbridos o remotos"
          ]
        },
        {
          "id": "gestion",
          "title": "Gestión de Dispositivos",
          "tagline": "KYOCERA Fleet Services (KFS)",
          "activeModule": "KYOCERA Fleet Services (KFS)",
          "description": "Supervisión proactiva en tiempo real de todo su parque de impresión. Lectura automática de contadores, solicitud anticipada de tóner y diagnóstico técnico remoto.",
          "benefits": [
            "Despacho preventivo de tóner original antes de que el equipo se detenga",
            "Monitoreo 24/7 de niveles de consumibles y vida útil de piezas cerámicas",
            "Actualización remota de firmware sin interrumpir las operaciones del usuario",
            "Reducción de hasta 65% en visitas técnicas presenciales por diagnósticos en la nube"
          ]
        },
        {
          "id": "captura",
          "title": "Captura y Distribución",
          "tagline": "DMConnect y KCM",
          "activeModule": "DMConnect y KCM",
          "description": "Convierta documentos impresos en archivos digitales inteligentes y editables (Word, Excel, PDF searchable). Enrute facturas y contratos a su sistema ERP en un toque.",
          "benefits": [
            "Extracción automatizada de datos vía código de barras y zonas OCR",
            "Indexación instantánea para archivo en sistemas SAP, Oracle o carpetas compartidas",
            "Eliminación de pasos manuales de escaneo y renombrado de expedientes",
            "Cumplimiento normativo y trazabilidad legal de cada documento digitalizado"
          ]
        }
      ]
    },
    "whatsappButton": {
      "label": "WhatsApp Asesor LUMESA",
      "phone": "524448123000",
      "defaultMessage": "Hola LUMESA, me comunico desde la página web para solicitar cotización y asesoría.",
      "enabled": true
    },
    "contact": {
      "tag": "Atención Personalizada Inmediata",
      "title": "Contacto: ¿En qué podemos ayudarte?",
      "subtitle": "Estamos listos para impulsar la productividad de su negocio con tecnología Kyocera y servicio LUMESA. Si necesita asesoría para elegir el equipo ideal, cotizar un servicio de renta o venta, o requiere soporte técnico especializado, póngase en contacto con nosotros.",
      "cardTitle": "Centro de Atención a Clientes y Empresas",
      "cardSubtitle": "Distribuidores autorizados de Kyocera Japón con soporte técnico garantizado en menos de 24 horas.",
      "phone": "(444) 812-3000",
      "tollFree": "01 800 KYOCERA",
      "salesEmail": "ventas@lumesa.mx",
      "supportEmail": "soporte@lumesa.mx",
      "address": "Av. Venustiano Carranza #1450, Col. Tequisquiapan, San Luis Potosí, S.L.P. C.P. 78230",
      "schedule": "Lunes a Viernes de 09:00 a 18:00 hrs",
      "whatsapp": "524448123000",
      "formButtonText": "Enviar Solicitud a un Asesor LUMESA"
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
`;
