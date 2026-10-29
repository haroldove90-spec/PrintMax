import { SiteContent, OrderDetails, AdminUser } from '../types';
import { HERO_SLIDES, TRUST_METRICS, PRODUCTS } from './mockData';

export const INITIAL_SITE_CONTENT: SiteContent = {
  slides: HERO_SLIDES,
  trustMetrics: TRUST_METRICS,
  about: {
    headline: "Tres Décadas de Liderazgo en Gestión Documental",
    subheadline: "Con base central en San Luis Potosí y cobertura a nivel nacional, respaldamos a más de 2,000 empresas con tecnología de impresión y soporte técnico especializado.",
    queHacemosTitle: "Qué Hacemos",
    queHacemosText: "Impulsamos la calidad, eficiencia y productividad en cada uno de sus procesos de gestión documental. Nos apasiona optimizar el rendimiento de su infraestructura tecnológica, por lo que ponemos a su disposición la venta, renta y soporte técnico especializado de equipos Kyocera. Respaldamos cada solución con ingenieros certificados directamente por Kyocera y un amplio stock de refacciones y consumibles originales, lo que nos permite garantizarle una respuesta y asistencia técnica en menos de 24 horas a partir de su llamada.",
    sobreNosotrosTitle: "Sobre Nosotros",
    sobreNosotrosText1: "Creemos firmemente que el motor de nuestro crecimiento como empresa y como personas es la absoluta satisfacción de cada cliente. Somos un centro de distribución oficial de Kyocera en México con sede en San Luis Potosí y más de dos décadas de trayectoria en el mercado.",
    sobreNosotrosText2: "Como representantes líderes en el sector de la impresión digital, respaldamos a una cartera de más de 2,000 clientes a nivel nacional con servicios de renta, venta y soporte técnico especializado. Desde una impresora esencial hasta robustas soluciones de software para el control y gestión del trabajo, le ofrecemos asesoramiento profesional, trato totalmente personalizado y un equipo en constante capacitación.",
    clientsCount: "+2,000",
    experienceYears: "+30"
  },
  contact: {
    phone: "(444) 812-3000",
    tollFree: "01 800 KYOCERA",
    salesEmail: "ventas@kmcorporacion.com.mx",
    supportEmail: "soporte@printmax.com.mx",
    address: "Av. Venustiano Carranza #1450, Col. Tequisquiapan, San Luis Potosí, S.L.P. C.P. 78230",
    schedule: "Lunes a Viernes de 09:00 a 18:00 hrs",
    whatsapp: "524448123000"
  },
  support: {
    annualPolicyPrice: 14500,
    responseTime: "Menos de 24 horas",
    modalitySchedule: "09:00 a 18:00 hrs"
  }
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-super",
    name: "Harold Ovalle (Super Admin)",
    email: "admin@printmax.mx",
    role: "super_admin",
    roleLabel: "Super Administrador (Web + Tienda)"
  },
  {
    id: "admin-web",
    name: "Editor Web & Contenidos",
    email: "webmaster@printmax.mx",
    role: "admin_web",
    roleLabel: "Administrador Web (CMS / Contenidos)"
  },
  {
    id: "admin-tienda",
    name: "Gerente de E-commerce",
    email: "tienda@printmax.mx",
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
