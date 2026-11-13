import { SiteContent, OrderDetails, AdminUser, ContentVisibility, FooterConfig, CoverageConfig, HeroSlide } from '../types';
import { HERO_SLIDES, TRUST_METRICS, SOFTWARE_SOLUTIONS } from './mockData';

export const DEFAULT_COVERAGE: CoverageConfig = {
  tag: "Cobertura",
  title: "Cobertura",
  text: "Atendemos en San Luis Potosí. ¿Tu empresa está en otra ciudad? Escríbenos y revisamos las opciones de servicio para tu zona.",
  ctaText: "Escríbenos y revisamos las opciones de servicio para tu zona"
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  showBanner: true,
  showBrandColumn: true,
  showSectionsColumn: false,
  showEquiposColumn: true,
  showEmpresaColumn: true,
  showCopyrightBar: true,
  bannerTitle: "¿Necesitas un equipo de impresión para tu empresa? Solicita tu cotización.",
  bannerSubtitle: "Te asesoramos para elegir el equipo ideal y te enviamos una cotización a la medida.",
  bannerPhone: "(444) 812-3000",
  bannerWhatsAppText: "Solicitar Cotización por WhatsApp",
  bannerWhatsAppUrl: "https://wa.me/524448123000?text=Hola,%20me%20comunico%20desde%20la%20p%C3%A1gina%20de%20LUMESA%20para%20solicitar%20una%20cotizaci%C3%B3n.",
  description: "LUMESA · Renta y venta de equipos de impresión en San Luis Potosí.",
  address: "San Luis Potosí, S.L.P., México",
  schedule: "Lunes a viernes de 9:00 a 18:00 h",
  email: "contacto@lumesa.com.mx",
  sectionsTitle: "Secciones",
  sectionsLinks: [
    { id: "sec-1", label: "Inicio", target: "inicio" },
    { id: "sec-2", label: "Nosotros", target: "nosotros" },
    { id: "sec-3", label: "Renta / Venta", target: "renta_venta" },
    { id: "sec-4", label: "Tienda en Línea", target: "tienda" },
    { id: "sec-5", label: "Contacto", target: "contacto" }
  ],
  equiposTitle: "Equipos & Servicios",
  equiposLinks: [
    { id: "eq-1", label: "Multifuncionales A3 Color", target: "renta_venta" },
    { id: "eq-2", label: "Multifuncionales A4 Compactos", target: "renta_venta" },
    { id: "eq-3", label: "Impresoras Láser", target: "renta_venta" },
    { id: "eq-4", label: "Tóner y Consumibles", target: "tienda" },
    { id: "eq-5", label: "Planes de Renta a tu Medida", target: "renta_venta" },
    { id: "eq-6", label: "Servicio Técnico y Soporte", target: "contacto" }
  ],
  empresaTitle: "Empresa y Atención",
  empresaLinks: [
    { id: "em-1", label: "Sobre Nosotros", target: "nosotros" },
    { id: "em-2", label: "Cobertura en San Luis Potosí", target: "nosotros" },
    { id: "em-3", label: "Contacto Directo", target: "contacto" },
    { id: "em-4", label: "Tienda en Línea", target: "tienda" },
    { id: "em-5", label: "Aviso de privacidad", target: "contacto" },
    { id: "em-6", label: "Acceso Admin Autoadministrable →", target: "admin" }
  ],
  copyrightText: "© 2026 LUMESA. Todos los derechos reservados. Kyocera, ECOSYS y TASKalfa son marcas registradas de sus respectivos titulares."
};

export const DEFAULT_VISIBILITY: ContentVisibility = {
  showTrustMetrics: false,
  showQuickPortals: true,
  showQueHacemos: true,
  showSobreNosotros: true,
  showAboutStats: false,
  showSlideImages: true,
  showCoverageMap: true,
  showSoftwareHighlights: false,
  showSoftwareSection: false
};

export function normalizeHeroSlides(slides?: any[]): HeroSlide[] {
  const result: HeroSlide[] = [];
  for (let i = 0; i < 3; i++) {
    const existing = slides && Array.isArray(slides) && slides[i];
    if (existing && existing.title) {
      result.push({
        ...(HERO_SLIDES[i] || {}),
        ...existing,
        id: existing.id || i + 1,
        features: Array.isArray(existing.features) && existing.features.length > 0 
          ? existing.features 
          : (HERO_SLIDES[i]?.features || [])
      });
    } else {
      result.push(HERO_SLIDES[i] || {
        id: i + 1,
        tag: `Diapositiva ${i + 1}`,
        title: `Diapositiva ${i + 1}`,
        subtitle: '',
        ctaPrimaryText: 'Ver Catálogo',
        ctaPrimaryAction: 'tienda',
        ctaSecondaryText: 'Cotizar',
        ctaSecondaryAction: 'contacto',
        badgeText: 'LUMESA',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
        features: []
      });
    }
  }
  return result;
}

export const INITIAL_SITE_CONTENT: SiteContent = {
  slides: normalizeHeroSlides(HERO_SLIDES),
  showTrustMetrics: false,
  visibility: DEFAULT_VISIBILITY,
  trustMetrics: TRUST_METRICS,
  about: {
    badgeText: "Distribuidor Kiosera",
    headline: "Una empresa potosina de soluciones de impresión",
    subheadline: "Respaldando el éxito y la productividad de tu empresa con soluciones documentales.",
    queHacemosTitle: "Qué Hacemos",
    queHacemosText: "En LUMESA rentamos y vendemos multifuncionales e impresoras láser de marca Kyocera. Te ayudamos a elegir el equipo según tu volumen de impresión, si necesitas color o doble carta, y te enviamos una cotización sin compromiso.",
    queHacemosBullets: [
      "Renta de equipos: Equipo instalado en tu oficina con un pago mensual. Cotizamos según tu volumen de impresión.",
      "Venta de equipos: Multifuncionales e impresoras láser en blanco y negro y a color, tamaño carta, oficio y doble carta.",
      "Servicio técnico: Mantenimiento y soporte para los equipos que rentas o compras con nosotros."
    ],
    queHacemosChips: [
      "Renta de Equipos",
      "Venta de Equipos",
      "Servicio Técnico Kyocera",
      "Asesoría a tu Medida"
    ],
    sobreNosotrosTitle: "Sobre nosotros",
    sobreNosotrosText1: "LUMESA nace en San Luis Potosí con una idea sencilla: que cualquier negocio pueda tener equipos de impresión de calidad profesional sin complicaciones. Trabajamos con atención directa y trato personal, desde que eliges tu equipo hasta que lo tienes funcionando en tu oficina.",
    sobreNosotrosText2: "",
    clientsCount: "",
    experienceYears: "",
    pillars: [
      {
        id: "atencion-directa",
        title: "Atención directa",
        description: "Hablas con nosotros, no con un conmutador.",
        icon: "Award"
      },
      {
        id: "equipos-confiables",
        title: "Equipos confiables",
        description: "Multifuncionales e impresoras láser diseñados para trabajo de oficina diario.",
        icon: "Cpu"
      },
      {
        id: "cotizacion-medida",
        title: "Cotización a tu medida",
        description: "Te proponemos el equipo que de verdad necesitas, ni más ni menos.",
        icon: "MapPin"
      }
    ]
  },
  coverage: DEFAULT_COVERAGE,
  hardwareSection: {
    tag: "Catálogo Oficial: Renta / Venta de Multifuncionales",
    title: "Equipos Kyocera en Renta y Venta Directa",
    subtitle: "Adquiera su multifuncional mediante compra definitiva o arrendamiento 100% deducible con tóner original y garantía directa LUMESA.",
    categories: [
      {
        id: "a3",
        name: "Multifuncionales A3",
        subtitle: "Carta, Oficio, Doble Carta | B&N y Color",
        description: 'Tecnología ECOSYS de larga duración y línea TASKalfa para bajo a alto volumen (hasta 11" x 17").'
      },
      {
        id: "a4",
        name: "Multifuncionales A4",
        subtitle: "Carta y Oficio | B&N y Color",
        description: 'Potencia y confiabilidad en formato compacto (hasta 8.5" x 14") para espacios reducidos.'
      },
      {
        id: "impresoras",
        name: "Impresoras de Alto Rendimiento",
        subtitle: "Carta, Oficio, Doble Carta | B&N y Color",
        description: "Gama galardonada de productos con innovación Kyocera. Costos operativos extraordinariamente bajos."
      },
      {
        id: "produccion",
        name: "Impresión de Producción",
        subtitle: "Inyección de Tinta de Hoja Suelta",
        description: "Impresoras de inyección de tinta de alta velocidad y gran volumen para aplicaciones transaccionales y correo directo."
      }
    ]
  },
  softwareSection: {
    tag: "Gestión Digital & Flujos Inteligentes",
    title: "Software: Soluciones Inteligentes para tu Negocio",
    subtitle: "Optimice y asegure cada etapa del ciclo de vida de sus documentos. Transforme sus equipos multifuncionales Kyocera en centros neurálgicos de digitalización y ahorro corporativo.",
    solutions: SOFTWARE_SOLUTIONS
  },
  whatsappButton: {
    label: "WhatsApp Asesor LUMESA",
    phone: "524448123000",
    defaultMessage: "Hola LUMESA, me comunico desde la página web para solicitar cotización y asesoría.",
    enabled: true
  },
  contact: {
    tag: "Atención Personalizada Inmediata",
    title: "Contacto: ¿En qué podemos ayudarte?",
    subtitle: "Estamos listos para impulsar la productividad de su negocio con tecnología Kyocera y servicio LUMESA. Si necesita asesoría para elegir el equipo ideal, cotizar un servicio de renta o venta, o requiere soporte técnico especializado, póngase en contacto con nosotros.",
    cardTitle: "Centro de Atención a Clientes y Empresas",
    cardSubtitle: "Distribuidores autorizados de Kyocera Japón con soporte técnico garantizado en menos de 24 horas.",
    phone: "(444) 812-3000",
    tollFree: "01 800 KYOCERA",
    salesEmail: "ventas@lumesa.mx",
    supportEmail: "soporte@lumesa.mx",
    address: "Av. Venustiano Carranza #1450, Col. Tequisquiapan, San Luis Potosí, S.L.P. C.P. 78230",
    schedule: "Lunes a Viernes de 09:00 a 18:00 hrs",
    whatsapp: "524448123000",
    formButtonText: "Enviar Solicitud a un Asesor LUMESA"
  },
  support: {
    annualPolicyPrice: 14500,
    responseTime: "Menos de 24 horas",
    modalitySchedule: "09:00 a 18:00 hrs"
  },
  storeCategories: [
    {
      id: 'cat-a3',
      slug: 'multifuncionales-a3',
      name: 'Multifuncionales A3',
      description: 'Equipos formato Doble Carta (11" x 17"), alto volumen y color profesional.',
      icon: 'Printer',
      order: 1,
      active: true
    },
    {
      id: 'cat-a4',
      slug: 'multifuncionales-a4',
      name: 'Multifuncionales A4',
      description: 'Equipos compactos para oficina, notarías y despachos en Carta y Oficio.',
      icon: 'FileText',
      order: 2,
      active: true
    },
    {
      id: 'cat-impresoras',
      slug: 'impresoras',
      name: 'Impresoras Láser',
      description: 'Impresoras robustas de alta velocidad con costos operativos extraordinariamente bajos.',
      icon: 'Zap',
      order: 3,
      active: true
    },
    {
      id: 'cat-produccion',
      slug: 'produccion',
      name: 'Impresión de Producción',
      description: 'Inyección de tinta de alta velocidad y gran volumen para aplicaciones transaccionales.',
      icon: 'Layers',
      order: 4,
      active: true
    },
    {
      id: 'cat-consumibles',
      slug: 'consumibles',
      name: 'Tóner y Consumibles Genuinos',
      description: 'Cartuchos de tóner microfino original Kyocera y kits de mantenimiento certificados.',
      icon: 'Package',
      order: 5,
      active: true
    },
    {
      id: 'cat-polizas',
      slug: 'polizas',
      name: 'Pólizas de Servicio',
      description: 'Contratos preventivos y correctivos con refacciones y respuesta < 24h incluidos.',
      icon: 'ShieldCheck',
      order: 6,
      active: true
    },
    {
      id: 'cat-refacciones',
      slug: 'refacciones',
      name: 'Refacciones y Accesorios',
      description: 'Alimentadores de papel, bandejas adicionales, finishers y tarjetas de red.',
      icon: 'Cpu',
      order: 7,
      active: true
    }
  ],
  paymentConfig: {
    mercadoPago: {
      enabled: false,
      publicKey: '',
      accessToken: '',
      sandboxMode: true,
      acceptedMethods: {
        creditCard: true,
        debitCard: true,
        ticketOxxo: true,
        spei: true
      }
    },
    bankTransfer: {
      enabled: true,
      bankName: 'BBVA México',
      accountHolder: 'LUMESA Impresión Digital S.A. de C.V.',
      clabe: '012 700 00123456789 4',
      accountNumber: '0123456789',
      rfc: 'LID080315TR8'
    },
    shippingConfig: {
      freeShippingThreshold: 10000,
      standardShippingCost: 350,
      localCityFreeShipping: true,
      estimatedDays: '2 a 4 días hábiles'
    }
  },
  coupons: [
    {
      id: 'coup-1',
      code: 'KYOCERA5',
      discountType: 'percentage',
      discountValue: 5,
      minPurchase: 5000,
      active: true,
      expiryDate: '2026-12-31',
      usesCount: 14,
      maxUses: 100
    },
    {
      id: 'coup-2',
      code: 'LUMESABENVENIDO',
      discountType: 'fixed',
      discountValue: 1000,
      minPurchase: 15000,
      active: true,
      expiryDate: '2026-12-31',
      usesCount: 8,
      maxUses: 50
    }
  ],
  footer: DEFAULT_FOOTER_CONFIG
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-super",
    name: "Administrador General LUMESA",
    email: "admin@lumesa.mx",
    role: "super_admin",
    roleLabel: "Super Administrador (Web + Tienda)"
  },
  {
    id: "admin-web",
    name: "Editor Web & Contenidos",
    email: "webmaster@lumesa.mx",
    role: "admin_web",
    roleLabel: "Administrador Web (CMS / Contenidos)"
  },
  {
    id: "admin-tienda",
    name: "Gerente de E-commerce",
    email: "tienda@lumesa.mx",
    role: "admin_tienda",
    roleLabel: "Administrador Tienda (Productos / Pedidos)"
  }
];

export const INITIAL_ORDERS: OrderDetails[] = [];
