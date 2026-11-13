import { HeroSlide, Product } from '../types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tag: "Renta y venta de equipos de impresión",
    title: "El equipo de impresión que tu empresa necesita, en renta o en venta",
    subtitle: "Respaldando el éxito y la productividad de tu empresa con soluciones documentales de vanguardia.",
    ctaPrimaryText: "Ir a la tienda",
    ctaPrimaryAction: "tienda",
    ctaSecondaryText: "Solicitar cotización",
    ctaSecondaryAction: "contacto",
    badgeText: "LUMESA",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
    features: [
      "Renta a tu medida: pago mensual según cuánto imprimes",
      "Venta de equipos: multifuncionales e impresoras para cada tamaño de oficina",
      "Servicio técnico: mantenimiento y soporte para tu equipo",
      "Asesoría personalizada: te ayudamos a elegir entre blanco y negro, color, carta o doble carta"
    ]
  },
  {
    id: 2,
    tag: "Hardware y Equipos Kyocera",
    title: "Equipos de Impresión de Alto Rendimiento",
    subtitle: "Venta de multifuncionales A3 y A4, tecnología ECOSYS y TASKalfa. Optimiza tu espacio de trabajo con tecnología eficiente y confiable.",
    ctaPrimaryText: "Ver Catálogo de Equipos",
    ctaPrimaryAction: "hardware",
    ctaSecondaryText: "Calculadora de Renta",
    ctaSecondaryAction: "contacto",
    badgeText: "Tecnología ECOSYS y TASKalfa",
    imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1920&q=80",
    features: [
      "Multifuncionales A3 (hasta 11\" x 17\") y A4 compactos",
      "Renta 100% deducible de impuestos",
      "Mantenimiento y tóner original incluidos",
      "Servicio técnico certificado y soporte directo"
    ]
  },
  {
    id: 3,
    tag: "Distribución y Atención Inmediata",
    title: "Cobertura en San Luis Potosí y Servicio Especializado",
    subtitle: "Atención rápida, refacciones originales y personal calificado para garantizar la continuidad operativa de tu empresa.",
    ctaPrimaryText: "Solicitar Asesoría",
    ctaPrimaryAction: "contacto",
    ctaSecondaryText: "Ir a la Tienda",
    ctaSecondaryAction: "tienda",
    badgeText: "Soporte y Garantía Oficial",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80",
    features: [
      "Atención directa en San Luis Potosí y opciones para tu zona",
      "Soporte técnico especializado con técnicos certificados",
      "Tóner original y consumibles con entrega garantizada",
      "Pólizas preventivas y correctivas a la medida"
    ]
  }
];

export const TRUST_METRICS = [
  {
    value: "",
    label: "Renta a tu medida",
    description: "pago mensual según cuánto imprimes"
  },
  {
    value: "",
    label: "Venta de equipos",
    description: "multifuncionales e impresoras para cada tamaño de oficina"
  },
  {
    value: "",
    label: "Servicio técnico",
    description: "mantenimiento y soporte para tu equipo"
  },
  {
    value: "",
    label: "Asesoría personalizada",
    description: "te ayudamos a elegir entre blanco y negro, color, carta o doble carta"
  }
];

export const PRODUCTS: Product[] = [];

export const SOFTWARE_SOLUTIONS = [
  {
    id: "software-impresion",
    title: "Software de Impresión",
    tagline: "Agilice flujos de trabajo personalizados",
    description: "Soluciones personalizables e integradas con su MFP Kyocera. Diseñe botones de un toque para escanear directamente a carpetas contables o correos específicos.",
    icon: "Printer",
    benefits: ["Integración nativa con HyPAS", "Menús personalizados por usuario", "Reducción de pasos operativos"]
  },
  {
    id: "seguridad-costos",
    title: "Seguridad y Control de Costos",
    tagline: "KYOCERA Net Manager y MyQ",
    description: "Reduzca recursos, evite fugas de datos y pague solo por el color que utiliza. Libere impresiones mediante tarjeta de proximidad RFID o PIN seguro.",
    icon: "ShieldCheck",
    benefits: ["Asignación de cuotas por departamento", "Impresión 'Follow-Me' segura", "Auditoría completa de documentos confidenciales"]
  },
  {
    id: "solucion-movil-nube",
    title: "Solución Móvil y Nube",
    tagline: "Conectividad total en entornos BYOD",
    description: "Imprima y escanee sin problemas desde dispositivos móviles iOS, Android o equipos remotos. Conexión directa a Google Workspace y OneDrive.",
    icon: "Cloud",
    benefits: ["Soporte para Apple AirPrint y Mopria", "Escaneo directo a la nube corporativa", "Acceso remoto seguro sin VPN compleja"]
  },
  {
    id: "gestion-dispositivos",
    title: "Gestión de Dispositivos de Red",
    tagline: "Kyocera Device Manager y Fleet Services",
    description: "Minimice tiempos de inactividad con monitoreo proactivo de tóner, alertas automáticas de fallas y actualización remota de firmware.",
    icon: "Server",
    benefits: ["Lectura automática de contadores para facturación", "Despacho automatizado de consumibles", "Diagnóstico preventivo de piezas"]
  },
  {
    id: "escanear-automatizar",
    title: "Escanear, Conectar y Automatización",
    tagline: "DMConnect y automatización con KCM",
    description: "Captura avanzada con DMConnect, conectores directos a Google / Microsoft y automatización inteligente con Kyocera Capture Manager (KCM).",
    icon: "Cpu",
    benefits: ["Reconocimiento óptico OCR de texto", "Enrutamiento automático por código de barras", "Indexación directa en sistemas ERP"]
  }
];

export const RENTAL_PERKS = [
  {
    title: "100% Deducible de Impuestos",
    description: "Conserve su capital de trabajo sin descapitalización ni depreciación de activos (gasto operativo 100% deducible exento de IETU).",
    icon: "BadgePercent"
  },
  {
    title: "Mantenimiento Preventivo y Correctivo",
    description: "Todas las visitas de ingenieros certificados, ajustes mecánicos y limpiezas preventivas están completamente cubiertas en la cuota.",
    icon: "Wrench"
  },
  {
    title: "Consumibles Originales Incluidos",
    description: "Suministro oportuno de cartuchos de tóner genuinos Kyocera para el volumen pactado (únicamente pone el papel).",
    icon: "Layers"
  },
  {
    title: "Tecnología Siempre Actualizada",
    description: "Opción de renovar sus equipos por modelos de última generación al término de su contrato para mantener la vanguardia.",
    icon: "RefreshCw"
  }
];

export const SERVICE_MODALITIES = [
  {
    title: "Servicio General en Taller",
    schedule: "09:00 a 18:00 hrs",
    description: "Laboratorio especializado en San Luis Potosí equipado con instrumental de precisión y bancos de prueba para diagnósticos mayores.",
    icon: "Store"
  },
  {
    title: "Asistencia Preventiva / Correctiva en Sitio",
    schedule: "Menos de 24 horas",
    description: "Ingenieros en campo acuden directamente a sus instalaciones con stock móvil de partes críticas para resolución inmediata.",
    icon: "Truck"
  },
  {
    title: "Esquemas Semestrales Programados",
    schedule: "Cada 60 a 90 días",
    description: "Planes periódicos de revisión para empresas con volumen medio, evitando que pequeñas anomalías se conviertan en paros de línea.",
    icon: "CalendarCheck"
  }
];
