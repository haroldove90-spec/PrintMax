import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  FileSpreadsheet, 
  Search, 
  ArrowRight,
  Store,
  Printer,
  Calculator,
  Cpu,
  Clock,
  Building2,
  PhoneCall,
  Home
} from 'lucide-react';
import { AppSection, CartItem, Product } from '../types';

interface HeaderProps {
  activeSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  comparedProducts: Product[];
  onOpenComparator: () => void;
  onOpenQuickQuote: () => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  cartItems,
  onOpenCart,
  comparedProducts,
  onOpenComparator,
  onOpenQuickQuote,
  onSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onSelectSection('tienda');
      setSearchOpen(false);
    }
  };

  const navLinks: { id: AppSection; name: string; icon: React.ElementType }[] = [
    { id: 'inicio', name: 'Inicio', icon: Home },
    { id: 'tienda', name: 'Tienda en Línea', icon: Store },
    { id: 'hardware', name: 'Hardware & Equipos', icon: Printer },
    { id: 'renta', name: 'Renta de Equipos', icon: Calculator },
    { id: 'software', name: 'Software Kyocera', icon: Cpu },
    { id: 'soporte', name: 'Soporte < 24h', icon: Clock },
    { id: 'nosotros', name: 'Nosotros', icon: Building2 },
    { id: 'contacto', name: 'Contacto', icon: PhoneCall }
  ];

  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-neutral-800 shadow-2xl font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Container (Always visible, shrink-0, perfectly sized) */}
          <div className="shrink-0 flex items-center">
            <button
              onClick={() => onSelectSection('inicio')}
              className="flex items-center group focus:outline-none"
              title="Ir a Inicio - Printmax"
            >
              <img
                src="/printmaxlogo.png"
                alt="Printmax"
                className="h-10 sm:h-12 w-auto object-contain transition duration-200 group-hover:opacity-90"
                onError={(e) => {
                  // Fallback to external URL if local file is missing
                  e.currentTarget.src = "https://appdesignproyectos.com/printmaxlogo.png";
                }}
              />
            </button>
          </div>

          {/* Desktop Navigation Tabs (Switch between SEPARATE sections) */}
          <nav className="hidden xl:flex items-center space-x-1 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectSection(link.id)}
                  className={`px-3 py-2 text-xs 2xl:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-neutral-900 text-white border border-neutral-700 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <span className={isActive ? 'text-blue-400 font-bold' : ''}>
                    {link.name}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Search, Comparator, Cart & Quick Quote */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Search Input for Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-48 xl:w-56">
              <input
                type="text"
                placeholder="Buscar modelo o tóner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 text-xs text-white placeholder-neutral-500 pl-8 pr-3 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500 transition"
              />
              <Search className="w-3.5 h-3.5 text-blue-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </form>

            {/* Mobile / Tablet Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800"
              title="Buscar"
            >
              <Search className="w-4 h-4 text-blue-500" />
            </button>

            {/* Comparator Button */}
            {comparedProducts.length > 0 && (
              <button
                onClick={onOpenComparator}
                className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-900 hover:bg-black text-white border border-neutral-800 hover:border-blue-500/80 transition flex items-center space-x-1.5"
                title="Comparador de hasta 5 equipos"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                <span className="hidden md:inline text-xs font-semibold">Comparar</span>
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {comparedProducts.length}
                </span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-black hover:bg-neutral-900 text-white border border-neutral-800 hover:border-neutral-700 transition flex items-center space-x-1.5 shadow-sm"
              aria-label="Carrito de compras"
              title="Abrir carrito"
            >
              <ShoppingCart className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline text-xs font-semibold">Carrito</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-blue-600/40 animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Cotizar Renta Button: Black with blue icon */}
            <button
              onClick={onOpenQuickQuote}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-neutral-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase border border-neutral-700 hover:border-blue-500 transition shadow-sm"
            >
              <span>Cotizar Renta</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 transition"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search for Tablet / Mobile */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="lg:hidden pb-3 relative">
            <input
              type="text"
              placeholder="Buscar modelo o consumible..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 text-sm text-white placeholder-neutral-500 pl-9 pr-4 py-2 rounded-xl border border-neutral-800 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <Search className="w-4 h-4 text-blue-500 absolute left-3 top-3 pointer-events-none" />
          </form>
        )}
      </div>

      {/* Mobile Drawer Menu (Navigates directly between independent sections) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-black border-t border-neutral-800 px-4 pt-3 pb-6 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1">
            Secciones Independientes
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onSelectSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-3 transition ${
                    isActive
                      ? 'bg-neutral-900 text-white border border-neutral-700'
                      : 'text-neutral-300 hover:bg-neutral-900/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-neutral-400'}`} />
                  <span className={isActive ? 'text-blue-400 font-bold' : ''}>
                    {link.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                onSelectSection('renta');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-700 text-center flex items-center justify-center space-x-1.5"
            >
              <span>Cotizar Renta de Equipos</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
