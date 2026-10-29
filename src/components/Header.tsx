import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Phone, 
  Clock, 
  MapPin, 
  Menu, 
  X, 
  FileSpreadsheet, 
  Search, 
  ShieldCheck, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { CartItem, Product } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  comparedProducts: Product[];
  onOpenComparator: () => void;
  onOpenQuickQuote: () => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  comparedProducts,
  onOpenComparator,
  onOpenQuickQuote,
  onSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [imgError, setImgError] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      const element = document.getElementById('tienda');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Hardware & Equipos', href: '#hardware' },
    { name: 'Tienda en Línea', href: '#tienda' },
    { name: 'Software Kyocera', href: '#software' },
    { name: 'Renta de Equipos', href: '#renta' },
    { name: 'Soporte < 24h', href: '#soporte' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Contacto', href: '#contacto' }
  ];

  return (
    <header className="sticky top-0 z-50 shadow-xl font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Corporate Strip */}
      <div className="bg-[#080b11] border-b border-white/10 text-xs text-slate-300 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-blue-400 font-semibold tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></span>
              Distribuidor Autorizado Kyocera Japón en México
            </span>
            <span className="flex items-center text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-blue-400 mr-1" />
              Centro de Distribución: San Luis Potosí, S.L.P. (Cobertura Nacional)
            </span>
            <span className="flex items-center text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400 mr-1" />
              Soporte Taller: 09:00 a 18:00 hrs
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Respuesta Técnica &lt; 24h</span>
            <span className="text-white/20">|</span>
            <a 
              href="tel:4448001234" 
              className="flex items-center text-white hover:text-blue-400 transition font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-blue-500 mr-1" />
              (444) 812-3000 / 01 800 KYOCERA
            </a>
          </div>
        </div>
      </div>

      {/* Main Header (Pure Deep Black as requested) */}
      <div className="bg-[#0b0f17] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo area */}
            <div className="flex items-center space-x-4">
              <a href="#inicio" className="flex items-center group">
                {!imgError ? (
                  <img
                    src="https://appdesignproyectos.com/printmaxlogo.png"
                    alt="PrintMax - Kyocera Document Solutions"
                    className="h-10 md:h-12 w-auto object-contain transition group-hover:opacity-95"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                      P
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold tracking-tight text-white">
                        PRINT<span className="text-blue-500">MAX</span>
                      </span>
                      <span className="block text-[10px] tracking-widest text-slate-400 uppercase -mt-1 font-semibold">
                        Kyocera Document Solutions
                      </span>
                    </div>
                  </div>
                )}
              </a>

              {/* Kyocera Badge */}
              <div className="hidden lg:flex items-center pl-4 border-l border-white/15">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
                  Kyocera Partner
                </span>
              </div>
            </div>

            {/* Search Bar for Desktop */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative w-72">
              <input
                type="text"
                placeholder="Buscar modelo o tóner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 text-sm text-white placeholder-slate-400 pl-9 pr-4 py-2 rounded-full border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </form>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-md transition duration-150"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Action Buttons: Comparator, Cart, Quote */}
            <div className="flex items-center space-x-3">
              {/* Compare Button */}
              {comparedProducts.length > 0 && (
                <button
                  onClick={onOpenComparator}
                  className="relative p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center space-x-1.5"
                  title="Comparador de equipos Kyocera"
                >
                  <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                  <span className="hidden sm:inline text-xs font-semibold">Comparar</span>
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {comparedProducts.length}
                  </span>
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-lg bg-slate-800/90 hover:bg-blue-600/30 text-white border border-slate-700/80 hover:border-blue-500 transition flex items-center space-x-2"
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                <span className="hidden sm:inline text-xs font-semibold">Carrito</span>
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-blue-600/50 animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Quick Quote Button */}
              <button
                onClick={onOpenQuickQuote}
                className="hidden sm:inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>Cotizar Renta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 pt-3 pb-6 space-y-3">
            {/* Search inside mobile menu */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Buscar modelo o tóner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-sm text-white placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-lg border border-slate-700"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>

            <div className="space-y-1 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuickQuote();
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider text-center"
              >
                Cotizar Renta o Venta
              </button>
              <a
                href="https://wa.me/524448123000?text=Hola,%20solicito%20asesoria%20sobre%20equipos%20Kyocera"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold text-center flex items-center justify-center space-x-2"
              >
                <span>WhatsApp Oficial</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
