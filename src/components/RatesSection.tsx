import { ArrowUpRight } from 'lucide-react';
import {
  DESTINATIONS,
  FLEET_VEHICLES,
  Language,
  TRANSLATIONS,
  calculateFare,
  formatKgs,
} from '../data/transferData';

interface RatesSectionProps {
  lang: Language;
  selectedDestinationId: string;
  onSelectDestination: (destinationId: string) => void;
}

const RATE_COLUMNS = ['economy', 'comfort-sedan', 'business-class', 'minivan', 'minibus', 'electric-hybrid'];

export function RatesSection({
  lang,
  selectedDestinationId,
  onSelectDestination,
}: RatesSectionProps) {
  const t = TRANSLATIONS[lang].routesSection;
  const som = TRANSLATIONS[lang].booking.som;
  const fixedDestinations = DESTINATIONS.filter((d) => d.id !== 'custom');
  const columnVehicles = RATE_COLUMNS.map(
    (id) => FLEET_VEHICLES.find((v) => v.id === id) ?? FLEET_VEHICLES[0]
  );

  return (
    <section
      id="routes"
      className="scroll-mt-20 py-16 sm:py-24 bg-[#FFFFFF] border-t border-[#E2E8F0]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10">
          <h2 className="text-[clamp(1.75rem,3vw,2.4rem)] font-extrabold tracking-[-0.02em] text-[#041427] text-balance mb-3">
            {t.title}
          </h2>
          <p className="text-[15px] leading-[1.65] text-[#475569]">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DCE4EE] shadow-[0_6px_28px_rgba(4,20,39,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="bg-[#041427] text-white text-[12px] font-semibold">
                  <th className="py-4 px-5">{t.routeCol}</th>
                  <th className="py-4 px-3 whitespace-nowrap text-[#CBD6E4]">{t.timeCol}</th>
                  {columnVehicles.map((vehicle) => (
                    <th key={vehicle.id} className="py-4 px-3 text-right whitespace-nowrap">
                      {vehicle.name[lang]}
                    </th>
                  ))}
                  <th className="py-4 pr-5 pl-3 text-right whitespace-nowrap" aria-label="Action" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EEF5]">
                {fixedDestinations.map((dest) => {
                  const isActive = dest.id === selectedDestinationId;
                  return (
                    <tr
                      key={dest.id}
                      onClick={() => onSelectDestination(dest.id)}
                      className={`group cursor-pointer transition-colors duration-150 ${
                        isActive ? 'bg-[#FFFBF4]' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <td className="py-4 px-5">
                        <div className="text-[14px] font-bold text-[#041427]">
                          {dest.label[lang]}
                        </div>
                        <div className="text-[12px] text-[#64748B] mt-0.5">
                          {dest.regionNote[lang]}
                        </div>
                      </td>
                      <td className="py-4 px-3 text-[12.5px] font-mono tabular-nums text-[#475569] whitespace-nowrap">
                        {dest.distanceKm} km · {dest.duration[lang]}
                      </td>
                      {columnVehicles.map((vehicle) => {
                        const { kgs, usd } = calculateFare(
                          vehicle.basePriceKgs,
                          vehicle.basePriceUsd,
                          dest
                        );
                        return (
                          <td
                            key={vehicle.id}
                            className="py-4 px-3 text-right font-mono tabular-nums whitespace-nowrap"
                          >
                            <div className="text-[14px] font-extrabold text-[#041427]">${usd}</div>
                            <div className="text-[11px] font-semibold text-[#475569]">
                              {formatKgs(kgs)} {som}
                            </div>
                          </td>
                        );
                      })}
                      <td className="py-4 pr-5 pl-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDestination(dest.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2747] hover:bg-[#041427] text-white text-[12px] font-semibold transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <span>{t.actionBtn}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#f9e4c8]" />
                        </button>
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
