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
        
        {/* Store Header with Official LUMESA Logo (Un-encapsulated, clean) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-10 border-b border-slate-200 gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Clean un-encapsulated LUMESA logo */}
            <img
              src="/lumesalogo.png"
              alt="LUMESA Tienda Oficial"
              className="h-11 sm:h-14 w-auto object-contain select-none"
              onError={(e) => {
                e.currentTarget.src = "https://appdesignproyectos.com/lumesalogo.png";
              }}
            />

            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#F27C36] mb-1">
                <Store className="w-3.5 h-3.5 text-[#F27C36]" />
                <span>Tienda Oficial en Línea</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#182F4F] tracking-tight">
                Catálogo de Equipos, Tóner & Pólizas
              </h2>
              <p className="text-xs sm:text-sm text-[#394B61] mt-1 max-w-xl">
                Compra y renta directa con facturación SAT (CFDI 4.0), garantía oficial LUMESA y soporte técnico garantizado en menos de 24 horas.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium text-[#394B61]">
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-[#F27C36] mr-1.5" />
              100% Original Kyocera
            </span>
            <span className="flex items-center">
              <Truck className="w-4 h-4 text-[#F27C36] mr-1.5" />
              Envío Nacional
            </span>
          </div>
        </div>

        {/* Filters and Controls Bar (LUMESA Navy & Slate with vibrant Orange accents) */}
        <div className="bg-[#182F4F] text-white p-4 sm:p-6 rounded-2xl border border-[#394B61] shadow-xl mb-10 space-y-4">
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
                      ? 'bg-[#F27C36] text-white shadow-md'
                      : 'bg-[#000000]/50 text-slate-300 border border-[#394B61] hover:text-white hover:border-[#F27C36]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Bottom row: Search + Color filter + Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-[#394B61]">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <input
                type="text"
                placeholder="Buscar por modelo, SKU o consumible..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#000000]/60 text-sm text-white placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36] transition"
              />
              <Search className="w-4 h-4 text-[#F27C36] absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Color Filter */}
            <div className="sm:col-span-3 flex items-center bg-[#000000]/60 rounded-xl border border-[#394B61] p-1">
              <button
                onClick={() => setColorFilter('all')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  colorFilter === 'all' ? 'bg-[#F27C36] text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setColorFilter('color')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  colorFilter === 'color' ? 'bg-[#F27C36] text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Color
              </button>
              <button
                onClick={() => setColorFilter('mono')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                  colorFilter === 'mono' ? 'bg-[#F27C36] text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                B&N
              </button>
            </div>

            {/* Sort Selector */}
            <div className="sm:col-span-4 flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-300 whitespace-nowrap hidden lg:inline">
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#000000]/60 text-xs sm:text-sm text-white py-2.5 px-3 rounded-xl border border-[#394B61] focus:outline-none focus:border-[#F27C36] font-medium"
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
                  className="bg-[#182F4F] text-white rounded-2xl border border-[#394B61] hover:border-[#F27C36] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Product Image Area inside card */}
                  <div className="relative bg-[#000000]/40 p-5 flex items-center justify-center h-52 border-b border-[#394B61] overflow-hidden">
                    {product.badge && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F27C36] text-white shadow-sm">
                        {product.badge}
                      </span>
                    )}

                    <div className="absolute top-3 right-3 z-10 flex items-center space-x-1">
                      <button
                        onClick={() => onOpenProductDetail(product)}
                        className="p-1.5 rounded-lg bg-[#394B61]/80 text-white hover:text-white hover:bg-[#000000] border border-[#394B61] transition shadow-sm"
                        title="Vista rápida"
                      >
                        <Eye className="w-4 h-4 text-[#F27C36]" />
                      </button>
                    </div>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-40 w-auto object-contain transform group-hover:scale-105 transition duration-300"
                    />

                    {product.inStock && (
                      <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-slate-200 bg-[#000000]/80 px-2 py-0.5 rounded-md border border-[#394B61] flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F27C36] mr-1.5 animate-pulse" />
                        Stock San Luis Potosí
                      </span>
                    )}
                  </div>

                  {/* Body with crisp typography and orange accents */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-[#182F4F]">
                    <div>
                      {/* Vibrant Orange text for category label */}
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#F27C36] mb-1">
                        {product.categoryLabel}
                      </div>

                      <h4 
                        onClick={() => onOpenProductDetail(product)}
                        className="text-base font-bold text-white hover:text-[#F27C36] transition cursor-pointer mb-1 line-clamp-1"
                        title={product.name}
                      >
                        {product.name}
                      </h4>

                      <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {product.specs.velocidad && product.category !== 'consumibles' && (
                        <div className="text-[11px] font-medium text-slate-200 bg-[#394B61]/60 px-2.5 py-1 rounded-md mb-4 inline-block border border-[#394B61]">
                          <span className="text-[#F27C36] font-bold mr-1">⚡</span> {product.specs.velocidad}
                        </div>
                      )}
                    </div>

                    {/* Price & Action */}
                    <div>
                      <div className="pt-3 border-t border-[#394B61] mb-3">
                        <div className="text-[10px] text-slate-300 uppercase tracking-wider">Precio Neto (con IVA)</div>
                        <div className="text-lg font-black text-white">
                          ${product.price.toLocaleString('es-MX')} <span className="text-xs text-slate-300 font-normal">MXN</span>
                        </div>
                        {product.rentalPriceMonthly && (
                          <div className="text-[11px] text-[#F27C36] font-medium mt-0.5">
                            Renta: ${product.rentalPriceMonthly.toLocaleString('es-MX')} / mes
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {/* Primary button: LUMESA Orange */}
                        <button
                          onClick={() => handleAddToCartWithFeedback(product, 'compra')}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                            isJustAdded
                              ? 'bg-emerald-700 text-white shadow-md'
                              : 'bg-[#F27C36] hover:bg-[#d96624] text-white shadow-md'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-4 h-4 text-white" />
                              <span>¡Agregado al Carrito!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 text-white" />
                              <span>Añadir al Carrito</span>
                            </>
                          )}
                        </button>

                        {product.rentalPriceMonthly && (
                          <button
                            onClick={() => handleAddToCartWithFeedback(product, 'renta')}
                            className="w-full py-1.5 px-3 rounded-xl text-xs font-medium text-slate-200 hover:text-white bg-[#000000]/60 hover:bg-[#394B61] border border-[#394B61] transition text-center"
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
