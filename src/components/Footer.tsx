import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp
} from 'lucide-react';
import { AppSection, FooterConfig } from '../types';
import { DEFAULT_FOOTER_CONFIG } from '../data/initialContent';

interface FooterProps {
  onSelectSection: (section: AppSection) => void;
  showSoftware?: boolean;
  footerContent?: FooterConfig;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectSection, 
  showSoftware = false,
  footerContent
}) => {
  const content = footerContent || DEFAULT_FOOTER_CONFIG;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (section: AppSection | string) => {
    const validSections: AppSection[] = [
      'inicio', 
      'nosotros', 
      'renta_venta', 
      'hardware', 
      'software', 
      'tienda', 
      'contacto', 
      'admin'
    ];
    if (validSections.includes(section as AppSection)) {
      onSelectSection(section as AppSection);
    } else {
      onSelectSection('tienda');
    }
    scrollToTop();
  };

  const cleanPhone = (content.bannerPhone || '(444) 812-3000').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#182F4F] text-white border-t border-[#394B61] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Upper Footer: Quick Support Banner in #000000 */}
      <div className="border-b border-[#394B61] py-8 px-4 sm:px-6 lg:px-8 bg-[#000000]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="p-3 rounded-2xl bg-[#182F4F] border border-[#394B61] text-[#F27C36]">
              <ShieldCheck className="w-6 h-6 text-[#F27C36]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {content.bannerTitle}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {content.bannerSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={`tel:${cleanPhone}`}
              className="px-4 py-2.5 rounded-xl bg-[#182F4F] hover:bg-[#394B61] text-white text-xs font-bold transition flex items-center space-x-1.5 border border-[#394B61]"
            >
              <Phone className="w-3.5 h-3.5 text-[#F27C36]" />
              <span>{content.bannerPhone}</span>
            </a>
            <a
              href={content.bannerWhatsAppUrl || `https://wa.me/52${cleanPhone}?text=Hola,%20solicito%20atencion%20LUMESA%20Kyocera`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
            >
              <span>{content.bannerWhatsAppText}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Branding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/lumesalogo.png"
                alt="LUMESA"
                className="h-10 sm:h-12 w-auto object-contain select-none"
                onError={(e) => {
                  e.currentTarget.src = "https://appdesignproyectos.com/lumesalogo.png";
                }}
              />
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-light max-w-sm">
              {content.description}
            </p>

            <div className="pt-2 text-xs text-slate-300 space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#F27C36] shrink-0 mt-0.5" />
                <span>{content.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#F27C36] shrink-0" />
                <span>{content.schedule}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#F27C36] shrink-0" />
                <a href={`mailto:${content.email}`} className="hover:text-white transition">
                  {content.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Secciones */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#F27C36] pl-2">
              {content.sectionsTitle || 'Secciones'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><button onClick={() => handleNav('inicio')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Inicio</button></li>
              <li><button onClick={() => handleNav('nosotros')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Nosotros</button></li>
              <li><button onClick={() => handleNav('renta_venta')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Renta / Venta</button></li>
              {showSoftware && (
                <li><button onClick={() => handleNav('software')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Software</button></li>
              )}
              <li><button onClick={() => handleNav('tienda')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Tienda en Línea</button></li>
              <li><button onClick={() => handleNav('contacto')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Contacto</button></li>
            </ul>
          </div>

          {/* Col 4: Hardware & Soluciones */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#F27C36] pl-2">
              {content.equiposTitle || (showSoftware ? 'Equipos & Software' : 'Equipos & Servicios')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {content.equiposLinks && content.equiposLinks.length > 0 ? (
                content.equiposLinks.map((link) => (
                  <li key={link.id || link.label}>
                    <button 
                      onClick={() => handleNav(link.target as AppSection)} 
                      className="hover:text-[#F27C36] transition text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))
              ) : (
                <>
                  <li><button onClick={() => handleNav('hardware')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Multifuncionales A3 Color</button></li>
                  <li><button onClick={() => handleNav('hardware')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Multifuncionales A4 Compactos</button></li>
                  <li><button onClick={() => handleNav('tienda')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Tóner y Consumibles</button></li>
                  <li><button onClick={() => handleNav('renta_venta')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Planes de Renta Todo Incluido</button></li>
                  <li><button onClick={() => handleNav('contacto')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Pólizas Preventivas Kyocera</button></li>
                  <li><button onClick={() => handleNav('contacto')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Asesoría en Equipamiento</button></li>
                </>
              )}
            </ul>
          </div>

          {/* Col 5: Empresa & Soporte */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#F27C36] pl-2">
              {content.empresaTitle || 'Empresa y Atención'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {content.empresaLinks && content.empresaLinks.length > 0 ? (
                content.empresaLinks.map((link) => {
                  const isAdminLink = link.target === 'admin' || link.label.toLowerCase().includes('admin');
                  return (
                    <li key={link.id || link.label}>
                      <button 
                        onClick={() => handleNav(link.target as AppSection)} 
                        className={`transition text-left cursor-pointer ${
                          isAdminLink 
                            ? 'text-[#F27C36] hover:text-white font-semibold flex items-center space-x-1' 
                            : 'hover:text-[#F27C36]'
                        }`}
                      >
                        <span>{link.label}</span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <>
                  <li><button onClick={() => handleNav('nosotros')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Sobre Nosotros</button></li>
                  <li><button onClick={() => handleNav('nosotros')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Cobertura en México</button></li>
                  <li><button onClick={() => handleNav('contacto')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Contacto Directo</button></li>
                  <li><button onClick={() => handleNav('tienda')} className="hover:text-[#F27C36] transition text-left cursor-pointer">Facturación CFDI 4.0 SAT</button></li>
                  <li><button onClick={() => handleNav('admin')} className="text-[#F27C36] hover:text-white font-semibold transition text-left flex items-center space-x-1 cursor-pointer"><span>Acceso Admin Autoadministrable →</span></button></li>
                </>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-[#394B61] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            {content.copyrightText}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#394B61] hover:bg-[#000000] text-slate-200 hover:text-white border border-[#394B61] transition cursor-pointer"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#F27C36]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
