export type AppSection = 
  | 'inicio'
  | 'nosotros'
  | 'renta_venta'
  | 'hardware'
  | 'software'
  | 'tienda'
  | 'contacto'
  | 'admin';

export type ProductCategory = 
  | 'todos'
  | 'multifuncionales-a3'
  | 'multifuncionales-a4'
  | 'impresoras'
  | 'produccion'
  | 'consumibles'
  | 'polizas'
  | string;

export interface StoreCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  active: boolean;
}

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
  stockQuantity?: number;
  minStockAlert?: number;
  datasheetUrl?: string;
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
  paymentMethod: 'spei' | 'tarjeta' | 'credito-empresarial' | 'mercadopago' | string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discountAmount?: number;
  discountCoupon?: string;
  total: number;
  date: string;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  internalNotes?: string;
  invoiceStatus?: 'pendiente' | 'emitida' | 'no_requerida';
  invoicePdfUrl?: string;
  invoiceXmlUrl?: string;
  cfdiUse?: string;
  taxRegime?: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'porcentaje' | 'monto_fijo';
  discountValue: number;
  minPurchase?: number;
  active: boolean;
  expiryDate?: string;
  usesCount: number;
  maxUses?: number;
}

export interface PaymentConfig {
  mercadoPago: {
    enabled: boolean;
    publicKey: string;
    accessToken: string;
    sandboxMode: boolean;
    acceptedMethods: {
      creditCard: boolean;
      debitCard: boolean;
      ticketOxxo: boolean;
      spei: boolean;
    };
  };
  bankTransfer: {
    enabled: boolean;
    bankName: string;
    accountHolder: string;
    clabe: string;
    accountNumber?: string;
    rfc: string;
  };
  shippingConfig: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    localCityFreeShipping: boolean;
    estimatedDays: string;
  };
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

export interface ContentVisibility {
  showTrustMetrics?: boolean;
  showQuickPortals?: boolean;
  showQueHacemos?: boolean;
  showSobreNosotros?: boolean;
  showAboutStats?: boolean;
  showSlideImages?: boolean;
  showCoverageMap?: boolean;
  showSoftwareHighlights?: boolean;
  showSoftwareSection?: boolean;
}

export interface PillarItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface SoftwareModuleItem {
  id: string;
  title: string;
  tagline: string;
  activeModule?: string;
  description: string;
  icon: string;
  benefits: string[];
}

export interface HardwareCategoryInfo {
  id: 'a3' | 'a4' | 'impresoras' | 'produccion' | string;
  name: string;
  subtitle: string;
  description: string;
}

export interface WhatsAppButtonConfig {
  label?: string;
  phone?: string;
  defaultMessage?: string;
  enabled?: boolean;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  target: AppSection | string;
}

export interface FooterConfig {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerPhone: string;
  bannerWhatsAppText: string;
  bannerWhatsAppUrl?: string;
  description: string;
  address: string;
  schedule: string;
  email: string;
  sectionsTitle: string;
  equiposTitle: string;
  equiposLinks: FooterLinkItem[];
  empresaTitle: string;
  empresaLinks: FooterLinkItem[];
  copyrightText: string;
}

export interface CoverageConfig {
  tag?: string;
  title?: string;
  text?: string;
  ctaText?: string;
}

export interface SiteContent {
  _lastUpdated?: number;
  slides: HeroSlide[];
  showTrustMetrics?: boolean;
  visibility?: ContentVisibility;
  trustMetrics: {
    value?: string;
    label: string;
    description: string;
  }[];
  about: {
    headline: string;
    subheadline: string;
    queHacemosTitle: string;
    queHacemosText: string;
    queHacemosBullets?: string[];
    queHacemosChips?: string[];
    sobreNosotrosTitle: string;
    sobreNosotrosText1: string;
    sobreNosotrosText2: string;
    clientsCount: string;
    experienceYears: string;
    pillars?: PillarItem[];
  };
  coverage?: CoverageConfig;
  hardwareSection?: {
    tag?: string;
    title?: string;
    subtitle?: string;
    categories?: HardwareCategoryInfo[];
  };
  softwareSection?: {
    tag?: string;
    title?: string;
    subtitle?: string;
    solutions?: SoftwareModuleItem[];
  };
  whatsappButton?: WhatsAppButtonConfig;
  contact: {
    tag?: string;
    title?: string;
    subtitle?: string;
    cardTitle?: string;
    cardSubtitle?: string;
    phone: string;
    tollFree: string;
    salesEmail: string;
    supportEmail: string;
    address: string;
    schedule: string;
    whatsapp: string;
    formButtonText?: string;
  };
  support: {
    annualPolicyPrice: number;
    responseTime: string;
    modalitySchedule: string;
  };
  storeCategories?: StoreCategory[];
  paymentConfig?: PaymentConfig;
  coupons?: DiscountCoupon[];
  footer?: FooterConfig;
}
