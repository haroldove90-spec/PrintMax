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

export function buildRentalWhatsAppUrl(product: Product, whatsappPhone = '524448123000'): string {
  const cleanDigits = (whatsappPhone || '524448123000').replace(/\D/g, '') || '524448123000';
  const normalizedPhone = cleanDigits.length === 10 ? `52${cleanDigits}` : cleanDigits;
  const skuSuffix = product.code ? ` (SKU: ${product.code})` : '';
  const message = `Hola LUMESA, me interesa solicitar informes para rentar el producto: ${product.name}${skuSuffix}. ¿Me podrían brindar información de planes de renta y disponibilidad?`;
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
