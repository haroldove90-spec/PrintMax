export type ProductCategory = 
  | 'todos'
  | 'multifuncionales-a3'
  | 'multifuncionales-a4'
  | 'impresoras'
  | 'produccion'
  | 'consumibles'
  | 'polizas';

export interface ProductSpec {
  velocidad: string; // e.g. "35 ppm B&N y Color"
  formato: string; // e.g. "Hasta Doble Carta (11\" x 17\")"
  resolucion: string; // e.g. "1200 x 1200 dpi"
  cicloMensual: string; // e.g. "100,000 páginas"
  capacidadPapel: string; // e.g. "1,150 a 7,150 hojas"
  tipoTinta: string; // e.g. "Tóner microfino cerámico de larga duración"
  conectividad: string[]; // ["Ethernet Gigabit", "USB 3.0", "Wi-Fi Direct", "Móvil"]
  duplex: boolean;
  red: boolean;
  color: boolean;
  peso?: string;
  dimensiones?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string; // e.g. "TASKalfa 3554ci"
  category: ProductCategory;
  categoryLabel: string;
  price: number; // in MXN
  rentalPriceMonthly?: number; // in MXN for leasing
  badge?: string; // "Más Vendido", "A3 Pro", "Ecológico ECOSYS", "Nuevo"
  shortDescription: string;
  description: string;
  image: string;
  specs: ProductSpec;
  features: string[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  originalRef?: string; // e.g. "Compatible con Tóner TK-8527"
}

export interface CartItem {
  product: Product;
  quantity: number;
  acquisitionType: 'compra' | 'renta';
}

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
