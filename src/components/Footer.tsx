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
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (section: AppSection) => {
    onSelectSection(section);
    scrollToTop();
  };

  return (
    <footer className="bg-black text-white border-t border-neutral-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Upper Footer: Quick Support Banner */}
      <div className="border-b border-neutral-800/80 py-8 px-4 sm:px-6 lg:px-8 bg-neutral-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-blue-500">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                ¿Necesita asistencia técnica o asesoría para su equipo Kyocera?
              </h4>
              <p className="text-xs text-neutral-400">
                Garantizamos respuesta en menos de 24 horas con refacciones originales y técnicos certificados.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="tel:4448123000"
              className="px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-900 text-white text-xs font-bold transition flex items-center space-x-1.5 border border-neutral-800"
            >
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              <span>(444) 812-3000</span>
            </a>
            <a
              href="https://wa.me/524448123000?text=Hola,%20solicito%20atencion%20Printmax%20Kyocera"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition flex items-center space-x-1.5 border border-neutral-700 hover:border-emerald-500"
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
                src="/printmaxlogo.png"
                alt="Printmax"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://appdesignproyectos.com/printmaxlogo.png";
                }}
              />
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-light max-w-sm">
              Con más de tres décadas de experiencia en el mercado mexicano, somos distribuidores autorizados y centro de distribución oficial de Kyocera Japón, con base en San Luis Potosí y cobertura de servicio a nivel nacional.
            </p>

            <div className="pt-2 text-xs text-neutral-400 space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>San Luis Potosí, S.L.P., México. C.P. 78230</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Lunes a Viernes: 09:00 a 18:00 hrs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>contacto@printmax.com.mx</span>
              </div>
            </div>
          </div>

          {/* Col 3: Secciones */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Secciones
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><button onClick={() => handleNav('inicio')} className="hover:text-blue-400 transition text-left">Inicio & Slider</button></li>
              <li><button onClick={() => handleNav('tienda')} className="hover:text-blue-400 transition text-left">Tienda en Línea</button></li>
              <li><button onClick={() => handleNav('hardware')} className="hover:text-blue-400 transition text-left">Hardware & Equipos</button></li>
              <li><button onClick={() => handleNav('renta')} className="hover:text-blue-400 transition text-left">Renta de Equipos</button></li>
              <li><button onClick={() => handleNav('software')} className="hover:text-blue-400 transition text-left">Software Kyocera</button></li>
              <li><button onClick={() => handleNav('soporte')} className="hover:text-blue-400 transition text-left">Soporte Técnico &lt; 24h</button></li>
            </ul>
          </div>

          {/* Col 4: Hardware & Soluciones */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Equipos & Software
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><button onClick={() => handleNav('hardware')} className="hover:text-blue-400 transition text-left">Multifuncionales A3 Color</button></li>
              <li><button onClick={() => handleNav('hardware')} className="hover:text-blue-400 transition text-left">Multifuncionales A4 Compactos</button></li>
              <li><button onClick={() => handleNav('tienda')} className="hover:text-blue-400 transition text-left">Tóner y Consumibles</button></li>
              <li><button onClick={() => handleNav('software')} className="hover:text-blue-400 transition text-left">KYOCERA Net Manager</button></li>
              <li><button onClick={() => handleNav('software')} className="hover:text-blue-400 transition text-left">Control de Costos MyQ</button></li>
              <li><button onClick={() => handleNav('renta')} className="hover:text-blue-400 transition text-left">Simulador de Arrendamiento</button></li>
            </ul>
          </div>

          {/* Col 5: Empresa & Soporte */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Empresa y Atención
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li><button onClick={() => handleNav('nosotros')} className="hover:text-blue-400 transition text-left">Sobre Nosotros</button></li>
              <li><button onClick={() => handleNav('soporte')} className="hover:text-blue-400 transition text-left">Póliza Anual de Mantenimiento</button></li>
              <li><button onClick={() => handleNav('contacto')} className="hover:text-blue-400 transition text-left">Contacto Directo</button></li>
              <li><button onClick={() => handleNav('tienda')} className="hover:text-blue-400 transition text-left">Facturación CFDI 4.0 SAT</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <div>
            © {new Date().getFullYear()} Printmax / KM Corporación. Todos los derechos reservados. Distribuidor Autorizado Kyocera Japón en México.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
          </button>
        </div>
      </div>
    </footer>
  );
};
