import React from 'react';
import { X, Trash2, ShoppingCart, Check, FileSpreadsheet } from 'lucide-react';
import { Product } from '../types';

interface ProductComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  onAddToCart: (product: Product, type?: 'compra' | 'renta') => void;
}

export const ProductComparatorModal: React.FC<ProductComparatorModalProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  onRemoveProduct,
  onClearAll,
  onAddToCart
}) => {
  if (!isOpen) return null;

  const specRows = [
    { label: 'Categoría', getValue: (p: Product) => p.categoryLabel },
    { label: 'Color / Monocromático', getValue: (p: Product) => p.specs.color ? 'A Todo Color y B&N' : 'Monocromático (B&N)' },
    { label: 'Velocidad de Impresión', getValue: (p: Product) => p.specs.velocidad },
    { label: 'Formato Máximo', getValue: (p: Product) => p.specs.formato },
    { label: 'Resolución de Salida', getValue: (p: Product) => p.specs.resolucion },
    { label: 'Ciclo Mensual de Trabajo', getValue: (p: Product) => p.specs.cicloMensual },
    { label: 'Capacidad de Papel', getValue: (p: Product) => p.specs.capacidadPapel },
    { label: 'Dúplex Automático', getValue: (p: Product) => p.specs.duplex ? 'Sí (Incluido)' : 'No' },
    { label: 'Conectividad de Red', getValue: (p: Product) => p.specs.conectividad ? p.specs.conectividad.join(', ') : 'Red estándar' },
    { label: 'Tecnología de Tinta', getValue: (p: Product) => p.specs.tipoTinta }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden border border-slate-100 my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                Comparador Técnico de Equipos Kyocera
              </h3>
              <p className="text-xs text-slate-400">
                Comparando {comparedProducts.length} de hasta 5 productos seleccionados
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {comparedProducts.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-red-400 transition"
              >
                Limpiar lista
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">No hay equipos para comparar</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Seleccione el botón "Comparar" en los modelos de multifuncionales o impresoras en la sección de Hardware para ver sus especificaciones frente a frente.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
              >
                Ver Catálogo de Hardware
              </button>
            </div>
          ) : (
            <div className="min-w-[700px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 w-44 bg-slate-50 rounded-tl-xl border-b border-slate-200">
                      Especificación
                    </th>
                    {comparedProducts.map((p) => (
                      <th
                        key={p.id}
                        className="p-4 text-center align-top bg-slate-50 border-b border-slate-200 min-w-[200px]"
                      >
                        <div className="relative">
                          <button
                            onClick={() => onRemoveProduct(p.id)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-white text-slate-400 hover:text-red-500 border border-slate-200 shadow-sm"
                            title="Quitar de comparación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-28 mx-auto object-contain mb-3"
                          />
                          <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                            {p.name}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500 block mb-2">
                            {p.code}
                          </span>
                          
                          <div className="text-base font-extrabold text-blue-600">
                            ${p.price.toLocaleString('es-MX')} MXN
                          </div>
                          {p.rentalPriceMonthly && (
                            <span className="text-[11px] text-slate-600 block">
                              Renta: ${p.rentalPriceMonthly.toLocaleString('es-MX')}/mes
                            </span>
                          )}

                          <button
                            onClick={() => onAddToCart(p, 'compra')}
                            className="mt-3 w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Comprar</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {specRows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="p-3.5 font-bold text-slate-700 bg-slate-50/80">
                        {row.label}
                      </td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="p-3.5 text-center font-medium text-slate-800">
                          {row.getValue(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Comparador oficial con datos de fichas técnicas Kyocera Japón.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Cerrar Comparador
          </button>
        </div>

      </div>
    </div>
  );
};
