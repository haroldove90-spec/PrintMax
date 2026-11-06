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

import { SiteContent, AppSection, ContentVisibility } from '../types';
import { FormattedText } from './FormattedText';

interface AboutSectionProps {
  content?: SiteContent['about'];
  visibility?: ContentVisibility;
  onNavigate?: (section: AppSection) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content, visibility, onNavigate }) => {
  const headline = content?.headline || "Tres Décadas de Liderazgo en Gestión Documental";
  const subheadline = content?.subheadline || "Con base central en San Luis Potosí y cobertura a nivel nacional, respaldamos a más de 2,000 empresas con tecnología de impresión y soporte técnico especializado.";
  const queHacemosText = content?.queHacemosText || "Impulsamos la calidad, eficiencia y productividad en cada uno de sus procesos de gestión documental. Nos apasiona optimizar el rendimiento de su infraestructura tecnológica, por lo que ponemos a su disposición la venta, renta y soporte técnico especializado de equipos Kyocera.";
  const sobreNosotrosText1 = content?.sobreNosotrosText1 || "Creemos firmemente que el motor de nuestro crecimiento como empresa y como personas es la absoluta satisfacción de cada cliente. Somos un centro de distribución oficial de Kyocera en México con sede en San Luis Potosí y más de dos décadas de trayectoria en el mercado.";
  const sobreNosotrosText2 = content?.sobreNosotrosText2 || "Como representantes líderes en el sector de la impresión digital, respaldamos a una cartera de más de 2,000 clientes a nivel nacional con servicios de renta, venta y soporte técnico especializado.";
  const clientsCount = content?.clientsCount || "+2,000";
  const experienceYears = content?.experienceYears || "+30";

  const showQueHacemos = visibility?.showQueHacemos ?? true;
  const showSobreNosotros = visibility?.showSobreNosotros ?? true;
  const showAboutStats = visibility?.showAboutStats ?? true;

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
            <FormattedText text={headline} />
          </h2>
          <div className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            <FormattedText text={subheadline} />
          </div>
        </div>

        {/* 2. Qué Hacemos & Sobre Nosotros Cards (Controladas por el CMS) */}
        {(showQueHacemos || showSobreNosotros) && (
          <div className={`grid gap-8 items-stretch mb-16 ${
            showQueHacemos && showSobreNosotros 
              ? 'grid-cols-1 lg:grid-cols-2' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            
            {/* Card 1: Qué Hacemos (Activable / Desactivable desde el CMS) */}
            {showQueHacemos && (
              <div className="p-8 sm:p-10 rounded-3xl bg-[#000000] text-white border border-[#394B61] shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#182F4F] border border-[#394B61] flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-[#F27C36]" />
                  </div>

                  <div className="text-xs font-bold text-[#F27C36] uppercase tracking-widest mb-1">
                    Sección 2 • Propuesta de Valor
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">
                    Qué Hacemos
                  </h3>
                  <div className="text-slate-200 leading-relaxed mb-6 font-normal text-sm sm:text-base">
                    <FormattedText text={queHacemosText} />
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-[#182F4F]/60 border border-[#394B61] text-xs sm:text-sm text-slate-300 mb-6 space-y-3">
                    <div className="flex items-start space-x-3">
                      <ShieldCheck className="w-5 h-5 text-[#F27C36] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Ingenieros certificados directamente por Kyocera</strong> y un amplio stock de refacciones y consumibles originales.
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-[#F27C36] shrink-0 mt-0.5" />
                      <span>
                        Garantía de respuesta y asistencia técnica en <strong className="text-white">menos de 24 horas</strong> a partir de su llamada.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#394B61]">
                  <span className="px-3 py-1 rounded-lg bg-[#182F4F] text-xs font-semibold text-slate-200 border border-[#394B61]">
                    Renta Dedicada
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#182F4F] text-xs font-semibold text-slate-200 border border-[#394B61]">
                    Venta de Hardware A3 / A4
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#182F4F] text-xs font-semibold text-slate-200 border border-[#394B61]">
                    Tóner Original Certificado
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#182F4F] text-xs font-semibold text-slate-200 border border-[#394B61]">
                    Pólizas Preventivas
                  </span>
                </div>
              </div>
            )}

            {/* Card 2: Sobre Nosotros (Activable / Desactivable desde el CMS) */}
            {showSobreNosotros && (
              <div className="p-8 sm:p-10 rounded-3xl bg-[#000000] text-white border border-[#394B61] shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#182F4F] border border-[#394B61] flex items-center justify-center mb-6">
                    <Compass className="w-6 h-6 text-[#F27C36]" />
                  </div>

                  <div className="text-xs font-bold text-[#F27C36] uppercase tracking-widest mb-1">
                    Sección 3 • Nuestra Identidad
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">
                    Sobre Nosotros
                  </h3>
                  <div className="text-slate-200 leading-relaxed mb-6 font-normal text-sm sm:text-base">
                    <FormattedText text={sobreNosotrosText1} />
                  </div>
                  
                  <div className="text-slate-300 leading-relaxed mb-6 font-normal text-xs sm:text-sm">
                    <FormattedText text={sobreNosotrosText2} />
                  </div>

                  {/* Cifras y Estadísticas (Activables / Desactivables) */}
                  {showAboutStats && (
                    <div className="grid grid-cols-2 gap-4 my-6">
                      <div className="p-3.5 rounded-xl bg-[#182F4F] border border-[#394B61]">
                        <div className="text-2xl font-black text-white">{clientsCount}</div>
                        <div className="text-xs text-slate-300">Empresas respaldadas</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#182F4F] border border-[#394B61]">
                        <div className="text-2xl font-black text-white">{experienceYears} Años</div>
                        <div className="text-xs text-slate-300">Trayectoria Oficial Kyocera</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#394B61] flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">LUMESA Soluciones Documentales</span>
                  {onNavigate ? (
                    <button 
                      onClick={() => onNavigate('contacto')}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
                    >
                      <span>Solicitar Asesoría</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F27C36]" />
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">San Luis Potosí, México</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3 Pillars in Black Background with Orange/Blue Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#182F4F] text-white border border-[#394B61] shadow-md flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-[#000000]/50 border border-[#394B61] shrink-0">
              <Award className="w-6 h-6 text-[#F27C36]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Certificación Directa Japón</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Garantía oficial LUMESA y soporte avalado por la fábrica con personal en constante actualización.
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
