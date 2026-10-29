import React from 'react';
import { 
  Building2, 
  CheckCircle, 
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
    <section id="nosotros" className="py-20 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Centro Oficial de Distribución Kyocera Japón</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tres Décadas de Liderazgo en Gestión Documental
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Con base en <strong className="text-slate-900">San Luis Potosí</strong> y cobertura a nivel nacional, respaldamos la productividad de más de 2,000 empresas con tecnología de impresión premiada y soporte técnico inmediato.
          </p>
        </div>

        {/* 2. Qué Hacemos Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-20">
          {/* Card 1: Qué Hacemos */}
          <div className="p-8 sm:p-10 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                Sección 2 • Propuesta de Valor
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                Qué Hacemos
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Impulsamos la <strong>calidad, eficiencia y productividad</strong> en cada uno de sus procesos de gestión documental. Nos apasiona optimizar el rendimiento de su infraestructura tecnológica, por lo que ponemos a su disposición la <strong className="text-slate-900">venta, renta y soporte técnico especializado</strong> de equipos Kyocera.
              </p>
              
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-sm text-slate-700 mb-6 space-y-2">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ingenieros certificados directamente por Kyocera</strong> y un amplio stock de refacciones y consumibles 100% originales.
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Garantía de respuesta y asistencia técnica en <strong>menos de 24 horas</strong> a partir de su llamada.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
              <span className="px-3 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 border border-slate-200">
                Renta Dedicada
              </span>
              <span className="px-3 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 border border-slate-200">
                Venta de Hardware A3 / A4
              </span>
              <span className="px-3 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 border border-slate-200">
                Tóner Original Certificado
              </span>
              <span className="px-3 py-1 rounded-md bg-white text-xs font-semibold text-slate-700 border border-slate-200">
                Pólizas Preventivas
              </span>
            </div>
          </div>

          {/* Card 2: Sobre Nosotros */}
          <div className="p-8 sm:p-10 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/30">
                <Compass className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                Sección 3 • Nuestra Identidad
              </div>
              <h3 className="text-2xl font-black text-white mb-4">
                Sobre Nosotros
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6 font-light">
                Creemos firmemente que el motor de nuestro crecimiento como empresa y como personas es la <strong className="text-white font-medium">absoluta satisfacción de cada cliente</strong>. Somos un centro de distribución oficial de Kyocera en México con sede en San Luis Potosí y más de tres décadas de trayectoria en el mercado.
              </p>
              
              <p className="text-slate-300 leading-relaxed mb-6 font-light text-sm">
                Como representantes líderes en el sector de la impresión digital, respaldamos a una cartera de más de <strong className="text-white font-medium">2,000 clientes a nivel nacional</strong>. Desde una impresora esencial hasta robustas soluciones de software para el control y gestión del trabajo, le ofrecemos asesoramiento profesional, trato totalmente personalizado y un equipo en constante capacitación.
              </p>

              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="text-2xl font-extrabold text-blue-400">+2,000</div>
                  <div className="text-xs text-slate-300">Empresas respaldadas</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="text-2xl font-extrabold text-emerald-400">SLP y Nal.</div>
                  <div className="text-xs text-slate-300">Cobertura en México</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">KM Corporación / PrintMax</span>
              <a 
                href="#contacto" 
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
              >
                <span>Solicitar Asesoría Personalizada</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 3 Pillars Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-blue-600/30 text-blue-300 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Certificación Directa Kyocera Japón</h4>
                <p className="text-xs text-blue-100/80 mt-1">Garantía oficial y soporte avalado por la fábrica con personal en constante actualización.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-blue-600/30 text-blue-300 shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Componentes Cerámicos ECOSYS</h4>
                <p className="text-xs text-blue-100/80 mt-1">Cilindros de silicio amorfo de hasta 600,000 páginas que disminuyen costos operativos.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-lg bg-blue-600/30 text-blue-300 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Centro Logístico San Luis Potosí</h4>
                <p className="text-xs text-blue-100/80 mt-1">Envío exprés y distribución ágil de consumibles y piezas a todo el territorio nacional.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
