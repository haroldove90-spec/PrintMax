import React, { useState } from 'react';
import { 
  Printer, 
  FileSpreadsheet, 
  Check, 
  Plus, 
  Maximize2,
  ShoppingCart,
  Zap
} from 'lucide-react';
import { Product } from '../types';

interface HardwareCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, type?: 'compra' | 'renta') => void;
  onOpenProductDetail: (product: Product) => void;
  comparedProducts: Product[];
  onToggleCompare: (product: Product) => void;
  onOpenComparator: () => void;
}

export const HardwareCatalog: React.FC<HardwareCatalogProps> = ({
  products,
  onAddToCart,
  onOpenProductDetail,
  comparedProducts,
  onToggleCompare,
  onOpenComparator
}) => {
  const [activeTab, setActiveTab] = useState<'a3' | 'a4' | 'impresoras' | 'produccion'>('a3');

  const categories = [
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

  const currentCategory = categories.find((c) => c.id === activeTab)!;
  const filteredProducts = products.filter(currentCategory.filter);

  return (
    <section id="hardware" className="py-20 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black text-white border border-neutral-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Printer className="w-3.5 h-3.5 text-blue-500" />
              <span>Hardware: Impresoras & Multifuncionales</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Equipos Kyocera de Alto Rendimiento
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl text-base">
              Escanee, copie e imprima con facilidad añadiendo un dispositivo premiado, fiable y eficiente a su espacio de trabajo.
            </p>
          </div>

          {/* Comparator Trigger */}
          <div className="mt-6 md:mt-0 flex items-center space-x-3">
            <button
              onClick={onOpenComparator}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-black text-white border border-neutral-800 hover:border-blue-500/80 text-xs font-bold transition shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-500" />
              <span>Comparador ({comparedProducts.length}/5 productos)</span>
            </button>
          </div>
        </div>

        {/* Category Tabs: Black Foundation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {categories.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-black text-white border-neutral-700 ring-1 ring-blue-500 shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {cat.name}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                </div>
                <div className={`text-xs ${isSelected ? 'text-blue-400' : 'text-slate-500'} line-clamp-1 font-medium`}>
                  {cat.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Description Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-black text-white border border-neutral-800 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2 rounded-lg bg-neutral-900 text-blue-500 shrink-0 border border-neutral-800">
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                {currentCategory.subtitle}
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal">
                {currentCategory.description}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
            {filteredProducts.length} modelo(s)
          </div>
        </div>

        {/* Product Cards Grid: BLACK BACKGROUND WITH BLUE ICONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isCompared = comparedProducts.some((p) => p.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-black text-white rounded-2xl border border-neutral-800 hover:border-neutral-700 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Area */}
                <div className="relative bg-[#070a0f] p-6 flex items-center justify-center h-64 border-b border-neutral-800/80 overflow-hidden">
                  {product.badge && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-neutral-900 text-white border border-neutral-700 shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                      isCompared
                        ? 'bg-neutral-900 text-blue-400 border border-blue-500/80 shadow-md'
                        : 'bg-black/90 text-neutral-300 hover:text-white border border-neutral-700'
                    }`}
                    title={isCompared ? 'Quitar del comparador' : 'Agregar a comparador'}
                  >
                    {isCompared ? <Check className="w-3.5 h-3.5 text-blue-500" /> : <Plus className="w-3.5 h-3.5 text-blue-500" />}
                    <span>{isCompared ? 'En comparador' : 'Comparar'}</span>
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-52 w-auto object-contain transform group-hover:scale-105 transition duration-500"
                  />

                  <button
                    onClick={() => onOpenProductDetail(product)}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-neutral-900 text-neutral-300 hover:text-white opacity-0 group-hover:opacity-100 transition border border-neutral-700"
                    title="Ver Ficha Técnica"
                  >
                    <Maximize2 className="w-4 h-4 text-blue-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-black">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        {product.categoryLabel}
                      </span>
                      <span className="text-xs text-neutral-400 font-semibold">
                        ★ {product.rating} ({product.reviewsCount})
                      </span>
                    </div>

                    <h3 
                      onClick={() => onOpenProductDetail(product)}
                      className="text-lg font-bold text-white hover:text-blue-400 transition cursor-pointer mb-2 line-clamp-1"
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
                      <div className="text-[11px] text-neutral-400 uppercase tracking-wide">Precio de Venta (con IVA)</div>
                      <div className="text-xl font-extrabold text-white">
                        ${product.price.toLocaleString('es-MX')} <span className="text-xs text-neutral-400 font-normal">MXN</span>
                      </div>
                      {product.rentalPriceMonthly && (
                        <div className="text-xs font-semibold text-blue-400 mt-0.5">
                          O Renta desde: <span className="text-white font-bold">${product.rentalPriceMonthly.toLocaleString('es-MX')} MXN/mes</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onAddToCart(product, 'compra')}
                        className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-neutral-700 hover:border-blue-500/80"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-blue-500" />
                        <span>Comprar</span>
                      </button>

                      {product.rentalPriceMonthly ? (
                        <button
                          onClick={() => onAddToCart(product, 'renta')}
                          className="py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-900 text-white border border-neutral-800 hover:border-neutral-700 text-xs font-bold transition flex items-center justify-center space-x-1"
                        >
                          <span>Rentar</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenProductDetail(product)}
                          className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition text-center border border-neutral-800"
                        >
                          Ficha Técnica
                        </button>
                      )}
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
