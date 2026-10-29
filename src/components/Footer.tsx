import React from 'react';
import { 
  Printer, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp,
  FileText
} from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090d14] text-white border-t border-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Upper Footer: Quick Support Banner */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 bg-[#0b1019]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                ¿Necesita asistencia técnica urgente para su multifuncional Kyocera?
              </h4>
              <p className="text-xs text-slate-400">
                Garantizamos visita en menos de 24 horas a través de nuestra red de ingenieros certificados.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="tel:4448123000"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>(444) 812-3000</span>
            </a>
            <a
              href="https://wa.me/524448123000?text=Hola,%20solicito%20soporte%20tecnico%20urgente%20Kyocera"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-1.5"
            >
              <span>WhatsApp de Soporte</span>
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
                src="https://appdesignproyectos.com/printmaxlogo.png"
                alt="PrintMax Kyocera"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <span className="text-xl font-black text-white">
                  PRINT<span className="text-blue-500">MAX</span>
                </span>
                <span className="block text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  KM Corporación S.A. de C.V.
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light max-w-sm">
              Con más de tres décadas de experiencia en el mercado mexicano, somos distribuidores autorizados y centro de distribución oficial de Kyocera Japón, con base en San Luis Potosí y cobertura de servicio a nivel nacional.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>San Luis Potosí, S.L.P., México. C.P. 78230</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Lunes a Viernes: 09:00 a 18:00 hrs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contacto@printmax.com.mx</span>
              </div>
            </div>
          </div>

          {/* Col 3: Hardware */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Hardware Kyocera
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#hardware" className="hover:text-blue-400 transition">Multifuncionales A3 Color</a></li>
              <li><a href="#hardware" className="hover:text-blue-400 transition">Multifuncionales A3 B&N</a></li>
              <li><a href="#hardware" className="hover:text-blue-400 transition">Multifuncionales A4 Compactos</a></li>
              <li><a href="#hardware" className="hover:text-blue-400 transition">Impresoras Láser ECOSYS</a></li>
              <li><a href="#hardware" className="hover:text-blue-400 transition">Inyección TASKalfa Pro</a></li>
              <li><a href="#tienda" className="hover:text-blue-400 transition">Tóner Original Certificado</a></li>
            </ul>
          </div>

          {/* Col 4: Soluciones & Renta */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Software & Renta
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#software" className="hover:text-blue-400 transition">KYOCERA Net Manager</a></li>
              <li><a href="#software" className="hover:text-blue-400 transition">Control de Costos MyQ</a></li>
              <li><a href="#software" className="hover:text-blue-400 transition">Fleet Services & Monitoreo</a></li>
              <li><a href="#software" className="hover:text-blue-400 transition">DMConnect & OCR</a></li>
              <li><a href="#renta" className="hover:text-blue-400 transition">Renta Deducible al 100%</a></li>
              <li><a href="#renta" className="hover:text-blue-400 transition">Calculadora de Renta</a></li>
            </ul>
          </div>

          {/* Col 5: Soporte & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Soporte y Garantías
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#soporte" className="hover:text-blue-400 transition">Asistencia Técnica &lt; 24h</a></li>
              <li><a href="#soporte" className="hover:text-blue-400 transition">Póliza Anual de Mantenimiento</a></li>
              <li><a href="#soporte" className="hover:text-blue-400 transition">Servicio en Taller SLP</a></li>
              <li><a href="#tienda" className="hover:text-blue-400 transition">Facturación CFDI 4.0 SAT</a></li>
              <li><a href="#contacto" className="hover:text-blue-400 transition">Aviso de Privacidad</a></li>
              <li><a href="#contacto" className="hover:text-blue-400 transition">Términos de Garantía</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} KM Corporación / PrintMax. Todos los derechos reservados. Distribuidor Autorizado Kyocera Document Solutions Japón en México.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
