import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  ArrowRight,
  Store,
  Printer,
  Calculator,
  Cpu,
  Clock,
  Building2,
  PhoneCall,
  Home,
  ShieldCheck,
  Globe,
  KeyRound
} from 'lucide-react';
import { AppSection, CartItem, AdminUser, AdminRole } from '../types';

interface HeaderProps {
  activeSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenQuickQuote: () => void;
  onOpenAdmin: () => void;
  onSelectRoleAndOpenAdmin?: (role: AdminRole) => void;
  currentUser?: AdminUser | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  cartItems,
  onOpenCart,
  onOpenQuickQuote,
  onOpenAdmin,
  onSelectRoleAndOpenAdmin,
  currentUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks: { id: AppSection; name: string; icon: React.ElementType }[] = [
    { id: 'inicio', name: 'Inicio', icon: Home },
    { id: 'tienda', name: 'Tienda en Línea', icon: Store },
    { id: 'hardware', name: 'Hardware & Equipos', icon: Printer },
    { id: 'renta', name: 'Renta', icon: Calculator },
    { id: 'software', name: 'Software', icon: Cpu },
    { id: 'soporte', name: 'Soporte < 24h', icon: Clock },
    { id: 'nosotros', name: 'Nosotros', icon: Building2 },
    { id: 'contacto', name: 'Contacto', icon: PhoneCall },
    { id: 'admin', name: 'Panel Admin', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-neutral-800 shadow-2xl font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo (Always visible, clean, shrink-0) */}
          <div className="shrink-0 flex items-center">
            <button
              onClick={() => onSelectSection('inicio')}
              className="flex items-center group focus:outline-none"
              title="Ir a Inicio - Printmax"
            >
              <img
                src="/printmaxlogo.png"
                alt="Printmax"
                className="h-9 sm:h-11 w-auto object-contain transition duration-200 group-hover:opacity-90"
                onError={(e) => {
                  e.currentTarget.src = "https://appdesignproyectos.com/printmaxlogo.png";
                }}
              />
            </button>
          </div>

          {/* Complete Desktop Navigation Menu (NO SCROLLBAR, FULLY VISIBLE) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectSection(link.id)}
                  className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
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

          {/* Action Buttons: Only Cart (Icon + Badge) & Cotizar Renta */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Cart Button: ONLY ICON AND NUMBER INDICATOR */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white border border-neutral-800 hover:border-neutral-700 transition flex items-center justify-center shadow-sm"
              aria-label={`Carrito de compras con ${totalCartCount} productos`}
              title="Ver Carrito de Compras"
            >
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-blue-600/50 animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Cotizar Renta Button: Sleek Black with Blue Accent */}
            <button
              onClick={onOpenQuickQuote}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-neutral-900 hover:bg-black text-white px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase border border-neutral-700 hover:border-blue-500 transition shadow-sm"
            >
              <span>Cotizar Renta</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
            </button>

            {/* Admin Portal Button: Prominent & clear */}
            <button
              onClick={onOpenAdmin}
              className={`px-3 py-2 rounded-xl border transition flex items-center space-x-2 shadow-sm ${
                activeSection === 'admin'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20 ring-1 ring-blue-500'
                  : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-200 hover:text-white border-neutral-700 hover:border-blue-500'
              }`}
              title="Panel Autoadministrable: Admin Web (CMS) y Admin Tienda en Línea"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-white tracking-wide">
                  {activeSection === 'admin' ? 'Salir Admin' : 'Panel Admin'}
                </span>
                <span className="text-[9px] text-blue-400 font-semibold hidden md:inline">
                  Web & Tienda
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 transition"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-neutral-800 px-4 pt-3 pb-6 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1">
            Secciones Públicas
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
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center space-x-3 transition ${
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

          {/* Dedicated Admin Roles in Mobile Menu */}
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 px-1">
              Acceso a Roles de Administración
            </div>

            {/* Direct Link: Admin Página Web (CMS) */}
            <button
              onClick={() => {
                if (onSelectRoleAndOpenAdmin) {
                  onSelectRoleAndOpenAdmin('admin_web');
                } else {
                  onOpenAdmin();
                }
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 rounded-xl text-xs font-bold border border-purple-500/40 text-left flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Admin Página Web (CMS)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                Slider & Textos
              </span>
            </button>

            {/* Direct Link: Admin Tienda en Línea */}
            <button
              onClick={() => {
                if (onSelectRoleAndOpenAdmin) {
                  onSelectRoleAndOpenAdmin('admin_tienda');
                } else {
                  onOpenAdmin();
                }
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 rounded-xl text-xs font-bold border border-emerald-500/40 text-left flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Admin Tienda en Línea</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Productos & Pedidos
              </span>
            </button>

            {/* Direct Link: Super Administrador */}
            <button
              onClick={() => {
                if (onSelectRoleAndOpenAdmin) {
                  onSelectRoleAndOpenAdmin('super_admin');
                } else {
                  onOpenAdmin();
                }
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl text-xs font-bold border border-neutral-700 text-left flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-blue-400" />
                <span>Super Administrador (Total)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                Full Access
              </span>
            </button>

            <button
              onClick={() => {
                onSelectSection('renta');
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-neutral-800 text-center flex items-center justify-center space-x-1.5"
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
