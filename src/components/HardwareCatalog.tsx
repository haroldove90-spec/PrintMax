import React, { useState } from 'react';
import { 
  Printer, 
  Layers, 
  FileCheck, 
  Zap, 
  FileSpreadsheet, 
  Check, 
  Plus, 
  ChevronRight,
  Maximize2,
  ShoppingCart
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
      description: 'Tecnología ECOSYS de larga duración y línea TASKalfa para bajo a alto volumen (hasta 11" x 17"). Rendimiento superior en digitalización e impresión continua.',
      filter: (p: Product) => p.category === 'multifuncionales-a3'
    },
    {
      id: 'a4' as const,
      name: 'Multifuncionales A4',
      subtitle: 'Carta y Oficio | B&N y Color',
      description: 'Potencia y confiabilidad en formato compacto (hasta 8.5" x 14") para espacios reducidos, despachos, sucursales y notarías con exigencia de alta velocidad.',
      filter: (p: Product) => p.category === 'multifuncionales-a4'
    },
    {
      id: 'impresoras' as const,
      name: 'Impresoras de Alto Rendimiento',
      subtitle: 'Carta, Oficio, Doble Carta | B&N y Color',
      description: 'Gama galardonada de productos con innovación Kyocera. Costos por página extraordinariamente bajos con cilindros cerámicos de vida extendida.',
      filter: (p: Product) => p.category === 'impresoras'
    },
    {
      id: 'produccion' as const,
      name: 'Impresión de Producción',
      subtitle: 'Inyección de Tinta de Hoja Suelta',
      description: 'Impresoras de inyección de tinta de ultra alta velocidad (150 ppm) y gran volumen para aplicaciones transaccionales, imprentas comerciales y correo directo.',
      filter: (p: Product) => p.category === 'produccion'
    }
  ];

  const currentCategory = categories.find((c) => c.id === activeTab)!;
  const filteredProducts = products.filter(currentCategory.filter);

  return (
    <section id="hardware" className="py-20 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Sección 4 • Hardware e Infraestructura</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Impresoras & Multifuncionales Kyocera
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl text-base sm:text-lg">
              Escanee, copie e imprima con facilidad añadiendo un dispositivo premiado, fiable y eficiente a su espacio de trabajo. Explore nuestro portafolio para elevar la agilidad operativa de su empresa.
            </p>
          </div>

          {/* Comparator Trigger Pill */}
          <div className="mt-6 md:mt-0 flex items-center space-x-3">
            <button
              onClick={onOpenComparator}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition shadow-sm ${
                comparedProducts.length > 0 
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Comparador ({comparedProducts.length}/5 productos)</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {categories.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {cat.name}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                </div>
                <div className={`text-xs ${isSelected ? 'text-blue-300' : 'text-slate-500'} line-clamp-1`}>
                  {cat.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                {currentCategory.subtitle}
              </span>
              <p className="text-sm text-slate-600 font-medium">
                {currentCategory.description}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            {filteredProducts.length} modelo(s) disponibles
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isCompared = comparedProducts.some((p) => p.id === product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-blue-400"
              >
                {/* Image & Top Badges */}
                <div className="relative bg-slate-100/60 p-6 flex items-center justify-center h-64 border-b border-slate-100 overflow-hidden">
                  {product.badge && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-blue-600 text-white shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                      isCompared
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white/90 text-slate-700 hover:bg-white shadow-sm border border-slate-200'
                    }`}
                    title={isCompared ? 'Quitar del comparador' : 'Agregar a comparador (hasta 5)'}
                  >
                    {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isCompared ? 'En comparador' : 'Comparar'}</span>
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-52 w-auto object-contain transform group-hover:scale-105 transition duration-500"
                  />

                  <button
                    onClick={() => onOpenProductDetail(product)}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                    title="Ver Ficha Técnica Detallada"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {product.categoryLabel}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        ★ {product.rating} ({product.reviewsCount})
                      </span>
                    </div>

                    <h3 
                      onClick={() => onOpenProductDetail(product)}
                      className="text-lg font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer mb-2 line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Quick Specs Badges */}
                    <div className="space-y-1.5 mb-6 text-xs text-slate-600 border-t border-b border-slate-100 py-3 bg-slate-50/50 px-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Velocidad:</span>
                        <span className="font-semibold text-slate-800">{product.specs.velocidad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Formato:</span>
                        <span className="font-semibold text-slate-800">{product.specs.formato}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Resolución:</span>
                        <span className="font-semibold text-slate-800">{product.specs.resolucion}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div>
                    <div className="mb-4">
                      <div className="text-[11px] text-slate-500 uppercase tracking-wide">Precio de Venta (Neto con IVA)</div>
                      <div className="text-xl font-extrabold text-slate-900">
                        ${product.price.toLocaleString('es-MX')} <span className="text-xs text-slate-500 font-normal">MXN</span>
                      </div>
                      {product.rentalPriceMonthly && (
                        <div className="text-xs font-semibold text-blue-600 mt-0.5">
                          O Renta desde: <span className="text-slate-900 font-bold">${product.rentalPriceMonthly.toLocaleString('es-MX')} MXN/mes</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onAddToCart(product, 'compra')}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Comprar</span>
                      </button>

                      {product.rentalPriceMonthly ? (
                        <button
                          onClick={() => onAddToCart(product, 'renta')}
                          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-1"
                        >
                          <span>Rentar</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenProductDetail(product)}
                          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition text-center"
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
