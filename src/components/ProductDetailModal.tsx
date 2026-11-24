import React from 'react';
import {
  X,
  CheckCircle,
  Download,
  Printer,
  Cpu,
  MessageCircle
} from 'lucide-react';
import { Product } from '../types';
import { buildRentalWhatsAppUrl } from '../utils/productHelpers';
import { downloadProductDatasheetPdf } from '../utils/productPdfGenerator';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, type?: 'compra' | 'renta') => void;
  onBuyNow?: (product: Product) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
  whatsappPhone?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  whatsappPhone
}) => {
  if (!isOpen || !product) return null;

  const hasExternalDatasheet = Boolean(product.datasheetUrl && product.datasheetUrl.trim().length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
      role="dialog"
      aria-modal="true"
      aria-label={`Especificaciones de ${product.name}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
      />

      {/* Centered Modal Window */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden border border-slate-200 z-10">
        {/* Top Navy Header Bar */}
        <div className="shrink-0 bg-[#102540] text-white px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-[#1E3A5F]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#F27C36] text-white shrink-0">
              {product.categoryLabel || 'Equipo Kyocera'}
            </span>
            <span className="text-xs sm:text-sm font-mono text-slate-200 truncate">
              SKU: {product.code}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0 ml-2 cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-5 sm:p-6 md:p-7 space-y-5">
          {/* Top Split: Product Image (Left) + Summary & Highlighted Features (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-start">
            {/* Left: Clean Product Image Only */}
            <div className="md:col-span-5">
              <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex items-center justify-center min-h-[200px] sm:min-h-[230px]">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="max-h-52 sm:max-h-56 w-auto object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 py-8">
                    <Printer className="w-16 h-16 mb-2 text-slate-300" />
                    <span className="text-xs font-medium">{product.code}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Description + Highlighted Features */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#102540] leading-snug">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5">
                    {product.description}
                  </p>
                )}
              </div>

              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#102540] mb-2.5">
                    Características Destacadas
                  </h3>
                  <ul className="space-y-1.5">
                    {product.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 leading-snug"
                      >
                        <CheckCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Full-Width Technical Specifications Card */}
          <div className="bg-[#F6F8FB] rounded-2xl p-4 sm:p-5 border border-slate-200/90">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#102540] mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Ficha de Especificaciones Técnicas</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-xs sm:text-[13px]">
              <div>
                <span className="text-slate-500 block">Tipo de impresión:</span>
                <span className="font-bold text-[#102540]">
                  {product.specs.tipoImpresion || (product.specs.color ? 'Color' : 'Blanco y negro')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Velocidad:</span>
                <span className="font-bold text-[#102540] tabular-nums">
                  {product.specs.velocidad || 'No especificado'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Resolución:</span>
                <span className="font-bold text-[#102540] tabular-nums">
                  {product.specs.resolucion || 'No especificado'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block">Ciclo máx. mensual:</span>
                <span className="font-bold text-[#102540] tabular-nums">
                  {product.specs.cicloMensual || 'No especificado'}
                </span>
              </div>

              {product.specs.volumenRecomendado && (
                <div>
                  <span className="text-slate-500 block">Volumen rec. mensual:</span>
                  <span className="font-bold text-[#102540] tabular-nums">
                    {product.specs.volumenRecomendado}
                  </span>
                </div>
              )}

              {product.specs.pantalla && (
                <div>
                  <span className="text-slate-500 block">Pantalla:</span>
                  <span className="font-bold text-[#102540]">
                    {product.specs.pantalla}
                  </span>
                </div>
              )}

              {product.specs.memoria && (
                <div>
                  <span className="text-slate-500 block">Memoria:</span>
                  <span className="font-bold text-[#102540]">
                    {product.specs.memoria}
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block">Formato de papel:</span>
                <span className="font-bold text-[#102540]">
                  {product.specs.formato || 'Carta / Oficio'}
                </span>
              </div>

              {product.specs.funcionesPrincipales && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Funciones principales:</span>
                  <span className="font-bold text-[#102540]">
                    {product.specs.funcionesPrincipales}
                  </span>
                </div>
              )}

              {product.specs.conectividad && product.specs.conectividad.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Conectividad / Interfaces:</span>
                  <span className="font-bold text-[#102540]">
                    {product.specs.conectividad.join(', ')}
                  </span>
                </div>
              )}

              {(product.specs.consumiblesPrincipales || product.specs.tipoTinta) && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Consumibles principales:</span>
                  <span className="font-bold text-[#102540]">
                    {product.specs.consumiblesPrincipales || product.specs.tipoTinta}
                  </span>
                </div>
              )}

              {product.specs.dimensiones && (
                <div>
                  <span className="text-slate-500 block">Dimensiones (An x Pr x Al):</span>
                  <span className="font-bold text-[#102540] tabular-nums">
                    {product.specs.dimensiones}
                  </span>
                </div>
              )}

              {product.specs.peso && (
                <div>
                  <span className="text-slate-500 block">Peso:</span>
                  <span className="font-bold text-[#102540] tabular-nums">
                    {product.specs.peso}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Actions Footer (Exactly 2 Clean Buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <a
              href={buildRentalWhatsAppUrl(product, whatsappPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-xl bg-[#169C46] hover:bg-[#13853B] active:bg-[#0F6E30] text-white font-bold text-sm transition flex items-center justify-center gap-2.5 shadow-sm text-center"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>Solicitar informes por WhatsApp</span>
            </a>

            {hasExternalDatasheet ? (
              <a
                href={product.datasheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full py-3.5 px-5 rounded-xl bg-[#102540] hover:bg-[#193860] active:bg-[#0B1B30] text-white font-bold text-sm transition flex items-center justify-center gap-2.5 shadow-sm text-center"
              >
                <Download className="w-5 h-5 shrink-0" />
                <span>Descargar ficha técnica en PDF</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => downloadProductDatasheetPdf(product)}
                className="w-full py-3.5 px-5 rounded-xl bg-[#102540] hover:bg-[#193860] active:bg-[#0B1B30] text-white font-bold text-sm transition flex items-center justify-center gap-2.5 shadow-sm cursor-pointer text-center"
              >
                <Download className="w-5 h-5 shrink-0" />
                <span>Descargar ficha técnica en PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
