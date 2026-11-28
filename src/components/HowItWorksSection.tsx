import { ArrowUpRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/transferData';

interface HowItWorksSectionProps {
  lang: Language;
  onJumpToBooking: () => void;
}

export function HowItWorksSection({ lang, onJumpToBooking }: HowItWorksSectionProps) {
  const t = TRANSLATIONS[lang].howItWorks;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 py-16 sm:py-24 bg-[#FFFFFF] border-t border-[#E2E8F0]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.75rem,3vw,2.35rem)] font-extrabold tracking-[-0.02em] text-[#041427] text-balance mb-3">
              {t.title}
            </h2>
            <p className="text-[15px] leading-[1.65] text-[#475569]">{t.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onJumpToBooking}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#c8a663] hover:bg-[#b5914d] text-[#041427] text-[13px] font-bold shadow-[0_6px_18px_rgba(200,166,99,0.3)] transition-colors duration-150 whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a663] focus-visible:ring-offset-2"
          >
            <span>{t.ctaBtn}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.steps.map((step) => (
            <li
              key={step.number}
              className="relative flex flex-col rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 sm:p-7"
            >
              <div className="flex items-center gap-3.5 mb-5">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#f9e4c8] text-[#041427] font-mono text-[13px] font-extrabold tabular-nums shrink-0">
                  {step.number}
                </span>
                <div aria-hidden="true" className="h-[1px] flex-1 bg-[#E2E8F0]" />
              </div>

              <h3 className="text-[18px] font-bold tracking-[-0.015em] text-[#041427] mb-2.5">
                {step.title}
              </h3>

              <p className="text-[14px] sm:text-[15px] leading-[1.65] text-[#475569]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
