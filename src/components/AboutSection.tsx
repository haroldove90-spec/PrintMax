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
  const badgeText = content?.badgeText ?? "Distribuidor Kiosera";
  const headline = content?.headline || "Una empresa potosina de soluciones de impresión";
  const subheadline = content?.subheadline || "Respaldando el éxito y la productividad de tu empresa con soluciones documentales.";
  const queHacemosText = content?.queHacemosText || "En LUMESA rentamos y vendemos multifuncionales e impresoras láser de marca Kyocera. Te ayudamos a elegir el equipo según tu volumen de impresión, si necesitas color o doble carta, y te enviamos una cotización sin compromiso.";
  const sobreNosotrosText1 = content?.sobreNosotrosText1 || "LUMESA nace en San Luis Potosí con una idea sencilla: que cualquier negocio pueda tener equipos de impresión de calidad profesional sin complicaciones. Trabajamos con atención directa y trato personal, desde que eliges tu equipo hasta que lo tienes funcionando en tu oficina.";
  const sobreNosotrosText2 = content?.sobreNosotrosText2 || "";
  const clientsCount = content?.clientsCount || "";
  const experienceYears = content?.experienceYears || "";

  const showQueHacemos = visibility?.showQueHacemos !== false;
  const showSobreNosotros = visibility?.showSobreNosotros !== false;
  const showAboutStats = visibility?.showAboutStats === true && !!clientsCount && !!experienceYears;
  const showCoverageMap = visibility?.showCoverageMap !== false;

  const defaultPillars = [
    {
      id: "atencion-directa",
      title: "Atención directa",
      description: "Hablas con nosotros, no con un conmutador.",
      icon: "Award"
    },
    {
      id: "equipos-confiables",
      title: "Equipos confiables",
      description: "Multifuncionales e impresoras láser diseñados para trabajo de oficina diario.",
      icon: "Cpu"
    },
    {
      id: "cotizacion-medida",
      title: "Cotización a tu medida",
      description: "Te proponemos el equipo que de verdad necesitas, ni más ni menos.",
      icon: "MapPin"
    }
  ];

  const bullets = content?.queHacemosBullets && content.queHacemosBullets.length > 0
    ? content.queHacemosBullets
    : [
        "Renta de equipos: Equipo instalado en tu oficina con un pago mensual. Cotizamos según tu volumen de impresión.",
        "Venta de equipos: Multifuncionales e impresoras láser en blanco y negro y a color, tamaño carta, oficio y doble carta.",
        "Servicio técnico: Mantenimiento y soporte para los equipos que rentas o compras con nosotros."
      ];

  const chips = content?.queHacemosChips && content.queHacemosChips.length > 0
    ? content.queHacemosChips
    : [
        "Renta Dedicada",
        "Venta de Hardware A3 / A4",
        "Tóner Original Certificado",
        "Pólizas Preventivas"
      ];

  const pillars = content?.pillars && content.pillars.length > 0 ? content.pillars : defaultPillars;

  const pillarIconMap: Record<string, React.ElementType> = {
    Award,
    Cpu,
    MapPin,
    ShieldCheck,
    Clock
  };

  return (
    <section id="nosotros" className="py-20 bg-white text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badgeText && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black text-white border border-neutral-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              <span>{badgeText}</span>
            </div>
          )}
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
                    {content?.queHacemosTitle || 'Qué Hacemos'}
                  </h3>
                  <div className="text-slate-200 leading-relaxed mb-6 font-normal text-sm sm:text-base">
                    <FormattedText text={queHacemosText} />
                  </div>
                  
                  {/* Viñetas Dinámicas Editables de Qué Hacemos */}
                  <div className="p-5 rounded-2xl bg-[#182F4F]/60 border border-[#394B61] text-xs sm:text-sm text-slate-300 mb-6 space-y-3">
                    {bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start space-x-3">
                        <ShieldCheck className="w-5 h-5 text-[#F27C36] shrink-0 mt-0.5" />
                        <span>
                          <FormattedText text={bullet} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Etiquetas / Chips de Servicios */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#394B61]">
                  {chips.map((chip, cIdx) => (
                    <span key={cIdx} className="px-3 py-1 rounded-lg bg-[#182F4F] text-xs font-semibold text-slate-200 border border-[#394B61]">
                      {chip}
                    </span>
                  ))}
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
                    {content?.sobreNosotrosTitle || 'Sobre Nosotros'}
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

        {/* 3 Pilares Dinámicos Editables en el CMS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, pIdx) => {
            const Icon = pillarIconMap[pillar.icon || ''] || (pIdx === 0 ? Award : pIdx === 1 ? Cpu : MapPin);
            return (
              <div 
                key={pillar.id || pIdx} 
                className="p-6 rounded-2xl bg-[#182F4F] text-white border border-[#394B61] shadow-md flex items-start space-x-4"
              >
                <div className="p-3 rounded-xl bg-[#000000]/50 border border-[#394B61] shrink-0">
                  <Icon className="w-6 h-6 text-[#F27C36]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    <FormattedText text={pillar.title} />
                  </h4>
                  <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                    <FormattedText text={pillar.description} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
