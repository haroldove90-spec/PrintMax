import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp
} from 'lucide-react';
import { AppSection } from '../types';

interface FooterProps {
  onSelectSection: (section: AppSection) => void;
  showSoftware?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection, showSoftware = false }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (section: AppSection) => {
    onSelectSection(section);
    scrollToTop();
  };

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
                ¿Necesita asesoría o equipamiento Kyocera para su empresa?
              </h4>
              <p className="text-xs text-slate-300">
                LUMESA ofrece soluciones documentales de vanguardia, consumibles originales y atención personalizada en México.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="tel:4448123000"
              className="px-4 py-2.5 rounded-xl bg-[#182F4F] hover:bg-[#394B61] text-white text-xs font-bold transition flex items-center space-x-1.5 border border-[#394B61]"
            >
              <Phone className="w-3.5 h-3.5 text-[#F27C36]" />
              <span>(444) 812-3000</span>
            </a>
            <a
              href="https://wa.me/524448123000?text=Hola,%20solicito%20atencion%20LUMESA%20Kyocera"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
            >
              <span>WhatsApp de Atención</span>
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
              Con más de tres décadas respaldando a empresas en México, LUMESA es distribuidor autorizado y centro oficial de soluciones Kyocera Japón, con base en San Luis Potosí y cobertura de servicio a nivel nacional.
            </p>

            <div className="pt-2 text-xs text-slate-300 space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#F27C36] shrink-0 mt-0.5" />
                <span>San Luis Potosí, S.L.P., México. C.P. 78230</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#F27C36] shrink-0" />
                <span>Lunes a Viernes: 09:00 a 18:00 hrs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#F27C36] shrink-0" />
                <span>contacto@lumesa.com.mx</span>
              </div>
            </div>
          </div>

          {/* Col 3: Secciones */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#F27C36] pl-2">
              Secciones
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><button onClick={() => handleNav('inicio')} className="hover:text-[#F27C36] transition text-left">Inicio</button></li>
              <li><button onClick={() => handleNav('nosotros')} className="hover:text-[#F27C36] transition text-left">Nosotros</button></li>
              <li><button onClick={() => handleNav('renta_venta')} className="hover:text-[#F27C36] transition text-left">Renta / Venta</button></li>
              {showSoftware && (
                <li><button onClick={() => handleNav('software')} className="hover:text-[#F27C36] transition text-left">Software</button></li>
              )}
              <li><button onClick={() => handleNav('tienda')} className="hover:text-[#F27C36] transition text-left">Tienda en Línea</button></li>
              <li><button onClick={() => handleNav('contacto')} className="hover:text-[#F27C36] transition text-left">Contacto</button></li>
            </ul>
          </div>

          {/* Col 4: Hardware & Soluciones */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#F27C36] pl-2">
              {showSoftware ? 'Equipos & Software' : 'Equipos & Servicios'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><button onClick={() => handleNav('hardware')} className="hover:text-[#F27C36] transition text-left">Multifuncionales A3 Color</button></li>
              <li><button onClick={() => handleNav('hardware')} className="hover:text-[#F27C36] transition text-left">Multifuncionales A4 Compactos</button></li>
              <li><button onClick={() => handleNav('tienda')} className="hover:text-[#F27C36] transition text-left">Tóner y Consumibles</button></li>
              {showSoftware ? (
                <>
                  <li><button onClick={() => handleNav('software')} className="hover:text-[#F27C36] transition text-left">KYOCERA Net Manager</button></li>
                  <li><button onClick={() => handleNav('software')} className="hover:text-[#F27C36] transition text-left">Control de Costos MyQ</button></li>
                </>
              ) : (
                <>
                  <li><button onClick={() => handleNav('renta_venta')} className="hover:text-[#F27C36] transition text-left">Planes de Renta Todo Incluido</button></li>
                  <li><button onClick={() => handleNav('contacto')} className="hover:text-[#F27C36] transition text-left">Pólizas Preventivas Kyocera</button></li>
                </>
              )}
              <li><button onClick={() => handleNav('contacto')} className="hover:text-[#F27C36] transition text-left">Asesoría en Equipamiento</button></li>
            </ul>
          </div>

          {/* Col 5: Empresa & Soporte */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#F27C36] pl-2">
              Empresa y Atención
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><button onClick={() => handleNav('nosotros')} className="hover:text-[#F27C36] transition text-left">Sobre Nosotros</button></li>
              <li><button onClick={() => handleNav('nosotros')} className="hover:text-[#F27C36] transition text-left">Cobertura en México</button></li>
              <li><button onClick={() => handleNav('contacto')} className="hover:text-[#F27C36] transition text-left">Contacto Directo</button></li>
              <li><button onClick={() => handleNav('tienda')} className="hover:text-[#F27C36] transition text-left">Facturación CFDI 4.0 SAT</button></li>
              <li><button onClick={() => handleNav('admin')} className="text-[#F27C36] hover:text-white font-semibold transition text-left flex items-center space-x-1"><span>Acceso Admin Autoadministrable →</span></button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-[#394B61] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} LUMESA. Todos los derechos reservados. Distribuidor Autorizado Kyocera Japón en México.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#394B61] hover:bg-[#000000] text-slate-200 hover:text-white border border-[#394B61] transition"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#F27C36]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
