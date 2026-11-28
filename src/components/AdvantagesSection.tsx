import { Banknote, Globe, PlaneLanding, UserCheck } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/transferData';

interface AdvantagesSectionProps {
  lang: Language;
}

const ICONS = [Banknote, PlaneLanding, UserCheck, Globe] as const;

export function AdvantagesSection({ lang }: AdvantagesSectionProps) {
  const t = TRANSLATIONS[lang].benefits;

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <h2 className="text-[clamp(1.75rem,3vw,2.35rem)] font-extrabold tracking-[-0.02em] text-[#041427] text-balance mb-3">
            {t.title}
          </h2>
          <p className="text-[15px] leading-[1.65] text-[#475569]">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.items.map((item, idx) => {
            const Icon = ICONS[idx] ?? Globe;
            return (
              <div
                key={item.number}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(4,20,39,0.05)] hover:shadow-[0_10px_28px_rgba(4,20,39,0.09)] transition-shadow duration-200 p-7 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#f9e4c8] text-[#041427]">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[13px] font-bold tabular-nums text-[#94A3B8]">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-[20px] font-bold tracking-[-0.015em] text-[#041427] mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-[14px] sm:text-[15px] leading-[1.65] text-[#475569]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                  <p className="text-[13px] font-semibold text-[#0f2747]">{item.fact}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
