import React from 'react';
import { Award, Users, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import { TRUST_METRICS } from '../data/mockData';

export const TrustStats: React.FC = () => {
  const iconMap = [Award, Users, Clock, ShieldCheck];

  return (
    <section className="bg-white border-b border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_METRICS.map((metric, index) => {
            const Icon = iconMap[index] || CheckCircle;
            return (
              <div 
                key={metric.label}
                className="flex items-start space-x-4 p-5 rounded-2xl bg-black text-white border border-neutral-800 shadow-md hover:border-neutral-700 transition"
              >
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-blue-500 shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-neutral-200 mt-0.5">
                    {metric.label}
                  </div>
                  <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 leading-snug">
                    {metric.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
