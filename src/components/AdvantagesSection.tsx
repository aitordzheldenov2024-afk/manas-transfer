import { Banknote, Globe, PlaneLanding, UserCheck } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/transferData';

interface AdvantagesSectionProps {
  lang: Language;
}

const ICONS = [Banknote, PlaneLanding, UserCheck, Globe] as const;

export function AdvantagesSection({ lang }: AdvantagesSectionProps) {
  const t = TRANSLATIONS[lang].benefits;

  return (
    <section className="py-20 sm:py-28 border-t border-[#9EC0F5]/[0.09] bg-gradient-to-b from-[#0B1222] to-[#080D18]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="max-w-xl mb-12">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-[#F5F8FD] text-balance mb-3">
            {t.title}
          </h2>
          <p className="text-[15px] leading-[1.65] text-[#96AAC6]">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.items.map((item, idx) => {
            const Icon = ICONS[idx] ?? Globe;
            return (
              <div
                key={item.number}
                className="glass-navy rounded-2xl p-7 sm:p-8 flex flex-col justify-between hover:border-[#9EC0F5]/[0.24] transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="font-mono text-[13px] tabular-nums text-[#C9AA6E]">
                      {item.number}
                    </span>
                    <Icon className="w-5 h-5 text-[#8EA4C4]" aria-hidden="true" />
                  </div>

                  <h3 className="text-[20px] font-semibold tracking-[-0.015em] text-[#F5F8FD] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-[14px] sm:text-[15px] leading-[1.65] text-[#96AAC6]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-7 pt-5 border-t border-[#9EC0F5]/[0.1]">
                  <p className="text-[13px] font-medium text-[#D6E1F2]">{item.fact}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
