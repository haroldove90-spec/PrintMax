import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  ChevronDown,
  ShieldCheck,
  Home,
  Building2,
  Printer,
  Cpu,
  Store,
  PhoneCall,
  Globe,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { AppSection, CartItem, AdminUser, AdminRole } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenQuickQuote: () => void;
  onOpenAdmin: () => void;
  onSelectRoleAndOpenAdmin?: (role: AdminRole) => void;
  currentUser?: AdminUser | null;
  showSoftware?: boolean;
  onSearchCatalog?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  cartItems,
  onOpenCart,
  onOpenAdmin,
  onSelectRoleAndOpenAdmin,
  showSoftware = false,
  onSearchCatalog
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const solutionsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = headerSearch.trim();
    if (onSearchCatalog) {
      onSearchCatalog(trimmed);
    } else {
      onSelectSection('tienda');
    }
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const isSolutionsActive = activeSection === 'software';

  const isEquiposActive =
    activeSection === 'tienda' ||
    activeSection === 'renta_venta' ||
    (activeSection as string) === 'hardware';

  const mobileNavLinks: { id: AppSection; name: string; icon: React.ElementType }[] = [
    { id: 'inicio', name: 'Inicio', icon: Home },
    { id: 'tienda', name: 'Equipos (Tienda en Línea)', icon: Store },
    { id: 'renta_venta', name: 'Soluciones de Renta / Venta', icon: Printer },
    ...(showSoftware ? [{ id: 'software' as AppSection, name: 'Software Kyocera', icon: Cpu }] : []),
    { id: 'nosotros', name: 'Nosotros', icon: Building2 },
    { id: 'contacto', name: 'Contacto', icon: PhoneCall }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#102540] text-white border-b border-[#1E3A5F] shadow-md font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 lg:h-[68px] gap-4">
          {/* Left: Mobile Hamburger + Desktop Brand Logo */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setSearchOpen(false);
              }}
              className="lg:hidden p-2 -ml-2 rounded-lg text-white hover:bg-white/10 transition cursor-pointer"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#F27C36]" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectSection('inicio');
                setMobileMenuOpen(false);
              }}
              className="hidden lg:flex items-center focus:outline-none p-0 bg-transparent border-0 cursor-pointer shrink-0"
              title="LUMESA"
            >
              <img
                src="/lumesalogo.png"
                alt="LUMESA"
                className="h-9 xl:h-10 w-auto max-w-[165px] object-contain transition duration-200 hover:opacity-90 select-none"
                onError={(e) => {
                  e.currentTarget.src = 'https://appdesignproyectos.com/lumesalogo.png';
                }}
              />
            </button>
          </div>

          {/* Mobile Centered Logo */}
          <button
            type="button"
            onClick={() => {
              onSelectSection('inicio');
              setMobileMenuOpen(false);
            }}
            className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center focus:outline-none p-0 bg-transparent border-0 cursor-pointer"
            title="LUMESA"
          >
            <img
              src="/lumesalogo.png"
              alt="LUMESA"
              className="h-7 sm:h-8 w-auto max-w-[130px] object-contain select-none"
              onError={(e) => {
                e.currentTarget.src = 'https://appdesignproyectos.com/lumesalogo.png';
              }}
            />
          </button>

          {/* Center: Clean Desktop Navigation Links */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-7 xl:gap-9"
          >
            <button
              type="button"
              onClick={() => onSelectSection('inicio')}
              className={`relative py-2 text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeSection === 'inicio'
                  ? 'text-white font-bold'
                  : 'text-slate-200 hover:text-white font-medium'
              }`}
            >
              <span>Inicio</span>
              {activeSection === 'inicio' && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[3px] rounded-full bg-[#F27C36]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectSection('tienda')}
              className={`relative py-2 text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isEquiposActive
                  ? 'text-white font-bold'
                  : 'text-slate-200 hover:text-white font-medium'
              }`}
            >
              <span>Equipos</span>
              {isEquiposActive && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[3px] rounded-full bg-[#F27C36]" />
              )}
            </button>

            {/* Soluciones Dropdown */}
            <div ref={solutionsRef} className="relative">
              <button
                type="button"
                onClick={() => setSolutionsOpen((prev) => !prev)}
                className={`relative py-2 text-sm whitespace-nowrap shrink-0 inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  isSolutionsActive
                    ? 'text-white font-bold'
                    : 'text-slate-200 hover:text-white font-medium'
                }`}
                aria-expanded={solutionsOpen}
              >
                <span>Soluciones</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    solutionsOpen ? 'rotate-180 text-[#F27C36]' : 'text-slate-300'
                  }`}
                />
                {isSolutionsActive && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-[3px] rounded-full bg-[#F27C36]" />
                )}
              </button>

              {solutionsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-2 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSection('renta_venta');
                      setSolutionsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-start gap-3 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#F27C36] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-[#102540]">Renta y Venta de Equipos</div>
                      <div className="text-xs text-slate-500">Catálogo y comparador técnico</div>
                    </div>
                  </button>

                  {showSoftware && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSection('software');
                        setSolutionsOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-start gap-3 transition cursor-pointer"
                    >
                      <Cpu className="w-4 h-4 text-[#F27C36] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-[#102540]">Software Kyocera</div>
                        <div className="text-xs text-slate-500">Gestión documental y control</div>
                      </div>
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={() => {
                      onSelectSection('contacto');
                      setSolutionsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-start gap-3 transition cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#F27C36] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-[#102540]">Asesoría y Cotización</div>
                      <div className="text-xs text-slate-500">Planes mensuales a tu medida</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onSelectSection('nosotros')}
              className={`relative py-2 text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeSection === 'nosotros'
                  ? 'text-white font-bold'
                  : 'text-slate-200 hover:text-white font-medium'
              }`}
            >
              <span>Nosotros</span>
              {activeSection === 'nosotros' && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[3px] rounded-full bg-[#F27C36]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectSection('contacto')}
              className={`relative py-2 text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeSection === 'contacto'
                  ? 'text-white font-bold'
                  : 'text-slate-200 hover:text-white font-medium'
              }`}
            >
              <span>Contacto</span>
              {activeSection === 'contacto' && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[3px] rounded-full bg-[#F27C36]" />
              )}
            </button>
          </nav>

          {/* Right: Minimal Icon Actions (Search, Cart, subtle Admin) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg transition cursor-pointer ${
                searchOpen
                  ? 'bg-white/15 text-[#F27C36]'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Buscar equipos"
              title="Buscar equipos"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 rounded-lg text-white hover:bg-white/10 transition cursor-pointer"
              aria-label={`Carrito de compras con ${totalCartCount} productos`}
              title="Carrito de Compras"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F27C36] text-white text-[10px] font-bold flex items-center justify-center leading-none tabular-nums shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Discreet Admin access on desktop */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className={`hidden lg:flex p-2 rounded-lg transition cursor-pointer ${
                activeSection === 'admin'
                  ? 'bg-[#F27C36] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Panel de Administración LUMESA"
              aria-label="Panel Admin"
            >
              <ShieldCheck className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Quick Search Bar */}
      {searchOpen && (
        <div className="bg-[#0B1B30] border-t border-[#1E3A5F] px-4 sm:px-6 lg:px-8 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Buscar equipo por modelo (ej. MA3500cix, MZ2501ci)..."
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-sm pl-10 pr-9 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#F27C36]"
              />
              {headerSearch && (
                <button
                  type="button"
                  onClick={() => setHeaderSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#F27C36] hover:bg-[#d96624] text-white text-sm font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              Buscar
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#102540] border-t border-[#1E3A5F] px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <div className="space-y-1">
            {mobileNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                activeSection === link.id ||
                (link.id === 'renta_venta' && (activeSection as string) === 'hardware');
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition cursor-pointer ${
                    isActive
                      ? 'bg-[#1B375B] text-white'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F27C36]' : 'text-slate-400'}`} />
                  <span className={isActive ? 'text-[#F27C36] font-bold' : ''}>{link.name}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <PWAInstallButton variant="header" />
          </div>

          {/* Admin Access in Mobile Drawer */}
          <div className="pt-3 border-t border-[#1E3A5F] space-y-2">
            <div className="text-xs font-semibold text-slate-400 px-1">
              Administración
            </div>

            <button
              type="button"
              onClick={() => {
                if (onSelectRoleAndOpenAdmin) {
                  onSelectRoleAndOpenAdmin('admin_web');
                } else {
                  onOpenAdmin();
                }
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#173254] hover:bg-[#1E3E66] text-white rounded-xl text-xs font-bold text-left flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F27C36]" />
                <span>Admin Página Web (CMS)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectRoleAndOpenAdmin) {
                  onSelectRoleAndOpenAdmin('admin_tienda');
                } else {
                  onOpenAdmin();
                }
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#173254] hover:bg-[#1E3E66] text-white rounded-xl text-xs font-bold text-left flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Admin Tienda en Línea</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectRoleAndOpenAdmin) {
                  onSelectRoleAndOpenAdmin('super_admin');
                } else {
                  onOpenAdmin();
                }
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-[#0B1B30] hover:bg-[#173254] text-white rounded-xl text-xs font-bold text-left flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#F27C36]" />
                <span>Super Administrador</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
