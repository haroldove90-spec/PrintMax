import { Product, ProductListingType } from '../types';

export function getProductListingType(product: Product): ProductListingType {
  if (product.listingType === 'venta' || product.listingType === 'renta' || product.listingType === 'ambos') {
    return product.listingType;
  }
  const specListing = (product.specs as unknown as Record<string, unknown> | undefined)?.listingType;
  if (specListing === 'venta' || specListing === 'renta' || specListing === 'ambos') {
    return specListing;
  }
  const hasRentalPrice = Boolean(product.rentalPriceMonthly && product.rentalPriceMonthly > 0);
  const hasSalePrice = Boolean(product.price && product.price > 0);
  if (hasRentalPrice && !hasSalePrice) return 'renta';
  if (hasRentalPrice && hasSalePrice) return 'ambos';
  return 'venta';
}

export function allowsSale(product: Product): boolean {
  const mode = getProductListingType(product);
  return mode === 'venta' || mode === 'ambos';
}

export function allowsRent(product: Product): boolean {
  const mode = getProductListingType(product);
  return mode === 'renta' || mode === 'ambos';
}

export function getListingTypeLabel(mode: ProductListingType): string {
  if (mode === 'renta') return 'Solo Renta';
  if (mode === 'ambos') return 'Venta y Renta';
  return 'Solo Venta';
}

export function getProductBrandAndModel(product: Product): string {
  const rawName = (product.name || '').trim();
  if (!rawName) return 'Kyocera';
  if (/kyocera/i.test(rawName)) return rawName;
  return `Kyocera ${rawName}`;
}

export function buildRentalWhatsAppUrl(product: Product, whatsappPhone = '524448123000'): string {
  const cleanDigits = (whatsappPhone || '524448123000').replace(/\D/g, '') || '524448123000';
  const normalizedPhone = cleanDigits.length === 10 ? `52${cleanDigits}` : cleanDigits;
  const brandAndModel = getProductBrandAndModel(product);
  const message = `Hola, estoy interesado en la renta del equipo ${brandAndModel}. Me gustaría recibir más información.`;
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

export function buildPurchaseWhatsAppUrl(product: Product, whatsappPhone = '524448123000'): string {
  const cleanDigits = (whatsappPhone || '524448123000').replace(/\D/g, '') || '524448123000';
  const normalizedPhone = cleanDigits.length === 10 ? `52${cleanDigits}` : cleanDigits;
  const brandAndModel = getProductBrandAndModel(product);
  const message = `Hola, estoy interesado en la compra del equipo ${brandAndModel}. Me gustaría recibir más información.`;
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

const SUPABASE_DATASHEETS_BASE =
  'https://mzxmiwvesflacxxerlxl.supabase.co/storage/v1/object/public/fichas%20tecnicas/';

const OFFICIAL_KYOCERA_DATASHEETS: Record<string, string> = {
  'ecosysm2540dw': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('ECOSYS_M2540dw_Spec_Sheet_ES (2) (1).pdf')}`,
  'ecosysma3500cix': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('Especificaciones_ECOSYS_MA3500cix_MX_V2_27062024 (1).pdf')}`,
  'ecosysma4000wifxl': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('Especificaciones_ECOSYS-MA4000wifxL_MX_V2_21052025 (1).pdf')}`,
  'ecosysma4000xl': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('Especificaciones_ECOSYS-MA4000xL_MX_19032025 (2) (1).pdf')}`,
  'ecosysma4500ix': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('Especificaciones_ECOSYS MA4500ix_MX_V2_02102023 (1) (1).pdf')}`,
  'ecosysma5500ifx': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('Especificaciones_ECOSYS_MA5500ifx_MX_V3.1_14112025 (1) (1).pdf')}`,
  'ecosyspa4000wx': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('Especificaciones_ECOSYS_PA4000wx_MX_03012025 (1).pdf')}`,
  'ecosyspa5500x': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('Especificaciones_ECOSYS_PA5500x_MX_20032025 (1) (1).pdf')}`,
  'taskalfa308ci': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('Especificaciones_TASKalfa_308ci_MX_V2_24052021 (1).pdf')}`,
  'taskalfamz2501ci': `${SUPABASE_DATASHEETS_BASE}${encodeURIComponent('Especificaciones_TASKalfa_MZ2501ci_MX_V3.1_14112025 (1).pdf')}`
};

function normalizeModelKey(value?: string): string {
  return (value || '')
    .toLowerCase()
    .replace(/kyocera/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Normalizes a datasheet URL. If a Supabase Dashboard preview URL is pasted by an admin,
 * automatically converts it into its corresponding public Supabase Storage URL.
 */
export function normalizeDatasheetUrl(rawUrl?: string): string | undefined {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return undefined;

  try {
    const parsed = new URL(trimmed);
    const dashboardMatch = parsed.pathname.match(
      /^\/dashboard\/project\/([^/]+)\/storage\/files\/buckets\/([^/]+)$/
    );
    const previewFile = parsed.searchParams.get('preview');
    if (parsed.hostname === 'supabase.com' && dashboardMatch && previewFile) {
      const projectRef = dashboardMatch[1];
      const bucket = dashboardMatch[2];
      return `https://${projectRef}.supabase.co/storage/v1/object/public/${bucket}/${encodeURIComponent(previewFile)}`;
    }
  } catch {
    // Return raw string if URL parsing fails
  }

  return trimmed;
}

export function resolveProductDatasheetUrl(
  product: Pick<Product, 'code' | 'name' | 'datasheetUrl'>
): string | undefined {
  const explicitUrl = normalizeDatasheetUrl(product.datasheetUrl);
  if (explicitUrl) return explicitUrl;

  const codeKey = normalizeModelKey(product.code);
  if (codeKey && OFFICIAL_KYOCERA_DATASHEETS[codeKey]) {
    return OFFICIAL_KYOCERA_DATASHEETS[codeKey];
  }

  const nameKey = normalizeModelKey(product.name);
  if (nameKey && OFFICIAL_KYOCERA_DATASHEETS[nameKey]) {
    return OFFICIAL_KYOCERA_DATASHEETS[nameKey];
  }

  for (const [modelKey, url] of Object.entries(OFFICIAL_KYOCERA_DATASHEETS)) {
    if ((codeKey && codeKey.includes(modelKey)) || (nameKey && nameKey.includes(modelKey))) {
      return url;
    }
  }

  return undefined;
}

export function getDatasheetDownloadFilename(product: Pick<Product, 'name' | 'code'>): string {
  const raw = (product.name || product.code || 'Equipo_Kyocera')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `Ficha_Tecnica_${raw || 'Equipo_Kyocera'}.pdf`;
}

export function buildDatasheetDownloadUrl(
  datasheetUrl: string,
  product: Pick<Product, 'name' | 'code'>
): string {
  const filename = getDatasheetDownloadFilename(product);
  try {
    const parsed = new URL(datasheetUrl);
    if (
      parsed.hostname.endsWith('.supabase.co') &&
      parsed.pathname.includes('/storage/v1/object/public/')
    ) {
      parsed.searchParams.set('download', filename);
      return parsed.toString();
    }
  } catch {
    // Fallback to original URL
  }
  return datasheetUrl;
}

