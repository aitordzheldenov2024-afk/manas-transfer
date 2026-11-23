import { FormEvent, useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  Briefcase,
  Calendar,
  CarFront,
  Check,
  Clock,
  MapPin,
  Phone,
  Plane,
  User,
  Users,
} from 'lucide-react';
import {
  BookingFormData,
  CHILD_SEAT_PRICE_KGS,
  DESTINATIONS,
  FLEET_VEHICLES,
  HERO_IMAGE,
  Language,
  TARIFFS,
  TRANSLATIONS,
  TariffOption,
  calculateFare,
  formatKgs,
} from '../data/transferData';

interface HeroSectionProps {
  lang: Language;
  formData: BookingFormData;
  vehicleHighlighted: boolean;
  onUpdateForm: (patch: Partial<BookingFormData>) => void;
  onSelectTariffCard: (tariff: TariffOption) => void;
  onSubmitBooking: () => void;
}

function TariffThumb({ tariff, lang }: { tariff: TariffOption; lang: Language }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [tariff.image]);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#142038] text-[#8EA4C4]">
        <CarFront className="w-6 h-6" />
      </div>
    );
  }

  return (
    <img
      src={tariff.image}
      alt={tariff.name[lang]}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover object-center"
    />
  );
}

export function HeroSection({
  lang,
  formData,
  vehicleHighlighted,
  onUpdateForm,
  onSelectTariffCard,
  onSubmitBooking,
}: HeroSectionProps) {
  const t = TRANSLATIONS[lang];
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<'passengerName' | 'contact' | 'date' | 'customAddress', string>>
  >({});

  const selectedVehicle =
    FLEET_VEHICLES.find((v) => v.id === formData.vehicleId) ?? FLEET_VEHICLES[0];
  const selectedDestination =
    DESTINATIONS.find((dest) => dest.id === formData.destinationId) ?? DESTINATIONS[0];
  const total = calculateFare(
    selectedVehicle.basePriceKgs,
    selectedVehicle.basePriceUsd,
    selectedDestination,
    formData.childSeat
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<
      Record<'passengerName' | 'contact' | 'date' | 'customAddress', string>
    > = {};

    if (!formData.date) {
      nextErrors.date = t.booking.errors.dateRequired;
    }
    if (formData.destinationId === 'custom' && formData.customAddress.trim().length < 3) {
      nextErrors.customAddress = t.booking.errors.customAddressRequired;
    }
    if (formData.passengerName.trim().length < 2) {
      nextErrors.passengerName = t.booking.errors.nameRequired;
    }
    if (formData.contact.trim().length < 5) {
      nextErrors.contact = t.booking.errors.contactRequired;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmitBooking();
    }
  };

  const clearError = (field: 'passengerName' | 'contact' | 'date' | 'customAddress') => {
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const destinationSelect = (
    <select
      aria-label={formData.isReversed ? t.booking.fromLabel : t.booking.toLabel}
      value={formData.destinationId}
      onChange={(e) => {
        onUpdateForm({ destinationId: e.target.value });
        clearError('customAddress');
      }}
      className="w-full bg-[#111C31] hover:bg-[#162440] border border-[#9EC0F5]/[0.16] focus:border-[#C9AA6E] rounded-xl px-3.5 py-2.5 text-[14px] text-[#F2F6FC] outline-none transition-colors cursor-pointer"
    >
      {DESTINATIONS.map((dest) => (
        <option key={dest.id} value={dest.id} className="bg-[#0D1628] text-[#F2F6FC]">
          {dest.label[lang]}
        </option>
      ))}
    </select>
  );

  const airportReadonly = (
    <div className="w-full bg-[#111C31]/85 border border-[#9EC0F5]/[0.14] rounded-xl px-3.5 py-2.5 text-[14px] text-[#EDF2FA] flex items-center gap-2.5">
      <Plane className="w-4 h-4 text-[#C9AA6E] shrink-0" />
      <span className="truncate">{t.booking.airportName}</span>
    </div>
  );

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col justify-end pt-24 pb-16 sm:pb-20 overflow-hidden"
    >
      {/* Full-Bleed Atmospheric Twilight Manas Airport Backdrop */}
      <div className="absolute inset-0 -z-10 bg-[#080D18]">
        {!heroImgFailed ? (
          <img
            src={HERO_IMAGE}
            alt="Manas International Airport at twilight with ascending aircraft and illuminated highway"
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            className="w-full h-full object-cover object-center scale-[1.01]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#101C34] via-[#0B1325] to-[#080D18]" />
        )}
        {/* Deep midnight-blue readability scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#070C17]/75 via-[#091224]/55 to-[#080D18]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#070C17]/88 via-[#0A1326]/45 to-[#080D18]/30"
        />
      </div>

      <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-8 pt-6 sm:pt-12">
        {/* Hero Headline & Value Proposition */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <p className="text-[13px] font-medium tracking-[0.06em] text-[#C9AA6E] mb-3.5">
            {t.hero.kicker}
          </p>
          <h1 className="text-[clamp(2.1rem,4.1vw,3.55rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-[#F5F8FD] text-balance mb-4">
            {t.hero.title}
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-[1.65] text-[#C2D0E4] max-w-2xl mb-5">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-[#96AAC6]">
            {t.hero.highlights.map((item, idx) => (
              <span key={item} className="inline-flex items-center gap-3">
                {idx > 0 && (
                  <span aria-hidden="true" className="text-[#9EC0F5]/30">
                    ·
                  </span>
                )}
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Midnight-Blue Glassmorphic Interactive Booking Panel */}
        <div
          id="booking-form"
          className="scroll-mt-24 glass-navy-panel rounded-2xl p-5 sm:p-7 shadow-[0_28px_90px_rgba(3,7,18,0.72)]"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Step 1: Route (From -> To) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <div>
                <label className="block text-[12px] font-medium text-[#96AAC6] mb-1.5">
                  A · {t.booking.fromLabel}
                </label>
                {formData.isReversed ? destinationSelect : airportReadonly}
              </div>

              <div className="flex lg:justify-center">
                <button
                  type="button"
                  onClick={() => onUpdateForm({ isReversed: !formData.isReversed })}
                  aria-label={t.booking.swapAria}
                  title={t.booking.swapAria}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#142038] hover:bg-[#1B2B4B] border border-[#9EC0F5]/[0.16] text-[#D5E1F2] hover:text-[#C9AA6E] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E]"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#96AAC6] mb-1.5">
                  B · {t.booking.toLabel}
                </label>
                {formData.isReversed ? airportReadonly : destinationSelect}
              </div>
            </div>

            {formData.destinationId === 'custom' && (
              <div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8297B5] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.customAddress}
                    onChange={(e) => {
                      onUpdateForm({ customAddress: e.target.value });
                      clearError('customAddress');
                    }}
                    placeholder={t.booking.customAddressPlaceholder}
                    className={`w-full bg-[#111C31] border rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-[#F2F6FC] placeholder:text-[#667B99] outline-none transition-colors ${
                      errors.customAddress
                        ? 'border-rose-400/75'
                        : 'border-[#9EC0F5]/[0.16] focus:border-[#C9AA6E]'
                    }`}
                  />
                </div>
                {errors.customAddress && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.customAddress}</span>
                  </p>
                )}
              </div>
            )}

            {/* Step 2: 6 Clickable Tariff Cards (Midnight-Blue Glass) */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-[14px] font-semibold text-[#F2F6FC]">
                    {t.booking.selectTariffTitle}
                  </span>
                  <span className="text-[13px] text-[#8EA4C4]">
                    {t.booking.selectedCarBadge}:{' '}
                    <strong className="font-semibold text-[#EDF2FA]">{selectedVehicle.name}</strong>
                  </span>
                  {vehicleHighlighted && (
                    <span className="text-[12px] font-medium text-[#C9AA6E]">
                      {t.booking.tariffUpdatedHint}
                    </span>
                  )}
                </div>
                <span className="text-[13px] font-mono tabular-nums text-[#8EA4C4]">
                  {selectedDestination.distanceKm} km · {selectedDestination.duration[lang]}
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label={t.booking.selectTariffTitle}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                {TARIFFS.map((tariff) => {
                  const isSelected = tariff.id === formData.tariffId;
                  const activeBaseKgs = isSelected
                    ? selectedVehicle.basePriceKgs
                    : tariff.basePriceKgs;
                  const activeBaseUsd = isSelected
                    ? selectedVehicle.basePriceUsd
                    : tariff.basePriceUsd;
                  const price = calculateFare(
                    activeBaseKgs,
                    activeBaseUsd,
                    selectedDestination,
                    formData.childSeat
                  );

                  return (
                    <button
                      key={tariff.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelectTariffCard(tariff)}
                      className={`group text-left rounded-xl p-3 transition-all duration-150 cursor-pointer flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E] ${
                        isSelected
                          ? 'bg-[#172642] border border-[#C9AA6E] ring-1 ring-[#C9AA6E]/45 shadow-lg shadow-black/30'
                          : 'bg-[#101B30]/80 hover:bg-[#162440] border border-[#9EC0F5]/[0.12] hover:border-[#9EC0F5]/[0.26]'
                      }`}
                    >
                      <div className="w-24 sm:w-28 aspect-[4/3] rounded-lg overflow-hidden bg-[#18253E] shrink-0 relative">
                        <TariffThumb tariff={tariff} lang={lang} />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[#0D1628]/30 via-transparent to-transparent"
                        />
                      </div>

                      <div className="min-w-0 flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-1.5 mb-0.5">
                          <span className="text-[14px] font-semibold text-[#F5F8FD] truncate">
                            {tariff.name[lang]}
                          </span>
                          {isSelected && (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C9AA6E] text-[#080D18] shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <p className="text-[12px] text-[#8EA4C4] truncate mb-1.5">
                          {tariff.modelsSummary[lang]}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-[#7D93B4] mb-2">
                          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                            <Users className="w-3 h-3" />
                            {tariff.passengersLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                            <Briefcase className="w-3 h-3" />
                            {tariff.luggageLabel}
                          </span>
                        </div>

                        <div className="pt-1.5 border-t border-[#9EC0F5]/[0.1] flex items-baseline justify-between gap-2 font-mono tabular-nums">
                          <span className="text-[15px] font-semibold text-[#F5F8FD] whitespace-nowrap">
                            ${price.usd}
                          </span>
                          <span className="text-[12px] text-[#C9AA6E] whitespace-nowrap">
                            {formatKgs(price.kgs)} {t.booking.som}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Quick Option Toggles */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                aria-pressed={formData.meetWithSign}
                onClick={() => onUpdateForm({ meetWithSign: !formData.meetWithSign })}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap border ${
                  formData.meetWithSign
                    ? 'bg-[#192A48] border-[#C9AA6E]/70 text-[#F5F8FD]'
                    : 'bg-[#101B30] border-[#9EC0F5]/[0.14] text-[#9EB2CE] hover:text-[#F5F8FD]'
                }`}
              >
                {formData.meetWithSign && <Check className="w-3.5 h-3.5 text-[#C9AA6E]" />}
                <span>
                  {t.booking.optionSign} · {t.booking.optionFree}
                </span>
              </button>

              <button
                type="button"
                aria-pressed={formData.childSeat}
                onClick={() => onUpdateForm({ childSeat: !formData.childSeat })}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap border ${
                  formData.childSeat
                    ? 'bg-[#192A48] border-[#C9AA6E]/70 text-[#F5F8FD]'
                    : 'bg-[#101B30] border-[#9EC0F5]/[0.14] text-[#9EB2CE] hover:text-[#F5F8FD]'
                }`}
              >
                {formData.childSeat && <Check className="w-3.5 h-3.5 text-[#C9AA6E]" />}
                <span>
                  {t.booking.optionChildSeat} · +{CHILD_SEAT_PRICE_KGS} {t.booking.som}
                </span>
              </button>
            </div>

            {/* Step 4: Date, Time, Flight, Passenger & Contact */}
            <div className="pt-4 border-t border-[#9EC0F5]/[0.1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-start">
              <div>
                <label htmlFor="booking-date" className="block text-[12px] font-medium text-[#96AAC6] mb-1.5">
                  {t.booking.dateLabel}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#7D93B4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      onUpdateForm({ date: e.target.value });
                      clearError('date');
                    }}
                    className={`w-full bg-[#111C31] border rounded-xl pl-10 pr-3 py-2.5 text-[14px] font-mono tabular-nums text-[#F2F6FC] outline-none transition-colors ${
                      errors.date
                        ? 'border-rose-400/75'
                        : 'border-[#9EC0F5]/[0.16] focus:border-[#C9AA6E]'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 flex items-center gap-1 text-[12px] text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.date}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="booking-time" className="block text-[12px] font-medium text-[#96AAC6] mb-1.5">
                  {t.booking.timeLabel}
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#7D93B4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => onUpdateForm({ time: e.target.value })}
                    className="w-full bg-[#111C31] border border-[#9EC0F5]/[0.16] focus:border-[#C9AA6E] rounded-xl pl-10 pr-3 py-2.5 text-[14px] font-mono tabular-nums text-[#F2F6FC] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="booking-flight" className="block text-[12px] font-medium text-[#96AAC6] mb-1.5">
                  {t.booking.flightLabel}
                </label>
                <div className="relative">
                  <Plane className="w-4 h-4 text-[#7D93B4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-flight"
                    type="text"
                    value={formData.flightNumber}
                    onChange={(e) => onUpdateForm({ flightNumber: e.target.value.toUpperCase() })}
                    placeholder={t.booking.flightPlaceholder}
                    className="w-full bg-[#111C31] border border-[#9EC0F5]/[0.16] focus:border-[#C9AA6E] rounded-xl pl-10 pr-3 py-2.5 text-[14px] font-mono text-[#F2F6FC] placeholder:font-sans placeholder:text-[#667B99] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="booking-name" className="block text-[12px] font-medium text-[#96AAC6] mb-1.5">
                  {t.booking.nameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7D93B4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-name"
                    type="text"
                    value={formData.passengerName}
                    onChange={(e) => {
                      onUpdateForm({ passengerName: e.target.value });
                      clearError('passengerName');
                    }}
                    placeholder={t.booking.namePlaceholder}
                    className={`w-full bg-[#111C31] border rounded-xl pl-10 pr-3 py-2.5 text-[14px] text-[#F2F6FC] placeholder:text-[#667B99] outline-none transition-colors ${
                      errors.passengerName
                        ? 'border-rose-400/75'
                        : 'border-[#9EC0F5]/[0.16] focus:border-[#C9AA6E]'
                    }`}
                  />
                </div>
                {errors.passengerName && (
                  <p className="mt-1 flex items-center gap-1 text-[12px] text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.passengerName}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="booking-contact" className="block text-[12px] font-medium text-[#96AAC6] mb-1.5">
                  {t.booking.contactLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7D93B4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-contact"
                    type="text"
                    value={formData.contact}
                    onChange={(e) => {
                      onUpdateForm({ contact: e.target.value });
                      clearError('contact');
                    }}
                    placeholder={t.booking.contactPlaceholder}
                    className={`w-full bg-[#111C31] border rounded-xl pl-10 pr-3 py-2.5 text-[14px] text-[#F2F6FC] placeholder:text-[#667B99] outline-none transition-colors ${
                      errors.contact
                        ? 'border-rose-400/75'
                        : 'border-[#9EC0F5]/[0.16] focus:border-[#C9AA6E]'
                    }`}
                  />
                </div>
                {errors.contact && (
                  <p className="mt-1 flex items-center gap-1 text-[12px] text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.contact}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Summary & Primary Submit CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
              <p className="text-[13px] text-[#8EA4C4]">{t.booking.paymentNote}</p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                <div className="sm:text-right">
                  <span className="block text-[11px] font-medium text-[#8EA4C4]">
                    {t.booking.totalLabel}
                  </span>
                  <div className="flex items-baseline sm:justify-end gap-2 font-mono tabular-nums">
                    <span className="text-[21px] font-semibold text-[#F5F8FD] whitespace-nowrap">
                      {formData.destinationId === 'custom'
                        ? `${lang === 'ru' ? 'от ' : 'from '}`
                        : ''}
                      ${total.usd}
                    </span>
                    <span className="text-[13px] text-[#C9AA6E] whitespace-nowrap">
                      / {formatKgs(total.kgs)} {t.booking.som}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#C9AA6E] hover:bg-[#D8BC83] active:scale-[0.99] text-[#080D18] text-[14px] font-bold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C992] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080D18]"
                >
                  <span>{t.booking.submitBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
