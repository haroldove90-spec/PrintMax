import { SiteContent, OrderDetails, AdminUser, ContentVisibility } from '../types';
import { HERO_SLIDES, TRUST_METRICS, PRODUCTS, SOFTWARE_SOLUTIONS } from './mockData';

export const DEFAULT_VISIBILITY: ContentVisibility = {
  showTrustMetrics: true,
  showQuickPortals: true,
  showQueHacemos: true,
  showSobreNosotros: true,
  showAboutStats: true,
  showSlideImages: true,
  showCoverageMap: true,
  showSoftwareHighlights: false,
  showSoftwareSection: false
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  slides: HERO_SLIDES,
  showTrustMetrics: true,
  visibility: DEFAULT_VISIBILITY,
  trustMetrics: TRUST_METRICS,
  about: {
    headline: "Tres Décadas de Liderazgo en Gestión Documental",
    subheadline: "Con base central en San Luis Potosí y cobertura a nivel nacional, respaldamos a más de 2,000 empresas con tecnología de impresión y soporte técnico especializado.",
    queHacemosTitle: "Qué Hacemos",
    queHacemosText: "Impulsamos la calidad, eficiencia y productividad en cada uno de sus procesos de gestión documental. Nos apasiona optimizar el rendimiento de su infraestructura tecnológica, por lo que ponemos a su disposición la venta, renta y soporte técnico especializado de equipos Kyocera.",
    queHacemosBullets: [
      "Ingenieros certificados directamente por Kyocera y un amplio stock de refacciones y consumibles originales.",
      "Garantía de respuesta y asistencia técnica en menos de 24 horas a partir de su llamada."
    ],
    queHacemosChips: [
      "Renta Dedicada",
      "Venta de Hardware A3 / A4",
      "Tóner Original Certificado",
      "Pólizas Preventivas"
    ],
    sobreNosotrosTitle: "Sobre Nosotros",
    sobreNosotrosText1: "Creemos firmemente que el motor de nuestro crecimiento como empresa y como personas es la absoluta satisfacción de cada cliente. Somos un centro de distribución oficial de Kyocera en México con sede en San Luis Potosí y más de dos décadas de trayectoria en el mercado.",
    sobreNosotrosText2: "Como representantes líderes en el sector de la impresión digital, respaldamos a una cartera de más de 2,000 clientes a nivel nacional con servicios de renta, venta y soporte técnico especializado. Desde una impresora esencial hasta robustas soluciones de software para el control y gestión del trabajo, le ofrecemos asesoramiento profesional, trato totalmente personalizado y un equipo en constante capacitación.",
    clientsCount: "+2,000",
    experienceYears: "+30",
    pillars: [
      {
        id: "certificacion",
        title: "Certificación Directa Japón",
        description: "Garantía oficial LUMESA y soporte avalado por la fábrica con personal en constante actualización.",
        icon: "Award"
      },
      {
        id: "ceramicos",
        title: "Componentes Cerámicos ECOSYS",
        description: "Cilindros de silicio amorfo de larga duración que reducen costos drásticamente.",
        icon: "Cpu"
      },
      {
        id: "hub",
        title: "Hub San Luis Potosí",
        description: "Envío exprés y distribución ágil de consumibles y piezas a todo el país.",
        icon: "MapPin"
      }
    ]
  },
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
  ]
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

export const INITIAL_ORDERS: OrderDetails[] = [
  {
    orderId: "KM-849201",
    customerName: "Ing. Carlos Villalobos",
    companyName: "Grupo Metalmecánico del Bajío S.A.",
    rfc: "GMB140922TR4",
    email: "carlos.v@grupobajio.com.mx",
    phone: "444 820 4455",
    address: "Parque Industrial San Luis, Eje 120 #340",
    city: "San Luis Potosí",
    state: "San Luis Potosí",
    postalCode: "78395",
    paymentMethod: "spei",
    status: "en_proceso",
    trackingNumber: "FEDEX-MX-984210",
    date: "28/10/2026, 11:30",
    items: [
      {
        product: PRODUCTS[0],
        quantity: 1,
        acquisitionType: "renta"
      },
      {
        product: PRODUCTS[6], // Tóner TK-8527K
        quantity: 2,
        acquisitionType: "compra"
      }
    ],
    subtotal: 7750,
    tax: 1240,
    shipping: 0,
    total: 8990,
    notes: "Entregar en puerta de almacén 3. Requiere capacitación técnica."
  },
  {
    orderId: "KM-849188",
    customerName: "Lic. Mariana Escobedo",
    companyName: "Notaría Pública No. 24",
    rfc: "ESC920315PL8",
    email: "mescobedo@notaria24slp.com",
    phone: "444 815 1200",
    address: "Calle Los Bravo #410, Centro Histórico",
    city: "San Luis Potosí",
    state: "San Luis Potosí",
    postalCode: "78000",
    paymentMethod: "tarjeta",
    status: "confirmado",
    date: "27/10/2026, 16:45",
    items: [
      {
        product: PRODUCTS[2], // ECOSYS M3655idn
        quantity: 1,
        acquisitionType: "compra"
      }
    ],
    subtotal: 43800,
    tax: 7008,
    shipping: 0,
    total: 50808,
    notes: "Factura urgente para cierre de mes."
  }
];
