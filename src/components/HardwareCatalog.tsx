import React, { useState } from 'react';
import { 
  Printer, 
  FileSpreadsheet, 
  Check, 
  Plus, 
  Maximize2,
  ShoppingCart,
  Zap,
  MessageCircle
} from 'lucide-react';
import { Product, SiteContent } from '../types';
import { FormattedText } from './FormattedText';
import { allowsSale, allowsRent, buildRentalWhatsAppUrl } from '../utils/productHelpers';

interface HardwareCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, type?: 'compra' | 'renta') => void;
  onBuyNow: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
  comparedProducts: Product[];
  onToggleCompare: (product: Product) => void;
  onOpenComparator: () => void;
  content?: SiteContent['hardwareSection'];
  whatsappPhone?: string;
}

export const HardwareCatalog: React.FC<HardwareCatalogProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onOpenProductDetail,
  comparedProducts,
  onToggleCompare,
  onOpenComparator,
  content,
  whatsappPhone
}) => {
  const [activeTab, setActiveTab] = useState<'a3' | 'a4' | 'impresoras' | 'produccion'>('a3');

  const defaultCategories = [
    {
      id: 'a3' as const,
      name: 'Multifuncionales A3',
      subtitle: 'Carta, Oficio, Doble Carta | B&N y Color',
      description: 'Tecnología ECOSYS de larga duración y línea TASKalfa para bajo a alto volumen (hasta 11" x 17").',
      filter: (p: Product) => p.category === 'multifuncionales-a3'
    },
    {
      id: 'a4' as const,
      name: 'Multifuncionales A4',
      subtitle: 'Carta y Oficio | B&N y Color',
      description: 'Potencia y confiabilidad en formato compacto (hasta 8.5" x 14") para espacios reducidos.',
      filter: (p: Product) => p.category === 'multifuncionales-a4'
    },
    {
      id: 'impresoras' as const,
      name: 'Impresoras de Alto Rendimiento',
      subtitle: 'Carta, Oficio, Doble Carta | B&N y Color',
      description: 'Gama galardonada de productos con innovación Kyocera. Costos operativos extraordinariamente bajos.',
      filter: (p: Product) => p.category === 'impresoras'
    },
    {
      id: 'produccion' as const,
      name: 'Impresión de Producción',
      subtitle: 'Inyección de Tinta de Hoja Suelta',
      description: 'Impresoras de inyección de tinta de alta velocidad y gran volumen para aplicaciones transaccionales y correo directo.',
      filter: (p: Product) => p.category === 'produccion'
    }
  ];

  const categories = defaultCategories.map((defCat) => {
    const customCat = content?.categories?.find((c) => c.id === defCat.id);
    if (!customCat) return defCat;
    return {
      ...defCat,
      name: customCat.name || defCat.name,
      subtitle: customCat.subtitle || defCat.subtitle,
      description: customCat.description || defCat.description
    };
  });

  const currentCategory = categories.find((c) => c.id === activeTab)!;
  const filteredProducts = products.filter(currentCategory.filter);

  const sectionTag = content?.tag || 'Catálogo Oficial: Renta / Venta de Multifuncionales';
  const sectionTitle = content?.title || 'Equipos Kyocera en Renta y Venta Directa';
  const sectionSubtitle = content?.subtitle || 'Adquiera su multifuncional mediante compra definitiva o arrendamiento 100% deducible con tóner original y garantía directa LUMESA.';

  return (
    <section id="hardware" className="py-20 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#182F4F] text-white border border-[#394B61] text-xs font-bold uppercase tracking-wider mb-3">
              <Printer className="w-3.5 h-3.5 text-[#F27C36]" />
              <span>
                <FormattedText text={sectionTag} />
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#182F4F] tracking-tight">
              <FormattedText text={sectionTitle} />
            </h2>
            <div className="mt-3 text-[#394B61] max-w-2xl text-base">
              <FormattedText text={sectionSubtitle} />
            </div>
          </div>

          {/* Comparator Trigger */}
          <div className="mt-6 md:mt-0 flex items-center space-x-3">
            <button
              onClick={onOpenComparator}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#182F4F] text-white border border-[#394B61] hover:border-[#F27C36] text-xs font-bold transition shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#F27C36]" />
              <span>Comparador ({comparedProducts.length}/5 productos)</span>
            </button>
          </div>
        </div>

        {/* Category Tabs: LUMESA Foundation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {categories.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-[#182F4F] text-white border-[#F27C36] ring-1 ring-[#F27C36] shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#182F4F]'}`}>
                    {cat.name}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#F27C36]"></span>}
                </div>
                <div className={`text-xs ${isSelected ? 'text-[#F27C36]' : 'text-[#394B61]'} line-clamp-1 font-medium`}>
                  {cat.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Description Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#182F4F] text-white border border-[#394B61] mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#000000] text-[#F27C36] shrink-0 border border-[#394B61]">
              <Zap className="w-4 h-4 text-[#F27C36]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F27C36] uppercase tracking-wider block">
                <FormattedText text={currentCategory.subtitle} />
              </span>
              <div className="text-xs sm:text-sm text-slate-200 font-normal">
                <FormattedText text={currentCategory.description} />
              </div>
            </div>
          </div>
          <div className="shrink-0 text-xs text-slate-300 font-mono bg-[#000000] px-3 py-1.5 rounded-lg border border-[#394B61]">
            {filteredProducts.length} modelo(s)
          </div>
        </div>

        {/* Product Cards Grid: BLACK BACKGROUND WITH LUMESA ACCENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isCompared = comparedProducts.some((p) => p.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-[#000000] text-white rounded-2xl border border-neutral-800 hover:border-[#F27C36]/60 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Area */}
                <div className="relative bg-[#0b1320] p-6 flex items-center justify-center h-64 border-b border-neutral-800/80 overflow-hidden">
                  {product.badge && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-[#182F4F] text-white border border-[#394B61] shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                      isCompared
                        ? 'bg-[#182F4F] text-[#F27C36] border border-[#F27C36] shadow-md'
                        : 'bg-black/90 text-neutral-300 hover:text-white border border-neutral-700'
                    }`}
                    title={isCompared ? 'Quitar del comparador' : 'Agregar a comparador'}
                  >
                    {isCompared ? <Check className="w-3.5 h-3.5 text-[#F27C36]" /> : <Plus className="w-3.5 h-3.5 text-[#F27C36]" />}
                    <span>{isCompared ? 'En comparador' : 'Comparar'}</span>
                  </button>

                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-52 w-auto object-contain transform group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <Printer className="w-16 h-16 text-neutral-700 mb-2" />
                      <span className="text-xs font-mono text-neutral-400">{product.code}</span>
                    </div>
                  )}

                  <button
                    onClick={() => onOpenProductDetail(product)}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-[#182F4F] text-neutral-300 hover:text-white opacity-0 group-hover:opacity-100 transition border border-[#394B61]"
                    title="Ver Ficha Técnica"
                  >
                    <Maximize2 className="w-4 h-4 text-[#F27C36]" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-[#000000]">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#F27C36] uppercase tracking-wider">
                        {product.categoryLabel}
                      </span>
                      <span className="text-xs text-neutral-400 font-semibold">
                        ★ {product.rating} ({product.reviewsCount})
                      </span>
                    </div>

                    <h3 
                      onClick={() => onOpenProductDetail(product)}
                      className="text-lg font-bold text-white hover:text-[#F27C36] transition cursor-pointer mb-2 line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Quick Specs Badges */}
                    <div className="space-y-1.5 mb-6 text-xs text-neutral-300 border-t border-b border-neutral-800/80 py-3 bg-neutral-950 px-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Velocidad:</span>
                        <span className="font-semibold text-white">{product.specs.velocidad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Formato:</span>
                        <span className="font-semibold text-white">{product.specs.formato}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Resolución:</span>
                        <span className="font-semibold text-white">{product.specs.resolucion}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div>
                    <div className="mb-4">
                      {allowsSale(product) && (
                        <>
                          <div className="text-[11px] text-neutral-400 uppercase tracking-wide">
                            {product.price > 0 ? 'Precio de Venta (con IVA)' : 'Venta Directa'}
                          </div>
                          <div className="text-xl font-extrabold text-white">
                            {product.price > 0 ? (
                              <>
                                ${product.price.toLocaleString('es-MX')} <span className="text-xs text-neutral-400 font-normal">MXN</span>
                              </>
                            ) : (
                              <span className="text-base text-[#F27C36]">Disponible para Compra</span>
                            )}
                          </div>
                        </>
                      )}
                      {allowsRent(product) && (
                        <div className={`text-xs font-semibold text-emerald-400 ${allowsSale(product) ? 'mt-1' : ''}`}>
                          {product.rentalPriceMonthly && product.rentalPriceMonthly > 0 ? (
                            <>
                              Renta desde: <span className="text-white font-bold">${product.rentalPriceMonthly.toLocaleString('es-MX')} MXN/mes</span>
                            </>
                          ) : (
                            'Disponible en Renta (Informes por WhatsApp)'
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {allowsSale(product) && (
                        <button
                          onClick={() => onBuyNow(product)}
                          className="py-2.5 px-3 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-white" />
                          <span>Comprar Ahora</span>
                        </button>
                      )}

                      {allowsRent(product) && (
                        <a
                          href={buildRentalWhatsAppUrl(product, whatsappPhone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Solicitar Informes por WhatsApp</span>
                        </a>
                      )}

                      <button
                        onClick={() => onOpenProductDetail(product)}
                        className="py-2 px-3 rounded-xl bg-[#182F4F] hover:bg-[#394B61] text-white text-xs font-semibold transition text-center border border-[#394B61] cursor-pointer"
                      >
                        Ver Ficha Técnica
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
