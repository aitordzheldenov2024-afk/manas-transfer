import { useEffect, useState } from 'react';
import { Briefcase, CarFront, Check, Users } from 'lucide-react';
import {
  FLEET_VEHICLES,
  FleetFilterId,
  FleetVehicle,
  Language,
  TRANSLATIONS,
  formatKgs,
} from '../data/transferData';

interface FleetSectionProps {
  lang: Language;
  selectedVehicleId: string;
  onSelectVehicle: (vehicle: FleetVehicle) => void;
}

function VehiclePhoto({ vehicle }: { vehicle: FleetVehicle }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [vehicle.image]);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#131F36] text-[#8EA4C4] p-6">
        <CarFront className="w-10 h-10 text-[#C9AA6E]/75" />
        <span className="text-[14px] font-semibold text-[#EDF2FA]">{vehicle.name}</span>
      </div>
    );
  }

  return (
    <img
      src={vehicle.image}
      alt={vehicle.name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
    />
  );
}

export function FleetSection({ lang, selectedVehicleId, onSelectVehicle }: FleetSectionProps) {
  const t = TRANSLATIONS[lang].fleetSection;
  const som = TRANSLATIONS[lang].booking.som;
  const [activeFilter, setActiveFilter] = useState<FleetFilterId>('all');

  const filterTabs: { id: FleetFilterId; label: string }[] = [
    { id: 'all', label: t.filters.all },
    { id: 'economy', label: t.filters.economy },
    { id: 'comfort', label: t.filters.comfort },
    { id: 'electric', label: t.filters.electric },
    { id: 'premium', label: t.filters.premium },
    { id: 'business', label: t.filters.business },
    { id: 'minivan-bus', label: t.filters['minivan-bus'] },
  ];

  const visibleVehicles =
    activeFilter === 'all'
      ? FLEET_VEHICLES
      : FLEET_VEHICLES.filter((v) => v.filterTags.includes(activeFilter));

  return (
    <section
      id="fleet"
      className="scroll-mt-20 py-20 sm:py-28 border-t border-[#9EC0F5]/[0.09] bg-gradient-to-b from-[#080D18] to-[#0B1222]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="mb-10">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-[#F5F8FD] text-balance mb-3">
            {t.title}
          </h2>
          <p className="text-[15px] leading-[1.65] text-[#96AAC6] max-w-2xl mb-6">{t.subtitle}</p>

          {/* Interactive Class Filter Tabs */}
          <div
            role="tablist"
            aria-label={t.title}
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#0F192C] border border-[#9EC0F5]/[0.12]"
          >
            {filterTabs.map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E] ${
                    active
                      ? 'bg-[#E5EEFA] text-[#080D18] font-semibold'
                      : 'text-[#96AAC6] hover:text-[#F5F8FD]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Desktop Grid for 9 Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleVehicles.map((vehicle) => {
            const isSelected = vehicle.id === selectedVehicleId;

            return (
              <article
                key={vehicle.id}
                className={`group rounded-2xl overflow-hidden flex flex-col transition-all duration-200 glass-navy ${
                  isSelected
                    ? 'ring-1 ring-[#C9AA6E]/80 border-[#C9AA6E]/60'
                    : 'hover:border-[#9EC0F5]/[0.26]'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#131F36]">
                  <VehiclePhoto vehicle={vehicle} />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0E1627] via-[#0E1627]/30 to-transparent"
                  />
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="text-[12px] font-medium text-[#C9AA6E] mb-1.5">
                    {vehicle.classLabel[lang]}
                  </div>

                  <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[#F5F8FD] mb-2">
                    {vehicle.name}
                  </h3>

                  <p className="text-[13px] leading-[1.6] text-[#96AAC6] mb-4">
                    {vehicle.subtitle[lang]}
                  </p>

                  {/* Capacity & Amenities (unboxed text) */}
                  <div className="space-y-2 mb-5 text-[13px] text-[#C8D6EA]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#7D93B4]" />
                        <span className="font-mono tabular-nums">{vehicle.passengers}</span>{' '}
                        <span>{t.seatsUnit}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-[#7D93B4]" />
                        <span className="font-mono tabular-nums">{vehicle.luggage}</span>{' '}
                        <span>{t.bagsUnit}</span>
                      </span>
                    </div>
                    <p className="text-[12px] text-[#8398B8] leading-relaxed">
                      {vehicle.features[lang].join(' · ')}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-[#9EC0F5]/[0.1] flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] text-[#8398B8] mb-0.5">{t.routeHint}</span>
                      <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
                        <span className="text-[19px] font-semibold text-[#F5F8FD] whitespace-nowrap">
                          {vehicle.pricePrefix ? `${vehicle.pricePrefix[lang]} ` : ''}$
                          {vehicle.basePriceUsd}
                        </span>
                        <span className="text-[12px] text-[#C9AA6E] whitespace-nowrap">
                          ({formatKgs(vehicle.basePriceKgs)} {som})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectVehicle(vehicle)}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E] ${
                        isSelected
                          ? 'bg-[#C9AA6E] text-[#080D18]'
                          : 'bg-[#172540] hover:bg-[#E5EEFA] text-[#EDF2FA] hover:text-[#080D18] border border-[#9EC0F5]/[0.16] hover:border-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{isSelected ? t.chosenBtn : t.chooseBtn}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
