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
    { id: 'nosotros', name: 'Nosotros', icon: Building2 },
    { id: 'renta_venta', name: 'Renta / Venta', icon: Printer },
    { id: 'software', name: 'Software', icon: Cpu },
    { id: 'tienda', name: 'Tienda en Línea', icon: Store },
    { id: 'contacto', name: 'Contacto', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#182F4F] text-white border-b border-[#394B61] shadow-xl font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top micro bar in #000000 for corporate contact & PWA notice */}
      <div className="bg-[#000000] text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#182F4F]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-1.5 font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-[#F27C36] animate-pulse" />
              <span>LUMESA • Distribuidor Oficial Kyocera Japón</span>
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-400">Soluciones Documentales Kyocera en México</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="tel:4448123000" className="hover:text-white transition flex items-center space-x-1">
              <span>Tel: (444) 812-3000</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-[#F27C36] font-semibold">01 800 KYOCERA</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo (Clean, completely un-encapsulated - Navigates to Online Store / Home) */}
          <div className="shrink-0 flex items-center">
            <button
              onClick={() => onSelectSection('tienda')}
              className="flex items-center group focus:outline-none p-0 bg-transparent border-0"
              title="LUMESA - Tienda Oficial"
            >
              <img
                src="/lumesalogo.png"
                alt="LUMESA"
                className="h-10 sm:h-12 w-auto object-contain transition duration-200 group-hover:opacity-90 drop-shadow-sm select-none"
                onError={(e) => {
                  e.currentTarget.src = "https://appdesignproyectos.com/lumesalogo.png";
                }}
              />
            </button>
          </div>

          {/* Desktop Navigation Menu in requested order: Inicio, Nosotros, Renta / Venta, Software, Tienda en línea, Contacto */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id || (link.id === 'renta_venta' && (activeSection as string) === 'hardware');
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectSection(link.id)}
                  className={`px-3 py-2 text-xs xl:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#394B61] text-white border border-[#F27C36]/60 shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-[#394B61]/50'
                  }`}
                >
                  <span className={isActive ? 'text-[#F27C36] font-bold' : ''}>
                    {link.name}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons in requested order: Icono Panel Admin, Icono Instalar App, Icono Carrito, Boton COTIZAR */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* 7. Icono ( Panel admin ) - Only icon, no text */}
            <button
              onClick={onOpenAdmin}
              className={`p-2.5 rounded-xl border transition flex items-center justify-center shadow-sm shrink-0 ${
                activeSection === 'admin'
                  ? 'bg-[#F27C36] text-white border-[#F27C36] shadow-[#F27C36]/20 ring-1 ring-[#F27C36]'
                  : 'bg-[#394B61] hover:bg-[#000000] text-white border-[#394B61] hover:border-[#F27C36]'
              }`}
              title="Panel de Administración LUMESA"
              aria-label="Panel Admin"
            >
              <ShieldCheck className="w-5 h-5 text-[#F27C36]" />
            </button>

            {/* 8. Icono ( instalar app ) - Only icon, no text */}
            <PWAInstallButton variant="header" />

            {/* 9. Icono ( Carrito de compras ) - Only icon + counter */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-[#394B61] hover:bg-[#000000] text-white border border-[#394B61] hover:border-[#F27C36] transition flex items-center justify-center shadow-sm shrink-0"
              aria-label={`Carrito de compras con ${totalCartCount} productos`}
              title="Ver Carrito de Compras"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#F27C36] text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-[#F27C36]/50 animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* 10. Boton: COTIZAR */}
            <button
              onClick={onOpenQuickQuote}
              className="inline-flex items-center space-x-1.5 bg-[#F27C36] hover:bg-[#d96624] active:bg-[#c2591b] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold tracking-wider uppercase transition shadow-md shrink-0"
              title="Solicitar Cotización Inmediata"
            >
              <span>COTIZAR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-200 hover:text-white bg-[#394B61] border border-[#394B61] transition ml-1"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#182F4F] border-t border-[#394B61] px-4 pt-3 pb-6 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 px-3 py-1">
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
                      ? 'bg-[#394B61] text-white border border-[#F27C36]'
                      : 'text-slate-200 hover:bg-[#394B61]/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F27C36]' : 'text-slate-400'}`} />
                  <span className={isActive ? 'text-[#F27C36] font-bold' : ''}>
                    {link.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dedicated Admin Roles in Mobile Menu */}
          <div className="pt-3 border-t border-[#394B61] space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#F27C36] px-1">
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
              className="w-full py-2.5 px-3 bg-[#394B61]/70 hover:bg-[#394B61] text-white rounded-xl text-xs font-bold border border-[#F27C36]/40 text-left flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#F27C36]" />
                <span>Admin Página Web (CMS)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F27C36]/20 text-[#F27C36] font-mono">
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
              className="w-full py-2.5 px-3 bg-[#394B61]/70 hover:bg-[#394B61] text-white rounded-xl text-xs font-bold border border-emerald-500/40 text-left flex items-center justify-between transition"
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
              className="w-full py-2.5 px-3 bg-[#000000] hover:bg-[#394B61] text-white rounded-xl text-xs font-bold border border-[#394B61] text-left flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-[#F27C36]" />
                <span>Super Administrador (Total)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F27C36]/20 text-[#F27C36] font-mono">
                Full Access
              </span>
            </button>

            <button
              onClick={() => {
                onSelectSection('contacto');
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-3 bg-[#F27C36] hover:bg-[#d96624] text-white rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider text-center flex items-center justify-center space-x-1.5 transition shadow"
            >
              <span>COTIZAR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

