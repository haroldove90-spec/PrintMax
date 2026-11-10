import React from 'react';
import { MapPin, MessageSquare, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CoverageConfig } from '../types';

interface CoverageMapSectionProps {
  content?: CoverageConfig;
  onContact?: () => void;
}

export const CoverageMapSection: React.FC<CoverageMapSectionProps> = ({ content, onContact }) => {
  const tag = content?.tag || 'Cobertura';
  const title = content?.title || 'Cobertura';
  const text = content?.text || 'Atendemos en San Luis Potosí. ¿Tu empresa está en otra ciudad? Escríbenos y revisamos las opciones de servicio para tu zona.';
  const ctaText = content?.ctaText || 'Escríbenos y revisamos tu zona';

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200/80 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#182F4F] via-[#112239] to-[#0A1626] text-white p-8 sm:p-12 shadow-xl border border-[#394B61]/60">
          
          {/* Subtle background decoration */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#F27C36]/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            {/* Left: Text & Badges */}
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-bold uppercase tracking-wider text-white">
                <MapPin className="w-3.5 h-3.5 text-[#F27C36]" />
                <span>{tag}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
                {text}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                <span className="inline-flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sede matriz en San Luis Potosí</span>
                </span>
                <span className="inline-flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#F27C36] shrink-0" />
                  <span>Atención y asesoría personalizada</span>
                </span>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
              <button
                type="button"
                onClick={onContact}
                className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-[#F27C36] hover:bg-[#d96726] text-white font-bold text-sm shadow-lg shadow-orange-950/30 transition-all transform active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export const CoverageSection = CoverageMapSection;
