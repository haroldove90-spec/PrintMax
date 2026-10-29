import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Eye, 
  Tag, 
  Truck,
  RotateCcw
} from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface OnlineStoreSectionProps {
  products: Product[];
  onAddToCart: (product: Product, type?: 'compra' | 'renta') => void;
  onOpenProductDetail: (product: Product) => void;
  initialSearchQuery?: string;
}

export const OnlineStoreSection: React.FC<OnlineStoreSectionProps> = ({
  products,
  onAddToCart,
  onOpenProductDetail,
  initialSearchQuery = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
  const [colorFilter, setColorFilter] = useState<'all' | 'color' | 'mono'>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  // Sync prop changes if user searched in header
  React.useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'todos', label: 'Todo el Catálogo' },
    { id: 'multifuncionales-a3', label: 'Multifuncionales A3' },
    { id: 'multifuncionales-a4', label: 'Multifuncionales A4' },
    { id: 'impresoras', label: 'Impresoras Láser' },
    { id: 'consumibles', label: 'Tóner y Consumibles' },
    { id: 'polizas', label: 'Pólizas de Servicio' }
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
          return false;
        }
        // Color filter
        if (colorFilter === 'color' && !product.specs.color) return false;
        if (colorFilter === 'mono' && product.specs.color) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchCode = product.code.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchCat = product.categoryLabel.toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchDesc && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // default featured order
      });
  }, [products, selectedCategory, colorFilter, searchQuery, sortBy]);

  const handleAddToCartWithFeedback = (product: Product, type: 'compra' | 'renta' = 'compra') => {
    onAddToCart(product, type);
    setAddedNoticeId(product.id);
    setTimeout(() => {
      setAddedNoticeId(null);
    }, 1800);
  };

  return (
    <section id="tienda" className="py-20 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Introduction */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Store className="w-4 h-4 text-blue-600" />
              <span>Tienda Oficial en Línea Kyocera México</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Equipos, Tóner Original & Pólizas
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl text-base">
              Compre o rente de forma segura con facturación fiscal mexicana (CFDI 4.0), garantía de fábrica Kyocera y despacho exprés asegurado a cualquier estado de la República Mexicana.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center text-blue-600">
              <ShieldCheck className="w-4 h-4 mr-1" />
              100% Original Garantizado
            </span>
            <span className="flex items-center text-emerald-600">
              <Truck className="w-4 h-4 mr-1" />
              Envío Nacional Asegurado
            </span>
          </div>
        </div>

        {/* Filters and Controls Bar */}
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 mb-10 space-y-4">
          {/* Top row: Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Bottom row: Search + Color filter + Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-200">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <input
                type="text"
                placeholder="Buscar por modelo, SKU o consumible..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-sm text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Color Filter */}
            <div className="sm:col-span-3 flex items-center bg-white rounded-xl border border-slate-300 p-1">
              <button
                onClick={() => setColorFilter('all')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  colorFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setColorFilter('color')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  colorFilter === 'color' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Color
              </button>
              <button
                onClick={() => setColorFilter('mono')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  colorFilter === 'mono' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                B&N
              </button>
            </div>

            {/* Sort Selector */}
            <div className="sm:col-span-4 flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden lg:inline">
                Ordenar por:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white text-xs sm:text-sm text-slate-700 py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 shadow-sm font-medium"
              >
                <option value="featured">Destacados y Relevancia</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-6 text-xs text-slate-500 font-medium">
          <span>Mostrando <strong>{filteredProducts.length}</strong> productos</span>
          {(searchQuery || selectedCategory !== 'todos' || colorFilter !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setColorFilter('all');
                setSearchQuery('');
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        {/* Store Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-600 font-semibold mb-2">No se encontraron productos con los filtros seleccionados.</p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setColorFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isJustAdded = addedNoticeId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Product Image Area */}
                  <div className="relative bg-slate-50/70 p-5 flex items-center justify-center h-52 border-b border-slate-100 overflow-hidden">
                    {product.badge && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-sm">
                        {product.badge}
                      </span>
                    )}

                    <div className="absolute top-3 right-3 z-10 flex items-center space-x-1">
                      <button
                        onClick={() => onOpenProductDetail(product)}
                        className="p-1.5 rounded-lg bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white shadow-sm transition"
                        title="Vista rápida"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-40 w-auto object-contain transform group-hover:scale-105 transition duration-300"
                    />

                    {product.inStock && (
                      <span className="absolute bottom-2 left-3 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                        Stock en SLP
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                        {product.categoryLabel}
                      </div>

                      <h4 
                        onClick={() => onOpenProductDetail(product)}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer mb-1 line-clamp-1"
                        title={product.name}
                      >
                        {product.name}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {product.specs.velocidad && product.category !== 'consumibles' && (
                        <div className="text-[11px] font-medium text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-md mb-4 inline-block">
                          ⚡ {product.specs.velocidad}
                        </div>
                      )}
                    </div>

                    {/* Price & Action */}
                    <div>
                      <div className="pt-2 border-t border-slate-100 mb-3">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Precio de Lista (con IVA)</div>
                        <div className="text-lg font-black text-slate-900">
                          ${product.price.toLocaleString('es-MX')} <span className="text-xs text-slate-500 font-normal">MXN</span>
                        </div>
                        {product.rentalPriceMonthly && (
                          <div className="text-[11px] text-blue-600 font-semibold">
                            Renta: ${product.rentalPriceMonthly.toLocaleString('es-MX')} / mes
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <button
                          onClick={() => handleAddToCartWithFeedback(product, 'compra')}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-[0.99]'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>¡Agregado al Carrito!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              <span>Añadir al Carrito</span>
                            </>
                          )}
                        </button>

                        {product.rentalPriceMonthly && (
                          <button
                            onClick={() => handleAddToCartWithFeedback(product, 'renta')}
                            className="w-full py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition text-center"
                          >
                            Agregar como Renta Mensual
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
