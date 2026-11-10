import React from 'react';
import { Calculator, Printer, Wrench, Users, CheckCircle2, LucideIcon } from 'lucide-react';
import { SiteContent } from '../types';
import { TRUST_METRICS } from '../data/mockData';

interface TrustStatsProps {
  metrics?: SiteContent['trustMetrics'];
}

export const TrustStats: React.FC<TrustStatsProps> = ({ metrics }) => {
  const activeMetrics = metrics && metrics.length > 0 ? metrics : TRUST_METRICS;
  const iconList: LucideIcon[] = [Calculator, Printer, Wrench, Users];

  return (
    <section className="bg-white border-b border-slate-200 py-10 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeMetrics.map((metric, index: number) => {
            const Icon = iconList[index % iconList.length] || CheckCircle2;
            const hasNumber = Boolean(metric.value && metric.value.trim().length > 0);

            return (
              <div 
                key={metric.label || index}
                className="flex items-start space-x-4 p-5 rounded-2xl bg-[#000000] text-white border border-[#394B61] shadow-lg hover:border-[#F27C36] hover:shadow-xl transition group"
              >
                <div className="p-3 rounded-xl bg-[#182F4F] border border-[#394B61] text-[#F27C36] group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#F27C36]" />
                </div>
                <div className="flex-1 min-w-0">
                  {hasNumber && (
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                      {metric.value}
                    </div>
                  )}
                  <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#F27C36] transition leading-snug">
                    {metric.label}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed capitalize-first">
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
