import React from 'react';
import { Award, Users, Clock, ShieldCheck, CheckCircle } from 'lucide-react';
import { TRUST_METRICS } from '../data/mockData';

export const TrustStats: React.FC = () => {
  const iconMap = [Award, Users, Clock, ShieldCheck];

  return (
    <section className="bg-white border-b border-slate-100 relative z-20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_METRICS.map((metric, index) => {
            const Icon = iconMap[index] || CheckCircle;
            return (
              <div 
                key={metric.label}
                className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-md transition group"
              >
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {metric.label}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
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
