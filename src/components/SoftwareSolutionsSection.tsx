import React, { useState } from 'react';
import { 
  Cpu, 
  Printer, 
  ShieldCheck, 
  Cloud, 
  Server, 
  Workflow, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { SOFTWARE_SOLUTIONS } from '../data/mockData';

interface SoftwareSolutionsSectionProps {
  onOpenConsultation: (solutionName: string) => void;
}

export const SoftwareSolutionsSection: React.FC<SoftwareSolutionsSectionProps> = ({
  onOpenConsultation
}) => {
  const [activeSolutionId, setActiveSolutionId] = useState(SOFTWARE_SOLUTIONS[1].id);

  const iconMap: Record<string, React.ElementType> = {
    Printer,
    ShieldCheck,
    Cloud,
    Server,
    Cpu: Workflow
  };

  const selectedSolution = SOFTWARE_SOLUTIONS.find((s) => s.id === activeSolutionId) || SOFTWARE_SOLUTIONS[0];

  return (
    <section id="software" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Subtle Tech Accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Gestión Digital & Flujos Inteligentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Software: Soluciones Inteligentes para tu Negocio
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            Optimice y asegure cada etapa del ciclo de vida de sus documentos. Transforme sus equipos multifuncionales Kyocera en centros neurálgicos de digitalización y ahorro corporativo.
          </p>
        </div>

        {/* 2-Column Interactive Software Navigator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Solution Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {SOFTWARE_SOLUTIONS.map((sol) => {
              const Icon = iconMap[sol.icon] || Cpu;
              const isSelected = sol.id === activeSolutionId;

              return (
                <button
                  key={sol.id}
                  onClick={() => setActiveSolutionId(sol.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all border flex items-start space-x-4 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-600/30'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className={`p-3 rounded-xl shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-700 text-blue-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {sol.title}
                      </h3>
                      {isSelected && <ArrowRight className="w-4 h-4 text-white shrink-0 ml-2" />}
                    </div>
                    <span className={`text-xs block mt-0.5 font-medium ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}>
                      {sol.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Solution Spotlight */}
          <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                Módulo Activo
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedSolution.tagline}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
              {selectedSolution.title}
            </h3>

            <p className="text-slate-300 text-base leading-relaxed mb-6">
              {selectedSolution.description}
            </p>

            <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-700/80 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4 flex items-center space-x-2">
                <Laptop className="w-4 h-4" />
                <span>Beneficios Directos para su Empresa</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSolution.benefits.map((ben, i) => (
                  <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{ben}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700">
              <div className="text-xs text-slate-400">
                Licenciamiento oficial con soporte de implementación en sitio.
              </div>

              <button
                onClick={() => onOpenConsultation(selectedSolution.title)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
              >
                <span>Solicitar Demostración</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
