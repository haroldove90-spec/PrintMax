import React from 'react';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  ShoppingCart, 
  FileSpreadsheet, 
  Check, 
  Download, 
  Printer, 
  Layers, 
  Cpu
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, type?: 'compra' | 'renta') => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isCompared,
  onToggleCompare
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Centered Modal Window */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Sticky */}
        <div className="shrink-0 bg-slate-900 text-white px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-blue-600 text-white shrink-0">
              {product.categoryLabel}
            </span>
            <span className="text-xs sm:text-sm font-mono text-slate-400 truncate">SKU: {product.code}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 ml-2"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            
            {/* Left: Product Image & Badges */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-center justify-center mb-4 relative">
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-slate-900 text-white shadow-sm">
                    {product.badge}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-64 w-auto object-contain"
                />
              </div>

              {/* Guarantees */}
              <div className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Distribuidor Oficial Kyocera Japón</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Envío asegurado desde San Luis Potosí</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Soporte técnico certificado &lt; 24h</span>
                </div>
              </div>
            </div>

            {/* Right: Info, Specs, Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {product.name}
                </h2>

                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                  {product.description}
                </p>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                    Características Destacadas
                  </h4>
                  <ul className="space-y-1.5">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Specifications Table */}
                <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span>Ficha de Especificaciones Técnicas</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Velocidad:</span>
                      <span className="font-bold text-slate-800">{product.specs.velocidad}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Formato de papel:</span>
                      <span className="font-bold text-slate-800">{product.specs.formato}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Resolución:</span>
                      <span className="font-bold text-slate-800">{product.specs.resolucion}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ciclo mensual:</span>
                      <span className="font-bold text-slate-800">{product.specs.cicloMensual}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Capacidad de papel:</span>
                      <span className="font-bold text-slate-800">{product.specs.capacidadPapel}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Dúplex automático:</span>
                      <span className="font-bold text-slate-800">{product.specs.duplex ? 'Sí (Estándar)' : 'No'}</span>
                    </div>
                    {product.specs.conectividad && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-500 block">Conectividad:</span>
                        <span className="font-bold text-slate-800">{product.specs.conectividad.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs text-slate-500 block">Precio de Compra Directa (con IVA)</span>
                    <span className="text-2xl font-black text-slate-900">
                      ${product.price.toLocaleString('es-MX')} <span className="text-xs text-slate-500 font-normal">MXN</span>
                    </span>
                  </div>

                  {product.rentalPriceMonthly && (
                    <div className="mt-2 sm:mt-0 text-left sm:text-right">
                      <span className="text-xs text-blue-600 font-bold block">Opción de Renta Empresarial</span>
                      <span className="text-xl font-black text-blue-600">
                        ${product.rentalPriceMonthly.toLocaleString('es-MX')} <span className="text-xs text-slate-600 font-normal">MXN / mes</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(product, 'compra');
                      onClose();
                    }}
                    className="py-3 px-4 rounded-xl bg-black hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm border border-neutral-700 hover:border-blue-500 transition flex items-center justify-center space-x-2 shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                    <span>Añadir a Carrito</span>
                  </button>

                  {product.rentalPriceMonthly && (
                    <button
                      onClick={() => {
                        onAddToCart(product, 'renta');
                        onClose();
                      }}
                      className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition text-center"
                    >
                      Rentar Equipo
                    </button>
                  )}

                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                      isCompared
                        ? 'bg-blue-50 text-blue-700 border-blue-400'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isCompared ? <Check className="w-3.5 h-3.5" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
                    <span>{isCompared ? 'En Comparador' : 'Comparar'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
