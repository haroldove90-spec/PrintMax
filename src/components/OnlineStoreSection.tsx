import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Search, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  Eye, 
  Truck,
  RotateCcw,
  Sparkles
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
        if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
          return false;
        }
        if (colorFilter === 'color' && !product.specs.color) return false;
        if (colorFilter === 'mono' && product.specs.color) return false;
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
        return 0;
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
    <section id="tienda" className="py-20 bg-white text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Store Header with Official PrintMax Logo */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-10 border-b border-slate-200 gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Logo inside store header */}
            <div className="p-3 bg-black rounded-2xl border border-neutral-800 shadow-md inline-block w-fit">
              <img
                src="https://appdesignproyectos.com/printmaxlogo.png"
                alt="PrintMax Kyocera Tienda Oficial"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">
                <Store className="w-3.5 h-3.5 text-blue-500" />
                <span>Tienda Oficial en Línea</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Catálogo de Equipos, Tóner & Pólizas
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Compra y renta directa con facturación SAT (CFDI 4.0), garantía oficial y soporte técnico garantizado.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium text-slate-600">
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-blue-500 mr-1.5" />
              100% Original Kyocera
            </span>
            <span className="flex items-center">
              <Truck className="w-4 h-4 text-blue-500 mr-1.5" />
              Envío Nacional
            </span>
          </div>
        </div>

        {/* Filters and Controls Bar (Black Dominant with discrete blue accents) */}
        <div className="bg-black text-white p-4 sm:p-6 rounded-2xl border border-neutral-800 shadow-xl mb-10 space-y-4">
          {/* Top row: Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-neutral-900 text-white border border-blue-500/80 shadow-md'
                      : 'bg-black text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Bottom row: Search + Color filter + Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-neutral-800">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <input
                type="text"
                placeholder="Buscar por modelo, SKU o consumible..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 text-sm text-white placeholder-neutral-500 pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 transition"
              />
              <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Color Filter */}
            <div className="sm:col-span-3 flex items-center bg-neutral-900 rounded-xl border border-neutral-800 p-1">
              <button
                onClick={() => setColorFilter('all')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  colorFilter === 'all' ? 'bg-black text-white border border-neutral-700' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setColorFilter('color')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  colorFilter === 'color' ? 'bg-black text-blue-400 border border-blue-500/60' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Color
              </button>
              <button
                onClick={() => setColorFilter('mono')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  colorFilter === 'mono' ? 'bg-black text-white border border-neutral-700' : 'text-neutral-400 hover:text-white'
                }`}
              >
                B&N
              </button>
            </div>

            {/* Sort Selector */}
            <div className="sm:col-span-4 flex items-center space-x-2">
              <span className="text-xs font-bold text-neutral-400 whitespace-nowrap hidden lg:inline">
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-neutral-900 text-xs sm:text-sm text-white py-2.5 px-3 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-6 text-xs text-slate-500 font-medium">
          <span>Mostrando <strong>{filteredProducts.length}</strong> productos en existencia</span>
          {(searchQuery || selectedCategory !== 'todos' || colorFilter !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setColorFilter('all');
                setSearchQuery('');
              }}
              className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3 text-blue-500" />
              <span>Restablecer filtros</span>
            </button>
          )}
        </div>

        {/* Product Cards Grid: BLACK BACKGROUND CARDS with BLUE ICONS ONLY */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-black text-white rounded-2xl border border-neutral-800">
            <p className="text-neutral-300 font-semibold mb-2">No se encontraron productos con los filtros seleccionados.</p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setColorFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl border border-neutral-700"
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
                  className="bg-black text-white rounded-2xl border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Product Image Area inside black card */}
                  <div className="relative bg-[#070a0f] p-5 flex items-center justify-center h-52 border-b border-neutral-800/80 overflow-hidden">
                    {product.badge && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-900 text-white border border-neutral-700 shadow-sm">
                        {product.badge}
                      </span>
                    )}

                    <div className="absolute top-3 right-3 z-10 flex items-center space-x-1">
                      <button
                        onClick={() => onOpenProductDetail(product)}
                        className="p-1.5 rounded-lg bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition shadow-sm"
                        title="Vista rápida"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-40 w-auto object-contain transform group-hover:scale-105 transition duration-300"
                    />

                    {product.inStock && (
                      <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-neutral-300 bg-neutral-900/90 px-2 py-0.5 rounded-md border border-neutral-800 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse" />
                        Stock San Luis Potosí
                      </span>
                    )}
                  </div>

                  {/* Body with white typography and blue icons */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-black">
                    <div>
                      {/* Discrete blue text for category label */}
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">
                        {product.categoryLabel}
                      </div>

                      <h4 
                        onClick={() => onOpenProductDetail(product)}
                        className="text-base font-bold text-white hover:text-blue-400 transition cursor-pointer mb-1 line-clamp-1"
                        title={product.name}
                      >
                        {product.name}
                      </h4>

                      <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {product.specs.velocidad && product.category !== 'consumibles' && (
                        <div className="text-[11px] font-medium text-neutral-300 bg-neutral-900 px-2.5 py-1 rounded-md mb-4 inline-block border border-neutral-800">
                          <span className="text-blue-400 font-bold mr-1">⚡</span> {product.specs.velocidad}
                        </div>
                      )}
                    </div>

                    {/* Price & Action */}
                    <div>
                      <div className="pt-3 border-t border-neutral-800/80 mb-3">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Precio Neto (con IVA)</div>
                        <div className="text-lg font-black text-white">
                          ${product.price.toLocaleString('es-MX')} <span className="text-xs text-neutral-400 font-normal">MXN</span>
                        </div>
                        {product.rentalPriceMonthly && (
                          <div className="text-[11px] text-blue-400 font-medium mt-0.5">
                            Renta: ${product.rentalPriceMonthly.toLocaleString('es-MX')} / mes
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {/* Primary button: Black background with blue icon */}
                        <button
                          onClick={() => handleAddToCartWithFeedback(product, 'compra')}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                            isJustAdded
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-blue-500/80 shadow-sm'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span>¡Agregado al Carrito!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 text-blue-500" />
                              <span>Añadir al Carrito</span>
                            </>
                          )}
                        </button>

                        {product.rentalPriceMonthly && (
                          <button
                            onClick={() => handleAddToCartWithFeedback(product, 'renta')}
                            className="w-full py-1.5 px-3 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-black hover:bg-neutral-900 border border-neutral-800 transition text-center"
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
