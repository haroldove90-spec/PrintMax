import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Printer,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  Gauge,
  FileText,
  SlidersHorizontal,
  Download
} from 'lucide-react';
import { Product, StoreCategory } from '../types';
import {
  buildRentalWhatsAppUrl,
  resolveProductDatasheetUrl,
  buildDatasheetDownloadUrl,
  getDatasheetDownloadFilename
} from '../utils/productHelpers';

interface OnlineStoreSectionProps {
  products: Product[];
  onAddToCart: (product: Product, type?: 'compra' | 'renta') => void;
  onBuyNow: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
  initialSearchQuery?: string;
  categories?: StoreCategory[];
  whatsappPhone?: string;
}

type EquipmentTypeKey = 'multifuncionales' | 'impresoras' | 'otros';
type PrintTechKey = 'color' | 'mono';
type PaperFormatKey = 'A3' | 'A4';
type SortOption = 'featured' | 'speed-desc' | 'name-asc' | 'price-asc' | 'price-desc';

function getEquipmentType(product: Product): EquipmentTypeKey {
  const cat = (product.category || '').toLowerCase();
  const label = (product.categoryLabel || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  if (
    cat === 'consumibles' ||
    cat === 'polizas' ||
    label.includes('tóner') ||
    label.includes('toner') ||
    label.includes('consumible') ||
    label.includes('póliza') ||
    label.includes('poliza')
  ) {
    return 'otros';
  }
  if (
    cat === 'impresoras' ||
    (label.includes('impresora') && !label.includes('multifuncional')) ||
    /\bpa\d/i.test(name) ||
    /\bp\d{4}/i.test(name)
  ) {
    return 'impresoras';
  }
  return 'multifuncionales';
}

function getPrintTech(product: Product): PrintTechKey {
  const tipo = (product.specs?.tipoImpresion || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  if (product.specs?.color === true) return 'color';
  if (tipo.includes('color') && !tipo.includes('monocrom') && !tipo.includes('blanco y negro')) {
    return 'color';
  }
  if (/\dci\b|\bcix\b|\bcx\b/.test(name)) {
    return 'color';
  }
  return 'mono';
}

function getPaperFormat(product: Product): PaperFormatKey | null {
  const eqType = getEquipmentType(product);
  if (eqType === 'otros') return null;

  const combined = `${product.category || ''} ${product.categoryLabel || ''} ${product.specs?.formato || ''} ${product.name || ''}`.toLowerCase();
  if (
    combined.includes('a3') ||
    combined.includes('doble carta') ||
    combined.includes('11 x 17') ||
    combined.includes('11x17') ||
    combined.includes('tabloide') ||
    combined.includes('mz2501')
  ) {
    return 'A3';
  }
  return 'A4';
}

function getSpeedValue(product: Product): number {
  const raw = product.specs?.velocidad || '';
  const match = raw.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function getSpeedDisplay(product: Product): string {
  const raw = (product.specs?.velocidad || '').trim();
  if (!raw) return '—';
  const match = raw.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    return `${match[1]} PPM`;
  }
  return raw.toUpperCase();
}

function getCardSubtitle(product: Product): string {
  const eqType = getEquipmentType(product);
  if (eqType === 'otros') {
    return product.categoryLabel || 'Consumible / Servicio';
  }
  const typeText = eqType === 'impresoras' ? 'Impresora' : 'Multifuncional';
  const format = getPaperFormat(product);
  const techText = getPrintTech(product) === 'color' ? 'Color' : 'Blanco y negro';
  return `${typeText}${format ? ` ${format}` : ''} · ${techText}`;
}

export const OnlineStoreSection: React.FC<OnlineStoreSectionProps> = ({
  products,
  onBuyNow,
  onOpenProductDetail,
  initialSearchQuery = '',
  whatsappPhone
}) => {
  const [selectedTypes, setSelectedTypes] = useState<EquipmentTypeKey[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<PrintTechKey[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<PaperFormatKey[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const [openGroups, setOpenGroups] = useState({
    type: true,
    tech: true,
    format: true
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Dynamic counts computed from the live catalog
  const facetCounts = useMemo(() => {
    const counts = {
      multifuncionales: 0,
      impresoras: 0,
      otros: 0,
      color: 0,
      mono: 0,
      A3: 0,
      A4: 0
    };
    for (const p of products) {
      const eq = getEquipmentType(p);
      counts[eq] += 1;
      if (eq !== 'otros') {
        const tech = getPrintTech(p);
        counts[tech] += 1;
        const fmt = getPaperFormat(p);
        if (fmt === 'A3') counts.A3 += 1;
        if (fmt === 'A4') counts.A4 += 1;
      }
    }
    return counts;
  }, [products]);

  const activeFiltersCount =
    selectedTypes.length + selectedTechs.length + selectedFormats.length;

  const hasAnyFilterOrSearch = activeFiltersCount > 0 || searchQuery.trim().length > 0;

  const toggleType = (key: EquipmentTypeKey) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const toggleTech = (key: PrintTechKey) => {
    setSelectedTechs((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const toggleFormat = (key: PaperFormatKey) => {
    setSelectedFormats((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedTechs([]);
    setSelectedFormats([]);
    setSearchQuery('');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedTypes.length > 0) {
          const eq = getEquipmentType(product);
          if (!selectedTypes.includes(eq)) return false;
        }
        if (selectedTechs.length > 0) {
          const tech = getPrintTech(product);
          if (!selectedTechs.includes(tech)) return false;
        }
        if (selectedFormats.length > 0) {
          const fmt = getPaperFormat(product);
          if (!fmt || !selectedFormats.includes(fmt)) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchCode = (product.code || '').toLowerCase().includes(q);
          const matchDesc = (product.description || '').toLowerCase().includes(q);
          const matchCat = (product.categoryLabel || '').toLowerCase().includes(q);
          const matchSpeed = (product.specs?.velocidad || '').toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchDesc && !matchCat && !matchSpeed) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'speed-desc') return getSpeedValue(b) - getSpeedValue(a);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'es');
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, selectedTypes, selectedTechs, selectedFormats, searchQuery, sortBy]);

  const renderFilterGroups = () => (
    <div className="space-y-5">
      {/* Tipo de equipo */}
      <div className="border-b border-slate-200/80 pb-4">
        <button
          type="button"
          onClick={() => setOpenGroups((prev) => ({ ...prev, type: !prev.type }))}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-[#102540] cursor-pointer"
        >
          <span>Tipo de equipo</span>
          {openGroups.type ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openGroups.type && (
          <div className="mt-3 space-y-2.5">
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none hover:text-[#102540]">
              <input
                type="checkbox"
                checked={selectedTypes.includes('multifuncionales')}
                onChange={() => toggleType('multifuncionales')}
                className="w-4 h-4 rounded border-slate-300 text-[#102540] accent-[#102540] cursor-pointer"
              />
              <span className="tabular-nums">
                Multifuncionales ({facetCounts.multifuncionales})
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none hover:text-[#102540]">
              <input
                type="checkbox"
                checked={selectedTypes.includes('impresoras')}
                onChange={() => toggleType('impresoras')}
                className="w-4 h-4 rounded border-slate-300 text-[#102540] accent-[#102540] cursor-pointer"
              />
              <span className="tabular-nums">
                Impresoras ({facetCounts.impresoras})
              </span>
            </label>

            {facetCounts.otros > 0 && (
              <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none hover:text-[#102540]">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('otros')}
                  onChange={() => toggleType('otros')}
                  className="w-4 h-4 rounded border-slate-300 text-[#102540] accent-[#102540] cursor-pointer"
                />
                <span className="tabular-nums">
                  Consumibles y Pólizas ({facetCounts.otros})
                </span>
              </label>
            )}
          </div>
        )}
      </div>

      {/* Tecnología de impresión */}
      <div className="border-b border-slate-200/80 pb-4">
        <button
          type="button"
          onClick={() => setOpenGroups((prev) => ({ ...prev, tech: !prev.tech }))}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-[#102540] cursor-pointer"
        >
          <span>Tecnología de impresión</span>
          {openGroups.tech ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openGroups.tech && (
          <div className="mt-3 space-y-2.5">
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none hover:text-[#102540]">
              <input
                type="checkbox"
                checked={selectedTechs.includes('color')}
                onChange={() => toggleTech('color')}
                className="w-4 h-4 rounded border-slate-300 text-[#102540] accent-[#102540] cursor-pointer"
              />
              <span className="tabular-nums">Color ({facetCounts.color})</span>
            </label>

            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none hover:text-[#102540]">
              <input
                type="checkbox"
                checked={selectedTechs.includes('mono')}
                onChange={() => toggleTech('mono')}
                className="w-4 h-4 rounded border-slate-300 text-[#102540] accent-[#102540] cursor-pointer"
              />
              <span className="tabular-nums">Blanco y negro ({facetCounts.mono})</span>
            </label>
          </div>
        )}
      </div>

      {/* Formato de papel */}
      <div className="pb-2">
        <button
          type="button"
          onClick={() => setOpenGroups((prev) => ({ ...prev, format: !prev.format }))}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-[#102540] cursor-pointer"
        >
          <span>Formato de papel</span>
          {openGroups.format ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {openGroups.format && (
          <div className="mt-3 space-y-2.5">
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none hover:text-[#102540]">
              <input
                type="checkbox"
                checked={selectedFormats.includes('A3')}
                onChange={() => toggleFormat('A3')}
                className="w-4 h-4 rounded border-slate-300 text-[#102540] accent-[#102540] cursor-pointer"
              />
              <span className="tabular-nums">A3 ({facetCounts.A3})</span>
            </label>

            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none hover:text-[#102540]">
              <input
                type="checkbox"
                checked={selectedFormats.includes('A4')}
                onChange={() => toggleFormat('A4')}
                className="w-4 h-4 rounded border-slate-300 text-[#102540] accent-[#102540] cursor-pointer"
              />
              <span className="tabular-nums">A4 ({facetCounts.A4})</span>
            </label>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <button
        type="button"
        onClick={clearAllFilters}
        disabled={!hasAnyFilterOrSearch}
        className={`w-full py-2.5 px-4 rounded-full border text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
          hasAnyFilterOrSearch
            ? 'border-slate-300 bg-white text-[#102540] hover:border-[#F27C36] hover:text-[#F27C36] shadow-xs'
            : 'border-slate-200 bg-slate-50 text-slate-400 cursor-default'
        }`}
      >
        <X className="w-3.5 h-3.5" />
        <span>Limpiar filtros</span>
      </button>
    </div>
  );

  return (
    <section
      id="tienda"
      className="bg-white text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] min-h-[75vh]"
    >
      {/* Top Section Banner ("Equipos de impresión") */}
      <div className="relative overflow-hidden bg-gradient-to-r from-white via-[#F9FAFC] to-[#EEF2F6] border-b border-slate-200/90">
        {/* Mobile Orange Banner Accent ABOVE Title (< md) */}
        <div className="md:hidden relative h-12 w-full overflow-hidden bg-gradient-to-r from-[#F27C36] via-[#FF8A3D] to-[#E66418]">
          <svg
            aria-hidden="true"
            viewBox="0 0 400 48"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
          >
            <path
              d="M0,48 C95,12 225,6 400,26 L400,48 Z"
              fill="#FFFFFF"
              opacity="0.96"
            />
            <path
              d="M150,48 C230,22 320,18 400,32 L400,48 Z"
              fill="#F9FAFC"
            />
          </svg>
        </div>

        {/* Desktop Orange Curved Sweep on Right (md+, without floating equipment image) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 600 220"
          preserveAspectRatio="none"
          className="hidden md:block absolute right-0 bottom-0 h-full w-[52%] lg:w-[46%] pointer-events-none select-none"
        >
          <defs>
            <linearGradient id="lumesaBannerOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8A3D" />
              <stop offset="100%" stopColor="#E66418" />
            </linearGradient>
          </defs>
          <path
            d="M120,220 C210,70 360,18 600,14 L600,220 Z"
            fill="url(#lumesaBannerOrange)"
          />
          <path
            d="M270,220 C340,120 450,82 600,76 L600,220 Z"
            fill="#F4F6F9"
            opacity="0.92"
          />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:py-8 lg:py-10 flex items-center justify-between gap-6">
          {/* Left: Vertical orange accent + Title & Subtitle */}
          <div className="flex items-stretch gap-3 sm:gap-4 max-w-xl z-10">
            <span
              aria-hidden="true"
              className="w-1.5 rounded-full bg-[#F27C36] shrink-0"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-[#102540] tracking-tight leading-tight text-balance">
                Equipos de impresión
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-1.5 leading-relaxed">
                Conoce nuestra selección de equipos Kyocera disponibles para renta y venta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 xl:gap-8">
          {/* Desktop Left Sidebar Filters */}
          <aside
            aria-label="Filtros de equipos"
            className="hidden lg:block w-60 xl:w-64 shrink-0 bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 sticky top-24"
          >
            <h2 className="text-base font-extrabold text-[#102540] mb-5">
              Filtrar equipos
            </h2>
            {renderFilterGroups()}
          </aside>

          {/* Right Column: Search/Sort Bar + Product Grid */}
          <div className="flex-1 min-w-0 w-full">
            {/* Desktop Search, Count & Sort Row */}
            <div className="hidden lg:flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por modelo (ej. MA3500cix)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-sm text-slate-900 placeholder-slate-400 pl-10 pr-9 py-2.5 rounded-xl border border-slate-300/90 focus:outline-none focus:border-[#102540] transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm font-bold text-[#102540] tabular-nums whitespace-nowrap">
                  {filteredProducts.length}{' '}
                  {filteredProducts.length === 1 ? 'equipo' : 'equipos'}
                </span>

                <span aria-hidden="true" className="h-4 w-px bg-slate-300" />

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="desktop-sort-select"
                    className="text-sm text-slate-600 whitespace-nowrap"
                  >
                    Ordenar por:
                  </label>
                  <div className="relative">
                    <select
                      id="desktop-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-white text-sm font-bold text-[#102540] pl-3.5 pr-9 py-2 rounded-xl border border-[#F27C36]/60 hover:border-[#F27C36] focus:outline-none focus:border-[#F27C36] cursor-pointer transition"
                    >
                      <option value="featured">Relevancia</option>
                      <option value="speed-desc">Velocidad (PPM)</option>
                      <option value="name-asc">Nombre (A-Z)</option>
                      <option value="price-asc">Precio: Menor a Mayor</option>
                      <option value="price-desc">Precio: Mayor a Menor</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#F27C36] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Controls (Matches iPhone Reference Layout) */}
            <div className="lg:hidden space-y-3 mb-5">
              {/* Mobile Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por modelo (ej. MA3500cix)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-sm text-slate-900 placeholder-slate-400 pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#102540] transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button + Sort Dropdown Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="relative flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-[#102540] hover:bg-[#18355A] text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Filtrar equipos</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#F27C36] text-white text-[11px] font-extrabold flex items-center justify-center tabular-nums shadow-sm">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <select
                    aria-label="Ordenar equipos"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full h-full appearance-none bg-white text-xs sm:text-sm font-bold text-[#102540] pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F27C36] cursor-pointer"
                  >
                    <option value="featured">Ordenar por</option>
                    <option value="speed-desc">Velocidad (PPM)</option>
                    <option value="name-asc">Nombre (A-Z)</option>
                    <option value="price-asc">Menor precio</option>
                    <option value="price-desc">Mayor precio</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#F27C36] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Mobile Count + Quick Reset */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-sm font-extrabold text-[#102540] tabular-nums">
                  {filteredProducts.length}{' '}
                  {filteredProducts.length === 1 ? 'equipo' : 'equipos'}
                </span>
                {hasAnyFilterOrSearch && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-[#F27C36] hover:text-[#d96624] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpiar filtros</span>
                  </button>
                )}
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 px-6 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                <Printer className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-[#102540] mb-1">
                  No se encontraron equipos con los filtros seleccionados
                </p>
                <p className="text-sm text-slate-500 mb-5">
                  Prueba ajustando los filtros o restablece para ver el catálogo completo.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#102540] hover:bg-[#193860] text-white text-sm font-bold transition cursor-pointer"
                >
                  Ver todos los equipos ({products.length})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((product, index) => {
                  const isEquipment = getEquipmentType(product) !== 'otros';
                  const speedLabel = getSpeedDisplay(product);
                  const formatLabel = getPaperFormat(product) || '—';
                  const subtitle = getCardSubtitle(product);
                  const resolvedDatasheetUrl = resolveProductDatasheetUrl(product);
                  const datasheetDownloadHref = resolvedDatasheetUrl
                    ? buildDatasheetDownloadUrl(resolvedDatasheetUrl, product)
                    : undefined;
                  const datasheetFilename = getDatasheetDownloadFilename(product);

                  return (
                    <article
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between p-4 group"
                    >
                      <div>
                        {/* Clean Studio Product Image */}
                        <button
                          type="button"
                          onClick={() => onOpenProductDetail(product)}
                          className="w-full h-44 sm:h-48 rounded-xl bg-white flex items-center justify-center p-3 mb-3 overflow-hidden cursor-pointer focus:outline-none"
                          aria-label={`Ver especificaciones de ${product.name}`}
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              loading={index < 4 ? 'eager' : 'lazy'}
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <Printer className="w-14 h-14 text-slate-300 mb-1.5" />
                              <span className="text-xs font-mono text-slate-400">
                                {product.code}
                              </span>
                            </div>
                          )}
                        </button>

                        {/* Model Title & Clean Subtitle */}
                        <div className="mb-3">
                          <h3
                            onClick={() => onOpenProductDetail(product)}
                            className="text-[15px] sm:text-base font-extrabold text-[#102540] hover:text-[#F27C36] transition cursor-pointer leading-snug line-clamp-1"
                            title={product.name}
                          >
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {subtitle}
                          </p>
                        </div>

                        {/* Spec Mini-Boxes: Speed PPM + Format A3/A4 */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="rounded-lg bg-[#F5F7FA] border border-slate-200/70 px-2.5 py-2 flex items-center gap-2 min-w-0">
                            <Gauge className="w-4 h-4 text-[#102540] shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-extrabold text-[#102540] leading-tight truncate tabular-nums">
                                {speedLabel}
                              </div>
                              <div className="text-[10px] text-slate-500 leading-tight truncate">
                                Vel. de impresión
                              </div>
                            </div>
                          </div>

                          <div className="rounded-lg bg-[#F5F7FA] border border-slate-200/70 px-2.5 py-2 flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-[#102540] shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-extrabold text-[#102540] leading-tight truncate">
                                {formatLabel}
                              </div>
                              <div className="text-[10px] text-slate-500 leading-tight truncate">
                                Formato
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ver especificaciones + Descargar ficha técnica PDF */}
                        <div className="space-y-1 mb-3">
                          <button
                            type="button"
                            onClick={() => onOpenProductDetail(product)}
                            className="w-full py-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#F27C36] hover:text-[#d96624] transition cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>Ver especificaciones</span>
                          </button>

                          {datasheetDownloadHref && (
                            <a
                              href={datasheetDownloadHref}
                              download={datasheetFilename}
                              rel="noopener noreferrer"
                              className="w-full py-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#102540] hover:text-[#1D63D6] transition"
                            >
                              <Download className="w-3.5 h-3.5 shrink-0 text-[#1D63D6]" />
                              <span>Descargar ficha técnica (PDF)</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Dual Action Buttons: Rentar ahora (WhatsApp) + Comprar ahora */}
                      <div className="space-y-2 pt-1">
                        {isEquipment && (
                          <a
                            href={buildRentalWhatsAppUrl(product, whatsappPhone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3 rounded-lg bg-[#169C46] hover:bg-[#13853B] active:bg-[#0F6E30] text-white text-xs sm:text-[13px] font-bold transition flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
                          >
                            <MessageCircle className="w-4 h-4 shrink-0" />
                            <span>Rentar ahora</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => onBuyNow(product)}
                          className="w-full py-2.5 px-3 rounded-lg bg-[#102540] hover:bg-[#193860] active:bg-[#0B1B30] text-white text-xs sm:text-[13px] font-bold transition flex items-center justify-center gap-2 shadow-xs whitespace-nowrap cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4 shrink-0" />
                          <span>Comprar ahora</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Modal */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Filtrar equipos"
        >
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#102540] text-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#F27C36]" />
                <h2 className="text-base font-extrabold">Filtrar equipos</h2>
                {activeFiltersCount > 0 && (
                  <span className="text-xs font-bold text-[#F27C36] tabular-nums">
                    ({activeFiltersCount})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Cerrar filtros"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">{renderFilterGroups()}</div>

            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-[#102540] hover:bg-[#193860] text-white text-sm font-bold transition cursor-pointer tabular-nums"
              >
                Ver {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'equipo' : 'equipos'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
