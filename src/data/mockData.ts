import { HeroSlide, Product } from '../types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tag: "Presentación / Marca y Experiencia",
    title: "Innovación y Tecnología Kyocera en México",
    subtitle: "Más de 30 años respaldando el éxito y la productividad de tu empresa con soluciones documentales de vanguardia.",
    ctaPrimaryText: "Explorar Soluciones",
    ctaPrimaryAction: "#hardware",
    ctaSecondaryText: "Ir a Tienda en Línea",
    ctaSecondaryAction: "#tienda",
    badgeText: "Distribuidor Oficial Autorizado",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
    features: [
      "Centro de distribución oficial de Kyocera Japón",
      "Sede en San Luis Potosí y cobertura en todo México",
      "+2,000 clientes corporativos satisfechos"
    ]
  },
  {
    id: 2,
    tag: "Hardware / Equipos (Venta y Renta)",
    title: "Equipos de Impresión de Alto Rendimiento",
    subtitle: "Renta y venta de multifuncionales A3 y A4. Optimiza tu espacio de trabajo con tecnología eficiente y confiable.",
    ctaPrimaryText: "Ver Catálogo de Equipos",
    ctaPrimaryAction: "#hardware",
    ctaSecondaryText: "Calculadora de Renta",
    ctaSecondaryAction: "#renta",
    badgeText: "Tecnología ECOSYS y TASKalfa",
    imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1920&q=80",
    features: [
      "Multifuncionales A3 (hasta 11\" x 17\") y A4 compactos",
      "Renta 100% deducible de impuestos",
      "Mantenimiento y tóner original incluidos"
    ]
  },
  {
    id: 3,
    tag: "Soporte y Servicios (Confianza y Respuesta)",
    title: "Soporte Técnico Especializado en Menos de 24 Horas",
    subtitle: "Ingenieros certificados, refacciones originales y pólizas de mantenimiento para que tu operación nunca se detenga.",
    ctaPrimaryText: "Solicitar Asistencia Técnica",
    ctaPrimaryAction: "#soporte",
    ctaSecondaryText: "Cotizar Póliza Anual",
    ctaSecondaryAction: "#contacto",
    badgeText: "Garantía de Respuesta < 24 Horas",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80",
    features: [
      "Ingenieros certificados directamente por Kyocera",
      "Stock permanente de refacciones y consumibles",
      "Pólizas anuales con 15% de descuento en refacciones"
    ]
  }
];

export const TRUST_METRICS = [
  {
    value: "+30",
    label: "Años de Experiencia",
    description: "Liderando soluciones de impresión y gestión documental en México"
  },
  {
    value: "+2,000",
    label: "Clientes Satisfechos",
    description: "Empresas, corporativos, escuelas y despachos a nivel nacional"
  },
  {
    value: "< 24h",
    label: "Respuesta Técnica",
    description: "Garantía de asistencia técnica y soporte en sitio"
  },
  {
    value: "100%",
    label: "Original Kyocera",
    description: "Consumibles certificados, cilindros cerámicos y refacciones genuinas"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "kyocera-taskalfa-3554ci",
    name: "Kyocera TASKalfa 3554ci",
    code: "TASKalfa 3554ci",
    category: "multifuncionales-a3",
    categoryLabel: "Multifuncional A3 Color",
    price: 89900,
    rentalPriceMonthly: 2850,
    badge: "Más Vendido A3",
    shortDescription: "Multifuncional color A3 inteligente de 35 ppm con IA integrada, pantalla táctil de 10.1\" y alta seguridad de datos.",
    description: "La TASKalfa 3554ci es la solución idónea para grupos de trabajo exigentes. Ofrece impresión, copia y escaneo a todo color en formatos hasta 11\" x 17\" (Doble Carta). Diseñada con componentes cerámicos de larguísima vida útil ECOSYS y seguridad de nivel gubernamental.",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    rating: 4.9,
    reviewsCount: 38,
    originalRef: "Compatible con Tóner TK-8527",
    specs: {
      velocidad: "35 ppm B&N y Color (Carta) / 17 ppm (Doble Carta)",
      formato: "A3, Doble Carta (11\" x 17\"), Oficio, Carta",
      resolucion: "1200 x 1200 dpi a profundidad de 2 bits",
      cicloMensual: "100,000 páginas mensuales",
      capacidadPapel: "1,150 hojas estándar (ampliable a 7,150)",
      tipoTinta: "Tóner polimerizado microfino cerámico",
      conectividad: ["Ethernet Gigabit", "USB 3.0", "Wi-Fi Direct Opcional", "AirPrint / Mopria"],
      duplex: true,
      red: true,
      color: true,
      peso: "95 kg con unidad básica",
      dimensiones: "602 x 665 x 790 mm"
    },
    features: [
      "Pantalla táctil intuitiva de 10.1 pulgadas estilo tablet",
      "Escaneo dúplex de un solo paso de hasta 200 ipm",
      "Funciones de Inteligencia Artificial para optimización de textos manuscritos",
      "Disco duro cifrado y borrado seguro de datos integrado"
    ]
  },
  {
    id: "kyocera-taskalfa-5054ci",
    name: "Kyocera TASKalfa 5054ci",
    code: "TASKalfa 5054ci",
    category: "multifuncionales-a3",
    categoryLabel: "Multifuncional A3 Color Alto Volumen",
    price: 124500,
    rentalPriceMonthly: 3950,
    badge: "Alto Volumen",
    shortDescription: "Equipo de alto rendimiento a 50 ppm, capacidad masiva de papel y alimentador dúplex de alta velocidad.",
    description: "Potencia corporativa sin interrupciones. Diseñada para centros de impresión corporativos y departamentos con grandes cargas de trabajo que demandan color vibrante y acabados profesionales en formato Doble Carta.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    rating: 5.0,
    reviewsCount: 24,
    originalRef: "Compatible con Tóner TK-8547",
    specs: {
      velocidad: "50 ppm B&N y Color",
      formato: "A3, Doble Carta, Oficio, Carta, Folio",
      resolucion: "1200 x 1200 dpi reales",
      cicloMensual: "160,000 páginas mensuales",
      capacidadPapel: "1,150 hojas estándar (expandible a 7,150)",
      tipoTinta: "Tóner ecológico cerámico Kyocera",
      conectividad: ["Gigabit Ethernet", "USB 3.0 Host", "NFC", "Cloud Connect"],
      duplex: true,
      red: true,
      color: true,
      peso: "95 kg",
      dimensiones: "602 x 665 x 790 mm"
    },
    features: [
      "Acabadores opcionales con grapado, perforado y doblado de folletos",
      "Sensor de detección ultrasónica de alimentación múltiple",
      "Compatibilidad nativa con Kyocera Net Manager y MyQ",
      "Componentes cerámicos garantizados para 600,000 impresiones"
    ]
  },
  {
    id: "kyocera-ecosys-m3655idn",
    name: "Kyocera ECOSYS M3655idn",
    code: "ECOSYS M3655idn",
    category: "multifuncionales-a4",
    categoryLabel: "Multifuncional A4 Monocromático",
    price: 43800,
    rentalPriceMonthly: 1590,
    badge: "Top Rentas A4",
    shortDescription: "Multifuncional ultra rápido a 57 ppm, escáner a doble cara en una pasada y costos de página mínimos.",
    description: "El caballo de batalla indiscutible para notarías, despachos contables, hospitales y oficinas que requieren velocidad extrema en blanco y negro en formatos Carta y Oficio con durabilidad legendaria Kyocera ECOSYS.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    rating: 4.8,
    reviewsCount: 52,
    originalRef: "Compatible con Tóner TK-3182 (21,000 páginas)",
    specs: {
      velocidad: "57 ppm Monocromático (B&N)",
      formato: "Carta, Oficio (hasta 8.5\" x 14\"), A4, Legal",
      resolucion: "1200 x 1200 dpi",
      cicloMensual: "250,000 páginas mensuales",
      capacidadPapel: "600 hojas estándar (expandible a 2,600)",
      tipoTinta: "Tóner monocomponente de alta duración",
      conectividad: ["Ethernet 10/100/1000", "USB 2.0", "Móvil Kyocera Print"],
      duplex: true,
      red: true,
      color: false,
      peso: "24.1 kg",
      dimensiones: "480 x 495 x 575 mm"
    },
    features: [
      "Velocidad de salida de primera copia en tan solo 4.9 segundos",
      "Alimentador automático de documentos dúplex de 100 hojas de un solo paso",
      "Pantalla táctil a color de 7 pulgadas con interfaz programable",
      "Cilindro cerámico con vida de 500,000 páginas"
    ]
  },
  {
    id: "kyocera-ecosys-ma4000cix",
    name: "Kyocera ECOSYS MA4000cix",
    code: "ECOSYS MA4000cix",
    category: "multifuncionales-a4",
    categoryLabel: "Multifuncional A4 Color",
    price: 36900,
    rentalPriceMonthly: 1390,
    badge: "Novedad Color",
    shortDescription: "Multifuncional compacto a color de 42 ppm con bajo consumo de energía y excelente fidelidad gráfica.",
    description: "Compacto y poderoso para empresas medianas. Imprime y digitaliza en color brillante con tecnología ECOSYS libre de ozono y reducción drástica de residuos corporativos.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    rating: 4.7,
    reviewsCount: 19,
    originalRef: "Compatible con Tóner TK-5382",
    specs: {
      velocidad: "42 ppm Color y B&N",
      formato: "Carta, Oficio, A4",
      resolucion: "1200 x 1200 dpi",
      cicloMensual: "100,000 páginas mensuales",
      capacidadPapel: "350 hojas estándar (hasta 2,000)",
      tipoTinta: "Micro-tóner ecológico Kyocera",
      conectividad: ["Gigabit Ethernet", "USB 2.0", "Wi-Fi (opcional)"],
      duplex: true,
      red: true,
      color: true,
      peso: "31 kg",
      dimensiones: "480 x 577 x 575 mm"
    },
    features: [
      "Impresión dúplex automática de fábrica",
      "Conectores en la nube para Google Drive y Microsoft OneDrive",
      "Impresión directa desde memoria USB con soporte PDF cifrado",
      "Certificación Energy Star de bajísimo consumo en reposo"
    ]
  },
  {
    id: "kyocera-ecosys-p3155dn",
    name: "Kyocera ECOSYS P3155dn",
    code: "ECOSYS P3155dn",
    category: "impresoras",
    categoryLabel: "Impresora Monocromática",
    price: 24900,
    rentalPriceMonthly: 980,
    badge: "Rendimiento Extremo",
    shortDescription: "Impresora láser de alto volumen a 57 ppm con costo operativo más bajo de su segmento.",
    description: "La impresora láser perfecta para oficinas con alto volumen de facturación o documentos que no requieren multifunción pero exigen velocidad inmediata y bajo costo por copia.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    rating: 4.9,
    reviewsCount: 44,
    originalRef: "Tóner TK-3182 (21,000 págs)",
    specs: {
      velocidad: "57 ppm B&N",
      formato: "Carta, Oficio, Legal, A4",
      resolucion: "1200 x 1200 dpi",
      cicloMensual: "250,000 páginas",
      capacidadPapel: "600 hojas (hasta 2,600)",
      tipoTinta: "Tóner negro monocomponente cerámico",
      conectividad: ["Gigabit Ethernet", "USB 2.0", "Mopria"],
      duplex: true,
      red: true,
      color: false,
      peso: "16.6 kg",
      dimensiones: "380 x 410 x 320 mm"
    },
    features: [
      "Tiempo de primera impresión de 4.5 segundos",
      "Display LCD con teclado alfanumérico para impresión con PIN confidencial",
      "Ranura para tarjeta SD para almacenamiento de fuentes y formularios",
      "Consumible único: únicamente se reemplaza el cartucho de tóner"
    ]
  },
  {
    id: "kyocera-taskalfa-pro-15000c",
    name: "Kyocera TASKalfa Pro 15000c",
    code: "Pro 15000c",
    category: "produccion",
    categoryLabel: "Impresora de Producción Inyección de Tinta",
    price: 1250000,
    rentalPriceMonthly: 35000,
    badge: "Producción Industrial",
    shortDescription: "Sistema de inyección de tinta de hoja suelta de ultra alta velocidad a 150 ppm para correo directo y transaccional.",
    description: "Revolución en impresión de producción digital. Combina la velocidad de las imprentas industriales con la flexibilidad de la hoja suelta y costos incomparables frente al tóner tradicional.",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    rating: 5.0,
    reviewsCount: 8,
    originalRef: "Tinta acuosa a base de pigmento Kyocera",
    specs: {
      velocidad: "150 ppm A4 / 75 ppm A3 (9,000 hojas/hora)",
      formato: "Desde A6 hasta banner 13\" x 19.2\" (330 x 487 mm)",
      resolucion: "600 x 600 dpi y 600 x 1200 dpi",
      cicloMensual: "1,000,000 de páginas mensuales",
      capacidadPapel: "4,150 hojas hasta 14,310 hojas",
      tipoTinta: "Tinta de pigmento Kyocera base agua ecológica",
      conectividad: ["Controller EFI Fiery", "TCP/IP Gigabit Dual"],
      duplex: true,
      red: true,
      color: true,
      peso: "308 kg módulo central",
      dimensiones: "1670 x 870 x 1150 mm"
    },
    features: [
      "Cabezales piezoeléctricos industriales de desarrollo propio Kyocera",
      "Sin generación de calor: no curva el papel ni afecta ventanas plásticas de sobres",
      "Costo por página hasta 70% inferior a prensas de tóner convencionales",
      "Soporte para papeles estándar de 52 a 360 g/m²"
    ]
  },
  {
    id: "toner-kyocera-tk-8527k",
    name: "Cartucho Tóner Negro Kyocera TK-8527K Original",
    code: "TK-8527K",
    category: "consumibles",
    categoryLabel: "Consumible Original",
    price: 2450,
    badge: "100% Genuino",
    shortDescription: "Tóner original negro para multifuncionales TASKalfa 3554ci / 4054ci con micropartículas cerámicas.",
    description: "Garantiza la máxima nitidez y el pulido continuo del cilindro fotosensible Kyocera. Rendimiento certificado de 30,000 páginas con cobertura al 5%.",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    rating: 4.9,
    reviewsCount: 94,
    specs: {
      velocidad: "N/A Consumible",
      formato: "Cartucho original con chip RFID",
      resolucion: "Polvo microfino ultra negro",
      cicloMensual: "Rendimiento aprox. 30,000 páginas",
      capacidadPapel: "N/A",
      tipoTinta: "Tóner original certificado Japón",
      conectividad: ["Chip autenticador Kyocera"],
      duplex: false,
      red: false,
      color: false
    },
    features: [
      "Protección total de la garantía de fábrica Kyocera",
      "Formulación con partículas pulidoras que extienden la vida del tambor",
      "Caja sellada de origen con holograma de autenticidad"
    ]
  },
  {
    id: "toner-kyocera-tk-3182",
    name: "Cartucho Tóner Kyocera TK-3182 Monocromático",
    code: "TK-3182",
    category: "consumibles",
    categoryLabel: "Consumible Original",
    price: 2190,
    badge: "21,000 Páginas",
    shortDescription: "Tóner negro de altísimo rendimiento para ECOSYS M3655idn, M3145idn y P3155dn.",
    description: "Cartucho genuino de alta capacidad con 21,000 páginas de rendimiento. Menos reemplazos, menor costo por hoja y residuos mínimos.",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    rating: 4.9,
    reviewsCount: 112,
    specs: {
      velocidad: "N/A Consumible",
      formato: "Cartucho hermético",
      resolucion: "Ultra definición",
      cicloMensual: "21,000 páginas certificadas ISO/IEC 19752",
      capacidadPapel: "N/A",
      tipoTinta: "Tóner ecológico ECOSYS",
      conectividad: ["Chip RFID"],
      duplex: false,
      red: false,
      color: false
    },
    features: [
      "100% reciclable",
      "Cero emisión de polvo perjudicial",
      "Fórmula especial para velocidades de más de 55 ppm"
    ]
  },
  {
    id: "poliza-anual-mantenimiento-pro",
    name: "Póliza Anual de Mantenimiento Preventivo & Correctivo",
    code: "POLIZA-ANUAL-PRO",
    category: "polizas",
    categoryLabel: "Servicio y Póliza",
    price: 14500,
    badge: "15% Desc. Refacciones",
    shortDescription: "Póliza integral anual con visitas preventivas trimestrales ilimitadas, correctivos y respuesta prioritaria en <24 hrs.",
    description: "La protección definitiva para el parque de impresión de tu empresa en San Luis Potosí y cobertura nacional. Ahorra el 100% en mano de obra en servicios correctivos y obtén 15% de descuento directo en refacciones y consumibles originales.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    inStock: true,
    rating: 5.0,
    reviewsCount: 67,
    specs: {
      velocidad: "Respuesta en < 24 horas",
      formato: "Atención a domicilio y en taller",
      resolucion: "Técnicos certificados Kyocera Japón",
      cicloMensual: "Visitas ilimitadas por fallas",
      capacidadPapel: "N/A",
      tipoTinta: "Descuento del 15% en consumibles",
      conectividad: ["Soporte remoto y telefónico 8x5"],
      duplex: true,
      red: true,
      color: true
    },
    features: [
      "Mantenimientos preventivos trimestrales programados",
      "Servicios correctivos ilimitados sin cobro por mano de obra",
      "15% de descuento preferencial en refacciones y tóner",
      "Equipo de respaldo en caso de reparación mayor prolongada"
    ]
  }
];

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
