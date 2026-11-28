import { useEffect, useState } from 'react';
import { CarFront, Check, ChevronDown, ChevronUp } from 'lucide-react';
import {
  FLEET_GROUPS,
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

function VehiclePhoto({ vehicle, lang }: { vehicle: FleetVehicle; lang: Language }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [vehicle.image]);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#F1F5F9] text-[#475569] p-6">
        <CarFront className="w-10 h-10 text-[#0f2747]/65" />
        <span className="text-[14px] font-bold text-[#041427]">{vehicle.name[lang]}</span>
      </div>
    );
  }

  return (
    <img
      src={vehicle.image}
      alt={`${vehicle.name[lang]} — ${vehicle.models}`}
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
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const filterTabs: { id: FleetFilterId; label: string }[] = [
    { id: 'all', label: t.filters.all },
    { id: 'petrol', label: t.filters.petrol },
    { id: 'minivan-bus', label: t.filters['minivan-bus'] },
    { id: 'electric', label: t.filters.electric },
  ];

  const visibleGroups =
    activeFilter === 'all'
      ? FLEET_GROUPS
      : FLEET_GROUPS.filter((group) => group.id === activeFilter);

  const toggleDetails = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="fleet"
      className="scroll-mt-20 py-16 sm:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section Header & Group Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.85rem,3vw,2.5rem)] font-extrabold tracking-[-0.02em] text-[#041427] text-balance mb-3">
              {t.title}
            </h2>
            <p className="text-[15px] leading-[1.65] text-[#475569]">{t.subtitle}</p>
          </div>

          <div
            role="tablist"
            aria-label={t.title}
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white border border-[#DCE4EE] shadow-xs self-start lg:self-auto"
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
                  className={`px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a663] ${
                    active
                      ? 'bg-[#041427] text-white'
                      : 'text-[#475569] hover:text-[#041427] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Strictly Ordered 3 Fleet Groups: 1) Petrol Sedans -> 2) Minivans & Buses -> 3) Electric */}
        <div className="space-y-14">
          {visibleGroups.map((group, groupIndex) => {
            const vehiclesInGroup = FLEET_VEHICLES.filter((v) => v.groupId === group.id);
            const gridColsClass =
              vehiclesInGroup.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

            return (
              <div key={group.id}>
                {/* Group Heading */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 mb-6 border-b border-[#DCE4EE]">
                  <div>
                    <h3 className="text-[20px] sm:text-[22px] font-extrabold tracking-[-0.015em] text-[#041427]">
                      0{groupIndex + 1}. {group.title[lang]}
                    </h3>
                    <p className="text-[14px] text-[#64748B] mt-1">{group.subtitle[lang]}</p>
                  </div>
                </div>

                {/* Strictly Pure White (#FFFFFF) Cards with Soft Shadow */}
                <div className={`grid ${gridColsClass} gap-6`}>
                  {vehiclesInGroup.map((vehicle) => {
                    const isSelected = vehicle.id === selectedVehicleId;
                    const isExpanded = expandedCardId === vehicle.id;

                    return (
                      <article
                        key={vehicle.id}
                        className={`group bg-[#FFFFFF] rounded-2xl overflow-hidden flex flex-col transition-all duration-200 shadow-[0_4px_24px_rgba(4,20,39,0.06)] hover:shadow-[0_12px_32px_rgba(4,20,39,0.11)] ${
                          isSelected
                            ? 'border-2 border-[#c8a663] ring-1 ring-[#c8a663]/35'
                            : 'border border-[#E2E8F0]'
                        }`}
                      >
                        {/* 4:3 Clean Studio Photo */}
                        <div className="aspect-[4/3] w-full overflow-hidden bg-[#F1F5F9]">
                          <VehiclePhoto vehicle={vehicle} lang={lang} />
                        </div>

                        {/* Card Body */}
                        <div className="p-5 sm:p-6 flex flex-col flex-1">
                          {/* Soft Gold Badge (#f9e4c8) + Capacity */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-[#f9e4c8] text-[#041427] text-[11px] font-bold tracking-[0.01em] whitespace-nowrap">
                              {vehicle.badge[lang]}
                            </span>
                            <span className="text-[12px] font-semibold text-[#475569] font-mono tabular-nums whitespace-nowrap">
                              {vehicle.capacityLine[lang]}
                            </span>
                          </div>

                          <h4 className="text-[20px] font-extrabold tracking-[-0.015em] text-[#041427] mb-1">
                            {vehicle.name[lang]}
                          </h4>

                          <p className="text-[13px] font-semibold text-[#0f2747] mb-2.5">
                            {vehicle.models}
                          </p>

                          <p className="text-[13.5px] leading-[1.6] text-[#475569] mb-4">
                            {vehicle.description[lang]}
                          </p>

                          {/* Expandable Details Drawer */}
                          {isExpanded && (
                            <div className="mb-4 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#0f2747] mb-2">
                                {t.includedHeading}
                              </p>
                              <ul className="space-y-1.5 text-[12.5px] text-[#334155]">
                                {vehicle.features[lang].map((feat) => (
                                  <li key={feat} className="flex items-start gap-2">
                                    <Check className="w-3.5 h-3.5 text-[#c8a663] mt-0.5 shrink-0 stroke-[2.5]" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Price & Action Footer */}
                          <div className="mt-auto pt-4 border-t border-[#EDF2F7] space-y-4">
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="text-[12px] font-medium text-[#64748B]">
                                {t.routeHint}
                              </span>
                              <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
                                <span className="text-[22px] font-extrabold text-[#041427] whitespace-nowrap">
                                  ${vehicle.basePriceUsd}
                                </span>
                                <span className="text-[13px] font-bold text-[#041427]/80 whitespace-nowrap">
                                  / {formatKgs(vehicle.basePriceKgs)} {som}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-[auto_1fr] gap-2.5">
                              {/* Secondary Dark Navy (#0f2747) Details Button */}
                              <button
                                type="button"
                                onClick={() => toggleDetails(vehicle.id)}
                                aria-expanded={isExpanded}
                                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#0f2747] hover:bg-[#041427] text-white text-[13px] font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a663]"
                              >
                                <span>{isExpanded ? t.hideDetailsBtn : t.detailsBtn}</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Primary Warm Gold (#c8a663) Book Now Button */}
                              <button
                                type="button"
                                onClick={() => onSelectVehicle(vehicle)}
                                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-bold transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#041427] ${
                                  isSelected
                                    ? 'bg-[#041427] text-[#f9e4c8]'
                                    : 'bg-[#c8a663] hover:bg-[#b5914d] text-[#041427]'
                                }`}
                              >
                                {isSelected && <Check className="w-4 h-4 text-[#c8a663]" />}
                                <span>{isSelected ? t.selectedBtn : t.bookNowBtn}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
