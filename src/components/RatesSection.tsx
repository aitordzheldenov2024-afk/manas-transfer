import { ArrowUpRight } from 'lucide-react';
import {
  DESTINATIONS,
  Language,
  TARIFFS,
  TRANSLATIONS,
  calculateFare,
  formatKgs,
} from '../data/transferData';

interface RatesSectionProps {
  lang: Language;
  selectedDestinationId: string;
  onSelectDestination: (destinationId: string) => void;
}

export function RatesSection({
  lang,
  selectedDestinationId,
  onSelectDestination,
}: RatesSectionProps) {
  const t = TRANSLATIONS[lang].routesSection;
  const som = TRANSLATIONS[lang].booking.som;
  const fixedDestinations = DESTINATIONS.filter((d) => d.id !== 'custom');

  return (
    <section
      id="routes"
      className="scroll-mt-20 py-20 sm:py-24 border-t border-[#9EC0F5]/[0.09] bg-[#0B1222]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.75rem,3vw,2.35rem)] font-semibold tracking-[-0.02em] text-[#F5F8FD] text-balance mb-3">
              {t.title}
            </h2>
            <p className="text-[15px] leading-[1.65] text-[#96AAC6]">{t.subtitle}</p>
          </div>
          <p className="text-[13px] text-[#7D93B4] whitespace-nowrap shrink-0">{t.clickHint}</p>
        </div>

        <div className="rounded-2xl glass-navy overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[880px]">
              <thead>
                <tr className="border-b border-[#9EC0F5]/[0.12] bg-[#101B30]/75 text-[12px] font-medium text-[#8EA4C4]">
                  <th className="py-4 px-5 font-medium">{t.routeCol}</th>
                  <th className="py-4 px-3 font-medium whitespace-nowrap">{t.timeCol}</th>
                  {TARIFFS.map((tariff) => (
                    <th
                      key={tariff.id}
                      className="py-4 px-3 font-medium text-right whitespace-nowrap text-[#E6EFFB]"
                    >
                      {tariff.name[lang]}
                    </th>
                  ))}
                  <th className="py-4 pr-5 pl-2 w-10" aria-hidden="true" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#9EC0F5]/[0.08]">
                {fixedDestinations.map((dest) => {
                  const isActive = dest.id === selectedDestinationId;
                  return (
                    <tr
                      key={dest.id}
                      onClick={() => onSelectDestination(dest.id)}
                      className={`group cursor-pointer transition-colors duration-150 ${
                        isActive ? 'bg-[#C9AA6E]/[0.1]' : 'hover:bg-[#172540]/60'
                      }`}
                    >
                      <td className="py-4 px-5">
                        <span className="text-[14px] font-medium text-[#F2F6FC] group-hover:text-[#C9AA6E] transition-colors">
                          {dest.label[lang]}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-[12px] font-mono tabular-nums text-[#8398B8] whitespace-nowrap">
                        {dest.distanceKm} km · {dest.duration[lang]}
                      </td>
                      {TARIFFS.map((tariff) => {
                        const { kgs, usd } = calculateFare(
                          tariff.basePriceKgs,
                          tariff.basePriceUsd,
                          dest
                        );
                        return (
                          <td
                            key={tariff.id}
                            className="py-4 px-3 text-right font-mono tabular-nums whitespace-nowrap"
                          >
                            <div className="text-[14px] font-semibold text-[#F2F6FC]">${usd}</div>
                            <div className="text-[11px] text-[#C9AA6E]/90">
                              {formatKgs(kgs)} {som}
                            </div>
                          </td>
                        );
                      })}
                      <td className="py-4 pr-5 pl-2 text-right">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#7D93B4] group-hover:text-[#C9AA6E] group-hover:bg-[#9EC0F5]/10 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
