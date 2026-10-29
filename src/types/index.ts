export type AppSection = 
  | 'inicio'
  | 'tienda'
  | 'hardware'
  | 'renta'
  | 'software'
  | 'soporte'
  | 'nosotros'
  | 'contacto'
  | 'admin';

export type ProductCategory = 
  | 'todos'
  | 'multifuncionales-a3'
  | 'multifuncionales-a4'
  | 'impresoras'
  | 'produccion'
  | 'consumibles'
  | 'polizas';

export interface ProductSpec {
  velocidad: string;
  formato: string;
  resolucion: string;
  cicloMensual: string;
  capacidadPapel: string;
  tipoTinta: string;
  conectividad: string[];
  duplex: boolean;
  red: boolean;
  color: boolean;
  peso?: string;
  dimensiones?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  rentalPriceMonthly?: number;
  badge?: string;
  shortDescription: string;
  description: string;
  image: string;
  specs: ProductSpec;
  features: string[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  originalRef?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  acquisitionType: 'compra' | 'renta';
}

export type OrderStatus = 
  | 'pendiente' 
  | 'confirmado' 
  | 'en_proceso' 
  | 'enviado' 
  | 'entregado' 
  | 'cancelado';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  companyName: string;
  rfc: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: 'spei' | 'tarjeta' | 'credito-empresarial';
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  date: string;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

export interface HeroSlide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryAction: string;
  ctaSecondaryText: string;
  ctaSecondaryAction: string;
  badgeText: string;
  imageUrl: string;
  features: string[];
}

export type AdminRole = 'super_admin' | 'admin_web' | 'admin_tienda';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
}

export interface SiteContent {
  slides: HeroSlide[];
  trustMetrics: {
    value: string;
    label: string;
    description: string;
  }[];
  about: {
    headline: string;
    subheadline: string;
    queHacemosTitle: string;
    queHacemosText: string;
    sobreNosotrosTitle: string;
    sobreNosotrosText1: string;
    sobreNosotrosText2: string;
    clientsCount: string;
    experienceYears: string;
  };
  contact: {
    phone: string;
    tollFree: string;
    salesEmail: string;
    supportEmail: string;
    address: string;
    schedule: string;
    whatsapp: string;
  };
  support: {
    annualPolicyPrice: number;
    responseTime: string;
    modalitySchedule: string;
  };
}
