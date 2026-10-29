import React from 'react';
import { 
  Wrench, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Store, 
  Truck, 
  CalendarCheck, 
  ArrowRight,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { SERVICE_MODALITIES } from '../data/mockData';

interface TechnicalSupportSectionProps {
  onSelectPolicy: (policyName: string) => void;
}

export const TechnicalSupportSection: React.FC<TechnicalSupportSectionProps> = ({
  onSelectPolicy
}) => {
  const modalityIcons = [Store, Truck, CalendarCheck];

  return (
    <section id="soporte" className="py-20 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Garantía de Respuesta &lt; 24 Horas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Servicio Técnico y Pólizas Anuales
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Personal con <strong className="text-slate-900">certificación oficial Kyocera Japón</strong> y asistencia técnica garantizada en menos de 24 horas tras su llamada para que la productividad de su oficina nunca se detenga.
          </p>
        </div>

        {/* 3 Modalities Grid with Black Background Cards and Blue Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {SERVICE_MODALITIES.map((mod, index) => {
            const Icon = modalityIcons[index] || Wrench;
            return (
              <div 
                key={mod.title}
                className="bg-black text-white rounded-3xl p-7 border border-neutral-800 shadow-xl hover:border-neutral-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-blue-500 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold text-blue-400 bg-neutral-900 border border-neutral-800 mb-2">
                    {mod.schedule}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                    {mod.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlighted Annual Maintenance Policy Box (Exact text from PDF) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Plan Recomendado para Corporativos</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
                Póliza Anual de Mantenimiento Integral
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
                Ahorre el <strong className="text-white font-bold">100% en servicios correctivos</strong> y mantenimientos preventivos trimestrales ilimitados, con un <strong className="text-blue-400 font-bold">15% de descuento en refacciones y consumibles</strong>, y atención prioritaria a domicilio (Cobertura con base central en <strong className="text-white font-bold">San Luis Potosí, S.L.P.</strong> y servicio nacional).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-start space-x-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Mano de obra 100% cubierta en cualquier reparación</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>15% de descuento en cilindros y tóner original</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Atención técnica en menos de 24 horas garantizada</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Asesoría remota y configuración de red ilimitada</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-800/90 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between text-center">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-bold">
                  Inversión Anual Corporativa
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-2">
                  $14,500 <span className="text-xs font-normal text-slate-400">MXN / año</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Hasta 3 equipos multifuncionales incluidos por contrato base.
                </p>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => onSelectPolicy('Póliza Anual de Mantenimiento')}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
                >
                  <span>Contratar Póliza Anual</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="tel:4448123000"
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  <span>Llamar al Taller: (444) 812-3000</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
