import React from 'react';
import { 
  Building2, 
  Target, 
  Compass, 
  MapPin, 
  Award, 
  Cpu, 
  Clock, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-20 bg-white text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black text-white border border-neutral-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Centro Oficial de Distribución Kyocera Japón</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            Tres Décadas de Liderazgo en Gestión Documental
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Con base central en <strong className="text-black">San Luis Potosí</strong> y cobertura a nivel nacional, respaldamos a más de 2,000 empresas con tecnología de impresión y soporte técnico especializado.
          </p>
        </div>

        {/* 2. Qué Hacemos & Sobre Nosotros Cards with BLACK BACKGROUND and BLUE ICONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
          
          {/* Card 1: Qué Hacemos (Black background, blue icon) */}
          <div className="p-8 sm:p-10 rounded-3xl bg-black text-white border border-neutral-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-500" />
              </div>

              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                Sección 2 • Propuesta de Valor
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Qué Hacemos
              </h3>
              <p className="text-neutral-300 leading-relaxed mb-6 font-normal text-sm sm:text-base">
                Impulsamos la <strong className="text-white">calidad, eficiencia y productividad</strong> en cada uno de sus procesos de gestión documental. Nos apasiona optimizar el rendimiento de su infraestructura tecnológica, por lo que ponemos a su disposición la <strong className="text-white">venta, renta y soporte técnico especializado</strong> de equipos Kyocera.
              </p>
              
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs sm:text-sm text-neutral-300 mb-6 space-y-3">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Ingenieros certificados directamente por Kyocera</strong> y un amplio stock de refacciones y consumibles originales.
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    Garantía de respuesta y asistencia técnica en <strong className="text-white">menos de 24 horas</strong> a partir de su llamada.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-800">
              <span className="px-3 py-1 rounded-lg bg-neutral-900 text-xs font-semibold text-neutral-300 border border-neutral-800">
                Renta Dedicada
              </span>
              <span className="px-3 py-1 rounded-lg bg-neutral-900 text-xs font-semibold text-neutral-300 border border-neutral-800">
                Venta de Hardware A3 / A4
              </span>
              <span className="px-3 py-1 rounded-lg bg-neutral-900 text-xs font-semibold text-neutral-300 border border-neutral-800">
                Tóner Original Certificado
              </span>
              <span className="px-3 py-1 rounded-lg bg-neutral-900 text-xs font-semibold text-neutral-300 border border-neutral-800">
                Pólizas Preventivas
              </span>
            </div>
          </div>

          {/* Card 2: Sobre Nosotros (Black background, blue icon) */}
          <div className="p-8 sm:p-10 rounded-3xl bg-black text-white border border-neutral-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-blue-500" />
              </div>

              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                Sección 3 • Nuestra Identidad
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Sobre Nosotros
              </h3>
              <p className="text-neutral-300 leading-relaxed mb-6 font-normal text-sm sm:text-base">
                Creemos firmemente que el motor de nuestro crecimiento como empresa y como personas es la <strong className="text-white font-medium">absoluta satisfacción de cada cliente</strong>. Somos un centro de distribución oficial de Kyocera en México con sede en San Luis Potosí y más de tres décadas de trayectoria en el mercado.
              </p>
              
              <p className="text-neutral-300 leading-relaxed mb-6 font-normal text-xs sm:text-sm">
                Como representantes líderes en el sector de la impresión digital, respaldamos a una cartera de más de <strong className="text-white font-medium">2,000 clientes a nivel nacional</strong>. Desde una impresora esencial hasta robustas soluciones de software para el control y gestión del trabajo, le ofrecemos asesoramiento profesional, trato totalmente personalizado y un equipo en constante capacitación.
              </p>

              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-2xl font-black text-white">+2,000</div>
                  <div className="text-xs text-neutral-400">Empresas respaldadas</div>
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-2xl font-black text-white">SLP y Nal.</div>
                  <div className="text-xs text-neutral-400">Cobertura en México</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">KM Corporación / PrintMax</span>
              <a 
                href="#contacto" 
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-300 hover:text-white transition"
              >
                <span>Solicitar Asesoría</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
              </a>
            </div>
          </div>
        </div>

        {/* 3 Pillars in Black Background with Blue Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-black text-white border border-neutral-800 shadow-md flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0">
              <Award className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Certificación Directa Japón</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Garantía oficial y soporte avalado por la fábrica con personal en constante actualización.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-black text-white border border-neutral-800 shadow-md flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0">
              <Cpu className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Componentes Cerámicos ECOSYS</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Cilindros de silicio amorfo de larga duración que reducen costos drásticamente.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-black text-white border border-neutral-800 shadow-md flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0">
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hub San Luis Potosí</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Envío exprés y distribución ágil de consumibles y piezas a todo el país.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
