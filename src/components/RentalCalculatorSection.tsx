import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Wrench, 
  RefreshCw, 
  BadgePercent, 
  ArrowRight,
  Send,
  HelpCircle
} from 'lucide-react';
import { RENTAL_PERKS } from '../data/mockData';

interface RentalCalculatorSectionProps {
  onQuoteRental: (details: { format: string; mode: string; volume: number; estimatedPrice: number }) => void;
}

export const RentalCalculatorSection: React.FC<RentalCalculatorSectionProps> = ({
  onQuoteRental
}) => {
  const [format, setFormat] = useState<'A4' | 'A3'>('A3');
  const [mode, setMode] = useState<'mono' | 'color'>('color');
  const [volume, setVolume] = useState<number>(6000);
  const [contractTerm, setContractTerm] = useState<number>(36); // 12, 24, 36 meses

  // Calculation formula based on industry standard Kyocera cost per page & lease amortization
  const baseMonthly = format === 'A3' 
    ? (mode === 'color' ? 2600 : 1850) 
    : (mode === 'color' ? 1450 : 990);

  const costPerPage = mode === 'color' ? 0.22 : 0.08;
  const volumeComponent = volume * costPerPage * 0.45;
  const termDiscountMultiplier = contractTerm === 36 ? 0.90 : contractTerm === 24 ? 0.95 : 1.0;

  const estimatedMonthly = Math.round((baseMonthly + volumeComponent) * termDiscountMultiplier);

  const perkIcons: Record<string, React.ElementType> = {
    BadgePercent,
    Wrench,
    Layers,
    RefreshCw
  };

  const handleSendToQuote = () => {
    onQuoteRental({
      format: format === 'A3' ? 'Multifuncional A3 (Doble Carta / Oficio / Carta)' : 'Multifuncional A4 (Carta / Oficio)',
      mode: mode === 'color' ? 'A Todo Color y B&N' : 'Monocromático (B&N)',
      volume,
      estimatedPrice: estimatedMonthly
    });
  };

  return (
    <section id="renta" className="py-20 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#182F4F] text-white border border-[#394B61] text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-4 h-4 text-[#F27C36]" />
            <span>Servicios de Renta de Equipos Kyocera</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#182F4F] tracking-tight">
            Arrendamiento Inteligente 100% Deducible
          </h2>
          <p className="mt-4 text-[#394B61] text-base sm:text-lg leading-relaxed">
            El servicio de renta de impresoras Kyocera ofrece una solución integral con seguimiento de asesoría y servicio al cliente por más de 30 años de experiencia. Obtenga equipos de última generación con gran ahorro y máxima productividad.
          </p>
        </div>

        {/* 4 Benefits Cards with Black Background and LUMESA Accents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {RENTAL_PERKS.map((perk, i) => {
            const Icon = perkIcons[perk.icon] || CheckCircle2;
            return (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-[#000000] text-white border border-neutral-800 hover:border-[#F27C36]/60 hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#182F4F] border border-[#394B61] text-[#F27C36] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#F27C36]" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                    {perk.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Rental Simulator Box */}
        <div className="bg-gradient-to-br from-[#182F4F] via-[#182F4F] to-[#000000] rounded-3xl text-white p-6 sm:p-10 shadow-2xl border border-[#394B61] relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-10">
              <span className="text-[#F27C36] text-xs font-bold uppercase tracking-widest block mb-1">
                Simulador Dinámico de Renta
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Calcula tu Plan de Renta a la Medida
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-light">
                Ajusta los parámetros para obtener un estimado mensual inmediato con tóner, refacciones y mantenimiento incluidos.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Controls */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Format */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    1. Formato Máximo de Papel
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormat('A3')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        format === 'A3'
                          ? 'bg-[#F27C36] border-[#F27C36] text-white font-bold ring-2 ring-[#F27C36]/50'
                          : 'bg-[#394B61]/50 border-[#394B61] text-slate-200 hover:bg-[#394B61]'
                      }`}
                    >
                      <div className="text-sm">Formato A3</div>
                      <div className="text-[11px] opacity-80">Hasta Doble Carta (11" x 17")</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat('A4')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        format === 'A4'
                          ? 'bg-[#F27C36] border-[#F27C36] text-white font-bold ring-2 ring-[#F27C36]/50'
                          : 'bg-[#394B61]/50 border-[#394B61] text-slate-200 hover:bg-[#394B61]'
                      }`}
                    >
                      <div className="text-sm">Formato A4</div>
                      <div className="text-[11px] opacity-80">Carta y Oficio Compacto</div>
                    </button>
                  </div>
                </div>

                {/* 2. Color vs Mono */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    2. Modalidad de Impresión
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('color')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        mode === 'color'
                          ? 'bg-[#F27C36] border-[#F27C36] text-white font-bold ring-2 ring-[#F27C36]/50'
                          : 'bg-[#394B61]/50 border-[#394B61] text-slate-200 hover:bg-[#394B61]'
                      }`}
                    >
                      <div className="text-sm">Color + B&N</div>
                      <div className="text-[11px] opacity-80">Fotografía y gráficos de impacto</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('mono')}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        mode === 'mono'
                          ? 'bg-[#F27C36] border-[#F27C36] text-white font-bold ring-2 ring-[#F27C36]/50'
                          : 'bg-[#394B61]/50 border-[#394B61] text-slate-200 hover:bg-[#394B61]'
                      }`}
                    >
                      <div className="text-sm">Solo Monocromático</div>
                      <div className="text-[11px] opacity-80">Blanco y negro económico</div>
                    </button>
                  </div>
                </div>

                {/* 3. Volume Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      3. Volumen Mensual Estimado
                    </label>
                    <span className="text-sm font-bold text-[#F27C36] font-mono">
                      {volume.toLocaleString('es-MX')} impresiones / mes
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="30000"
                    step="1000"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-[#394B61] rounded-lg appearance-none cursor-pointer accent-[#F27C36]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1,000 págs</span>
                    <span>15,000 págs</span>
                    <span>30,000 págs</span>
                  </div>
                </div>

                {/* 4. Term */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    4. Plazo del Arrendamiento
                  </label>
                  <div className="flex space-x-3">
                    {[12, 24, 36].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setContractTerm(months)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition ${
                          contractTerm === months
                            ? 'bg-[#F27C36] text-white border-[#F27C36]'
                            : 'bg-[#394B61]/50 text-slate-200 border-[#394B61] hover:bg-[#394B61]'
                        }`}
                      >
                        {months} Meses {months === 36 && '⭐'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimate Display Card */}
              <div className="lg:col-span-5 bg-[#000000]/70 rounded-2xl p-6 border border-[#394B61] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                    Cuota Mensual Estimada
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                    ${estimatedMonthly.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN/mes + IVA</span>
                  </div>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    100% deducible de impuestos (ISR)
                  </span>

                  <div className="mt-6 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F27C36] shrink-0" />
                      <span>Equipo Kyocera nuevo de última generación</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F27C36] shrink-0" />
                      <span>Tóner original para {volume.toLocaleString()} págs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F27C36] shrink-0" />
                      <span>Soporte técnico y refacciones sin costo extra</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F27C36] shrink-0" />
                      <span>Asistencia en sitio en menos de 24 horas</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#394B61]">
                  <button
                    onClick={handleSendToQuote}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#F27C36] hover:bg-[#d96624] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-[#F27C36]/30 transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Solicitar Propuesta Formal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Respuesta con contrato y corrida financiera en menos de 4 horas hábiles.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
