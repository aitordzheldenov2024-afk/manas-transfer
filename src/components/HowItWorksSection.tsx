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
      className="scroll-mt-20 py-20 sm:py-28 border-t border-[#9EC0F5]/[0.09] bg-[#080D18]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-[#F5F8FD] text-balance mb-3">
              {t.title}
            </h2>
            <p className="text-[15px] leading-[1.65] text-[#96AAC6]">{t.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onJumpToBooking}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#142038] hover:bg-[#C9AA6E] text-[#F2F6FC] hover:text-[#080D18] border border-[#9EC0F5]/[0.16] hover:border-transparent text-[13px] font-semibold transition-all duration-150 whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E]"
          >
            <span>{t.ctaBtn}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {t.steps.map((step, idx) => (
            <li key={step.number} className="relative flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-[14px] font-medium tabular-nums text-[#C9AA6E] shrink-0">
                  {step.number}
                </span>
                <div
                  aria-hidden="true"
                  className={`h-[1px] flex-1 ${
                    idx < t.steps.length - 1 ? 'bg-[#9EC0F5]/[0.18]' : 'bg-[#9EC0F5]/[0.09]'
                  }`}
                />
              </div>

              <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[#F5F8FD] mb-3">
                {step.title}
              </h3>

              <p className="text-[14px] sm:text-[15px] leading-[1.65] text-[#96AAC6]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
