import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle,
  FileText,
  MessageCircle,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Printer
} from 'lucide-react';
import { Product } from '../types';
import { buildPurchaseWhatsAppUrl } from '../utils/productHelpers';
import { downloadProductDatasheetPdf } from '../utils/productPdfGenerator';

interface ProductPurchaseModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, type?: 'compra' | 'renta') => void;
  whatsappPhone?: string;
}

function resolveSubtitle(product: Product): string {
  const cat = (product.category || '').toLowerCase();
  const label = (product.categoryLabel || '').toLowerCase();
  const combined = `${cat} ${label} ${product.specs?.formato || ''} ${product.name || ''}`.toLowerCase();

  if (
    cat === 'consumibles' ||
    cat === 'polizas' ||
    label.includes('tóner') ||
    label.includes('toner') ||
    label.includes('consumible') ||
    label.includes('póliza')
  ) {
    return product.categoryLabel || 'Consumible / Servicio';
  }

  const isPrinter =
    cat === 'impresoras' ||
    (label.includes('impresora') && !label.includes('multifuncional')) ||
    /\bpa\d/i.test(product.name || '');

  const format =
    combined.includes('a3') || combined.includes('doble carta') || combined.includes('11 x 17')
      ? 'A3'
      : 'A4';

  const tipo = (product.specs?.tipoImpresion || '').toLowerCase();
  const isColor =
    product.specs?.color === true ||
    (tipo.includes('color') && !tipo.includes('monocrom') && !tipo.includes('blanco y negro')) ||
    /\dci\b|\bcix\b|\bcx\b/i.test(product.name || '');

  return `${isPrinter ? 'Impresora' : 'Multifuncional'} ${format} · ${isColor ? 'Color' : 'Blanco y negro'}`;
}

function resolveSpeedText(product: Product): string | null {
  const raw = (product.specs?.velocidad || '').trim();
  if (!raw) return null;
  const match = raw.match(/(\d+(?:\.\d+)?)/);
  return match ? `${match[1]} PPM` : raw;
}

function resolveFormatShort(product: Product): string | null {
  const combined = `${product.category || ''} ${product.categoryLabel || ''} ${product.specs?.formato || ''}`.toLowerCase();
  if (combined.includes('a3') || combined.includes('doble carta') || combined.includes('11 x 17')) {
    return 'A3';
  }
  if (combined.includes('a4') || combined.includes('carta') || combined.includes('oficio')) {
    return 'A4';
  }
  return product.specs?.formato || null;
}

export const ProductPurchaseModal: React.FC<ProductPurchaseModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  whatsappPhone
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.image && product.image.trim()) {
      list.push(product.image.trim());
    }
    if (Array.isArray(product.gallery)) {
      for (const img of product.gallery) {
        if (img && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      }
    }
    return list;
  }, [product]);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [product?.id, isOpen]);

  if (!isOpen || !product) return null;

  const hasExternalDatasheet = Boolean(
    product.datasheetUrl && product.datasheetUrl.trim().length > 0
  );

  const subtitle = resolveSubtitle(product);
  const speedText = resolveSpeedText(product);
  const formatText = resolveFormatShort(product);
  const isColor =
    product.specs?.color === true ||
    ((product.specs?.tipoImpresion || '').toLowerCase().includes('color') &&
      !(product.specs?.tipoImpresion || '').toLowerCase().includes('monocrom'));

  const keyHighlights: string[] = [];
  if (product.specs?.funcionesPrincipales) {
    keyHighlights.push(`Funciones: ${product.specs.funcionesPrincipales}`);
  } else if (product.features && product.features.length > 0) {
    keyHighlights.push(product.features[0]);
  }
  if (speedText) {
    keyHighlights.push(`Velocidad: ${speedText}`);
  }
  if (formatText) {
    keyHighlights.push(`Formato: ${formatText}`);
  }
  keyHighlights.push(isColor ? 'Color' : 'Blanco y negro');

  // If fewer than 4 items, supplement from product.features cleanly
  if (keyHighlights.length < 4 && Array.isArray(product.features)) {
    for (const feat of product.features) {
      if (keyHighlights.length >= 4) break;
      if (feat && !keyHighlights.some((h) => h.toLowerCase() === feat.toLowerCase())) {
        keyHighlights.push(feat);
      }
    }
  }

  const activeImage = images[activeImageIdx] || '';
  const canNavigateGallery = images.length > 1;

  const handlePrevImage = () => {
    if (!canNavigateGallery) return;
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    if (!canNavigateGallery) return;
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
      role="dialog"
      aria-modal="true"
      aria-label={`Compra de ${product.name}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
      />

      {/* Centered Purchase Modal */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden border border-slate-200 z-10">
        {/* Top Navy Header Bar */}
        <div className="shrink-0 bg-[#102540] text-white px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-[#1E3A5F]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F27C36] text-white shrink-0">
              {product.categoryLabel || 'Equipo Kyocera'}
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-slate-500/70 shrink-0" />
            <span className="text-sm sm:text-base font-bold text-white truncate">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0 ml-2 cursor-pointer"
            aria-label="Cerrar ventana de compra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-5 sm:p-7">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* Left Column: Product Gallery */}
            <div className="md:col-span-6 flex flex-col items-center">
              <div className="w-full h-56 sm:h-64 bg-white rounded-2xl border border-slate-100 flex items-center justify-center p-4">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Printer className="w-16 h-16 text-slate-300 mb-2" />
                    <span className="text-xs font-mono text-slate-400">{product.code}</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Carousel Strip */}
              {images.length > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2.5 w-full">
                  {canNavigateGallery && (
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#102540] hover:bg-slate-100 transition cursor-pointer"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}

                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {images.map((imgUrl, idx) => {
                      const isActive = idx === activeImageIdx;
                      return (
                        <button
                          key={`${imgUrl}-${idx}`}
                          type="button"
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-14 h-14 rounded-xl bg-white p-1.5 border-2 flex items-center justify-center transition shrink-0 cursor-pointer ${
                            isActive
                              ? 'border-[#F27C36] shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                          }`}
                          aria-label={`Ver imagen ${idx + 1} de ${product.name}`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${product.name} vista ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                          />
                        </button>
                      );
                    })}
                  </div>

                  {canNavigateGallery && (
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#102540] hover:bg-slate-100 transition cursor-pointer"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Title, Price & Key Features */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#102540] tracking-tight leading-snug">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
              </div>

              {/* Sale Price */}
              <div>
                {product.price > 0 ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-black text-[#F27C36] tracking-tight tabular-nums">
                      $ {product.price.toLocaleString('es-MX')} MXN
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                      Precio de venta
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xl sm:text-2xl font-black text-[#F27C36] tracking-tight">
                      Consultar precio de venta
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                      Disponible para compra directa
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm sm:text-base font-extrabold text-[#102540] mb-3">
                  Características principales
                </h3>

                <ul className="space-y-2">
                  {keyHighlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug"
                    >
                      <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar: PDF Link + WhatsApp Info + Add to Cart */}
          <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* 1. Descargar ficha técnica (PDF) */}
            {hasExternalDatasheet ? (
              <a
                href={product.datasheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-bold text-[#1D63D6] hover:text-[#144BA8] underline underline-offset-4 py-2 transition whitespace-nowrap"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Descargar ficha técnica (PDF)</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => downloadProductDatasheetPdf(product)}
                className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-bold text-[#1D63D6] hover:text-[#144BA8] underline underline-offset-4 py-2 transition whitespace-nowrap cursor-pointer"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Descargar ficha técnica (PDF)</span>
              </button>
            )}

            {/* 2. Solicitar información por WhatsApp + 3. Agregar al carrito */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href={buildPurchaseWhatsAppUrl(product, whatsappPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#E3F8EA] hover:bg-[#CFF2DB] text-[#0E6B32] text-xs sm:text-[13px] font-bold transition inline-flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4 text-[#169C46] shrink-0" />
                <span className="leading-tight">Solicitar información por WhatsApp</span>
              </a>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => onAddToCart(product, 'compra')}
                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                  product.inStock
                    ? 'bg-[#102540] hover:bg-[#193860] active:bg-[#0B1B30] text-white shadow-sm cursor-pointer'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span>{product.inStock ? 'Agregar al carrito' : 'Sin existencia'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
