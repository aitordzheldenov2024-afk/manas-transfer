import { FormEvent, useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  Calendar,
  CarFront,
  Check,
  Clock,
  Minus,
  Phone,
  Plane,
  Plus,
  User,
} from 'lucide-react';
import {
  BISHKEK_LANDMARKS,
  BookingFormData,
  CHILD_SEAT_PRICE_KGS,
  DESTINATIONS,
  FLEET_VEHICLES,
  FleetVehicle,
  HERO_IMAGE,
  Language,
  MAX_CHILD_SEATS,
  TRANSLATIONS,
  calculateFare,
  formatKgs,
  inferDestinationIdFromText,
} from '../data/transferData';
import {
  AddressAutocompleteInput,
  PresetDestinationOption,
} from './AddressAutocompleteInput';
import {
  sanitizePhoneInput,
  validateInternationalPhone,
} from '../utils/phoneValidation';

interface HeroSectionProps {
  lang: Language;
  formData: BookingFormData;
  vehicleHighlighted: boolean;
  onUpdateForm: (patch: Partial<BookingFormData>) => void;
  onSelectVehicleCard: (vehicle: FleetVehicle) => void;
  onSubmitBooking: () => void;
}

function CompactVehicleThumb({ vehicle, lang }: { vehicle: FleetVehicle; lang: Language }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [vehicle.image]);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F1F5F9] text-[#0f2747]">
        <CarFront className="w-5 h-5" />
      </div>
    );
  }

  return (
    <img
      src={vehicle.image}
      alt={vehicle.name[lang]}
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
  onSelectVehicleCard,
  onSubmitBooking,
}: HeroSectionProps) {
  const t = TRANSLATIONS[lang];
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<'passengerName' | 'contact' | 'date' | 'dropoffText' | 'hotelAddress', string>>
  >({});

  const selectedVehicle =
    FLEET_VEHICLES.find((v) => v.id === formData.vehicleId) ?? FLEET_VEHICLES[0];
  const selectedDestination =
    DESTINATIONS.find((dest) => dest.id === formData.destinationId) ?? DESTINATIONS[0];
  const total = calculateFare(
    selectedVehicle.basePriceKgs,
    selectedVehicle.basePriceUsd,
    selectedDestination,
    formData.childSeatCount
  );

  const presetOptions: PresetDestinationOption[] = DESTINATIONS.filter(
    (dest) => dest.id !== 'custom'
  ).map((dest) => ({
    id: dest.id,
    label: dest.label[lang],
    subtitle: dest.regionNote[lang],
    meta: dest.duration[lang],
  }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<
      Record<'passengerName' | 'contact' | 'date' | 'dropoffText' | 'hotelAddress', string>
    > = {};

    if (!formData.date) {
      nextErrors.date = t.booking.errors.dateRequired;
    }
    if (formData.dropoffText.trim().length < 2) {
      nextErrors.dropoffText = t.booking.errors.dropoffRequired;
    }
    if (formData.passengerName.trim().length < 2) {
      nextErrors.passengerName = t.booking.errors.nameRequired;
    }
    if (!validateInternationalPhone(formData.contact)) {
      nextErrors.contact = t.booking.errors.phoneInvalid;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmitBooking();
    }
  };

  const clearError = (
    field: 'passengerName' | 'contact' | 'date' | 'dropoffText' | 'hotelAddress'
  ) => {
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const destinationCombobox = (
    <div>
      <AddressAutocompleteInput
        id="booking-dropoff"
        ariaLabel={formData.isReversed ? t.booking.fromLabel : t.booking.toLabel}
        value={formData.dropoffText}
        placeholder={t.booking.dropoffPlaceholder}
        icon="pin"
        lang={lang}
        error={Boolean(errors.dropoffText)}
        presets={presetOptions}
        selectedPresetId={formData.destinationId}
        presetsHeading={t.booking.popularDestinationsHeading}
        landmarks={BISHKEK_LANDMARKS}
        landmarksHeading={t.booking.landmarksHeading}
        suggestionsHeading={t.booking.liveSuggestionsHeading}
        searchingLabel={t.booking.searchingAddresses}
        clearAriaLabel={t.booking.clearFieldAria}
        onChangeText={(text) => {
          onUpdateForm({
            dropoffText: text,
            destinationId: inferDestinationIdFromText(text),
          });
          clearError('dropoffText');
        }}
        onSelectPreset={(preset) => {
          onUpdateForm({
            destinationId: preset.id,
            dropoffText: preset.label,
          });
          clearError('dropoffText');
        }}
        onSelectLandmark={(landmark, formattedAddress) => {
          onUpdateForm({
            destinationId: landmark.destinationId,
            dropoffText: formattedAddress,
          });
          clearError('dropoffText');
        }}
        onSelectSuggestion={(formattedAddress, props) => {
          const inferenceSource = [formattedAddress, props.city, props.state]
            .filter(Boolean)
            .join(' ');
          onUpdateForm({
            dropoffText: formattedAddress,
            destinationId: inferDestinationIdFromText(inferenceSource),
          });
          clearError('dropoffText');
        }}
      />
      {errors.dropoffText && (
        <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-rose-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errors.dropoffText}</span>
        </p>
      )}
    </div>
  );

  const airportReadonly = (
    <div className="w-full bg-[#F8FAFC] border border-[#DCE4EE] rounded-xl px-3.5 py-2.5 text-[14px] font-semibold text-[#041427] flex items-center gap-2.5">
      <Plane className="w-4 h-4 text-[#c8a663] shrink-0" />
      <span className="truncate">{t.booking.airportName}</span>
    </div>
  );

  return (
    <section id="top" className="relative pt-24 sm:pt-28 pb-14 sm:pb-20 bg-[#F8FAFC]">
      {/* Deep Executive Navy (#041427 / #0f2747) Backdrop with Atmospheric Airport Image */}
      <div className="absolute inset-x-0 top-0 h-[560px] sm:h-[600px] overflow-hidden bg-[#041427]">
        {!heroImgFailed ? (
          <img
            src={HERO_IMAGE}
            alt="Manas International Airport (BSZ) at twilight with ascending aircraft and illuminated highway"
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            className="w-full h-full object-cover object-center opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#041427] via-[#0f2747] to-[#041427]" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#041427]/85 via-[#0f2747]/72 to-[#041427]/95"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent"
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Executive Navy Hero Copy */}
        <div className="max-w-3xl pt-4 sm:pt-7 pb-8 sm:pb-10 text-white">
          <p className="text-[13px] font-semibold text-[#f9e4c8] mb-3 tracking-[0.03em]">
            {t.hero.kicker}
          </p>
          <h1 className="text-[clamp(2rem,4vw,3.35rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white text-balance mb-4">
            {t.hero.title}
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-[1.65] text-[#D7E2F0] max-w-2xl mb-5">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] font-medium text-[#E5ECF6]">
            {t.hero.highlights.map((item, idx) => (
              <span key={item} className="inline-flex items-center gap-3">
                {idx > 0 && (
                  <span aria-hidden="true" className="text-[#c8a663]">
                    ·
                  </span>
                )}
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Crisp Pure-White Booking Form Card */}
        <div
          id="booking-form"
          className="scroll-mt-24 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_24px_64px_rgba(4,20,39,0.14)] p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E8EEF5]">
            <h2 className="text-[17px] sm:text-[18px] font-bold text-[#041427] tracking-[-0.01em]">
              {t.booking.formHeading}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-mono tabular-nums text-[#475569]">
                {selectedDestination.distanceKm} km · {selectedDestination.duration[lang]}
              </span>
              <a
                href="#routes"
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#0f2747] hover:bg-[#041427] text-white text-[12px] font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                {t.booking.viewRoutesBtn}
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Row 1: Pickup / Swap / Drop-off + Hotel / Destination Address */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_1.15fr] gap-3 items-start">
              <div>
                <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                  A · {t.booking.fromLabel}
                </label>
                {formData.isReversed ? destinationCombobox : airportReadonly}
              </div>

              <div className="flex lg:pt-[22px] lg:justify-center">
                <button
                  type="button"
                  onClick={() => onUpdateForm({ isReversed: !formData.isReversed })}
                  aria-label={t.booking.swapAria}
                  title={t.booking.swapAria}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#0f2747] hover:bg-[#041427] text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a663]"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                  B · {t.booking.toLabel}
                </label>
                {formData.isReversed ? airportReadonly : destinationCombobox}
              </div>

              <div>
                <label
                  htmlFor="booking-hotel"
                  className="block text-[12px] font-semibold text-[#334155] mb-1.5"
                >
                  {t.booking.hotelLabel}
                </label>
                <AddressAutocompleteInput
                  id="booking-hotel"
                  value={formData.hotelAddress}
                  placeholder={t.booking.hotelPlaceholder}
                  icon="hotel"
                  lang={lang}
                  error={Boolean(errors.hotelAddress)}
                  landmarks={BISHKEK_LANDMARKS}
                  landmarksHeading={t.booking.landmarksHeading}
                  suggestionsHeading={t.booking.liveSuggestionsHeading}
                  searchingLabel={t.booking.searchingAddresses}
                  clearAriaLabel={t.booking.clearFieldAria}
                  onChangeText={(text) => {
                    onUpdateForm({ hotelAddress: text });
                    clearError('hotelAddress');
                  }}
                  onSelectLandmark={(_landmark, formattedAddress) => {
                    onUpdateForm({ hotelAddress: formattedAddress });
                    clearError('hotelAddress');
                  }}
                  onSelectSuggestion={(formattedAddress) => {
                    onUpdateForm({ hotelAddress: formattedAddress });
                    clearError('hotelAddress');
                  }}
                />
                {errors.hotelAddress && (
                  <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-rose-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.hotelAddress}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Compact One-Click 8-Class Selector (Exact Group Order) */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-[14px] font-bold text-[#041427]">
                    {t.booking.selectTariffTitle}
                  </span>
                  <span className="text-[13px] text-[#475569]">
                    {t.booking.selectedCarBadge}:{' '}
                    <strong className="font-bold text-[#041427]">
                      {selectedVehicle.name[lang]}
                    </strong>
                  </span>
                  {vehicleHighlighted && (
                    <span className="text-[12px] font-semibold text-[#9A7432]">
                      {t.booking.tariffUpdatedHint}
                    </span>
                  )}
                </div>
              </div>

              <div
                role="radiogroup"
                aria-label={t.booking.selectTariffTitle}
                className="grid grid-cols-2 md:grid-cols-4 gap-2.5"
              >
                {FLEET_VEHICLES.map((vehicle) => {
                  const isSelected = vehicle.id === formData.vehicleId;
                  const price = calculateFare(
                    vehicle.basePriceKgs,
                    vehicle.basePriceUsd,
                    selectedDestination,
                    formData.childSeatCount
                  );

                  return (
                    <button
                      key={vehicle.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelectVehicleCard(vehicle)}
                      className={`group text-left rounded-xl p-2.5 transition-all duration-150 cursor-pointer flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a663] ${
                        isSelected
                          ? 'bg-[#FFFBF4] border-2 border-[#041427] shadow-sm'
                          : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] border-2 border-[#E2E8F0]/80 hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#EEF2F6] mb-2">
                        <CompactVehicleThumb vehicle={vehicle} lang={lang} />
                      </div>

                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[13px] font-bold text-[#041427] truncate">
                          {vehicle.name[lang]}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#c8a663] text-[#041427] shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-[#64748B] truncate mb-1.5">
                        {vehicle.capacityLine[lang]}
                      </span>

                      <div className="mt-auto pt-1.5 border-t border-[#E2E8F0] flex items-baseline justify-between gap-1 font-mono tabular-nums">
                        <span className="text-[14px] font-extrabold text-[#041427] whitespace-nowrap">
                          ${price.usd}
                        </span>
                        <span className="text-[11px] font-semibold text-[#475569] whitespace-nowrap">
                          {formatKgs(price.kgs)} {t.booking.som}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Quick Option Toggles */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                aria-pressed={formData.meetWithSign}
                onClick={() => onUpdateForm({ meetWithSign: !formData.meetWithSign })}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap border ${
                  formData.meetWithSign
                    ? 'bg-[#0f2747] border-[#0f2747] text-white'
                    : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155] hover:border-[#0f2747]'
                }`}
              >
                {formData.meetWithSign && <Check className="w-3.5 h-3.5 text-[#c8a663]" />}
                <span>
                  {t.booking.optionSign} · {t.booking.optionFree}
                </span>
              </button>

              <div
                className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap border ${
                  formData.childSeatCount > 0
                    ? 'bg-[#0f2747] border-[#0f2747] text-white'
                    : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155]'
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    onUpdateForm({
                      childSeatCount: formData.childSeatCount === 0 ? 1 : formData.childSeatCount,
                    })
                  }
                  className="inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {formData.childSeatCount > 0 && (
                    <Check className="w-3.5 h-3.5 text-[#c8a663]" />
                  )}
                  <span>
                    {t.booking.optionChildSeat} · +
                    {formatKgs(
                      (formData.childSeatCount > 0 ? formData.childSeatCount : 1) *
                        CHILD_SEAT_PRICE_KGS
                    )}{' '}
                    {t.booking.som}
                  </span>
                </button>

                <div
                  className={`inline-flex items-center gap-1 rounded-md p-0.5 ${
                    formData.childSeatCount > 0 ? 'bg-white/10' : 'bg-white border border-[#CBD5E1]'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={t.booking.childSeatDecreaseAria}
                    disabled={formData.childSeatCount <= 0}
                    onClick={() =>
                      onUpdateForm({
                        childSeatCount: Math.max(0, formData.childSeatCount - 1),
                      })
                    }
                    className={`inline-flex items-center justify-center w-6 h-6 rounded transition-colors ${
                      formData.childSeatCount <= 0
                        ? 'opacity-35 cursor-not-allowed'
                        : formData.childSeatCount > 0
                        ? 'hover:bg-white/15 text-white cursor-pointer'
                        : 'hover:bg-[#F1F5F9] text-[#041427] cursor-pointer'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span
                    aria-live="polite"
                    className={`min-w-[1.25rem] text-center font-mono text-[13px] font-bold tabular-nums ${
                      formData.childSeatCount > 0 ? 'text-[#f9e4c8]' : 'text-[#041427]'
                    }`}
                  >
                    {formData.childSeatCount}
                  </span>

                  <button
                    type="button"
                    aria-label={t.booking.childSeatIncreaseAria}
                    disabled={formData.childSeatCount >= MAX_CHILD_SEATS}
                    onClick={() =>
                      onUpdateForm({
                        childSeatCount: Math.min(MAX_CHILD_SEATS, formData.childSeatCount + 1),
                      })
                    }
                    className={`inline-flex items-center justify-center w-6 h-6 rounded transition-colors ${
                      formData.childSeatCount >= MAX_CHILD_SEATS
                        ? 'opacity-35 cursor-not-allowed'
                        : formData.childSeatCount > 0
                        ? 'hover:bg-white/15 text-white cursor-pointer'
                        : 'hover:bg-[#F1F5F9] text-[#041427] cursor-pointer'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Row 4: Date, Time, Flight Number, Passenger & Contact */}
            <div className="pt-4 border-t border-[#E8EEF5] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-start">
              <div>
                <label
                  htmlFor="booking-date"
                  className="block text-[12px] font-semibold text-[#334155] mb-1.5"
                >
                  {t.booking.dateLabel}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      onUpdateForm({ date: e.target.value });
                      clearError('date');
                    }}
                    className={`w-full bg-[#F8FAFC] focus:bg-white border rounded-xl pl-10 pr-3 py-2.5 text-[14px] font-mono tabular-nums text-[#041427] outline-none transition-colors ${
                      errors.date ? 'border-rose-500' : 'border-[#CBD5E1] focus:border-[#0f2747]'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-rose-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.date}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-time"
                  className="block text-[12px] font-semibold text-[#334155] mb-1.5"
                >
                  {t.booking.timeLabel}
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => onUpdateForm({ time: e.target.value })}
                    className="w-full bg-[#F8FAFC] focus:bg-white border border-[#CBD5E1] focus:border-[#0f2747] rounded-xl pl-10 pr-3 py-2.5 text-[14px] font-mono tabular-nums text-[#041427] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-flight"
                  className="block text-[12px] font-semibold text-[#334155] mb-1.5"
                >
                  {t.booking.flightLabel}
                </label>
                <div className="relative">
                  <Plane className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-flight"
                    type="text"
                    value={formData.flightNumber}
                    onChange={(e) => onUpdateForm({ flightNumber: e.target.value.toUpperCase() })}
                    placeholder={t.booking.flightPlaceholder}
                    className="w-full bg-[#F8FAFC] focus:bg-white border border-[#CBD5E1] focus:border-[#0f2747] rounded-xl pl-10 pr-3 py-2.5 text-[14px] font-mono text-[#041427] placeholder:font-sans placeholder:text-[#94A3B8] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-name"
                  className="block text-[12px] font-semibold text-[#334155] mb-1.5"
                >
                  {t.booking.nameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="booking-name"
                    type="text"
                    value={formData.passengerName}
                    onChange={(e) => {
                      onUpdateForm({ passengerName: e.target.value });
                      clearError('passengerName');
                    }}
                    placeholder={t.booking.namePlaceholder}
                    className={`w-full bg-[#F8FAFC] focus:bg-white border rounded-xl pl-10 pr-3 py-2.5 text-[14px] text-[#041427] placeholder:text-[#94A3B8] outline-none transition-colors ${
                      errors.passengerName
                        ? 'border-rose-500'
                        : 'border-[#CBD5E1] focus:border-[#0f2747]'
                    }`}
                  />
                </div>
                {errors.passengerName && (
                  <p className="mt-1 flex items-center gap-1 text-[12px] font-medium text-rose-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.passengerName}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-contact"
                  className="block text-[12px] font-semibold text-[#334155] mb-1.5"
                >
                  {t.booking.contactLabel}
                </label>
                <div className="relative">
                  <Phone
                    className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      errors.contact ? 'text-rose-500' : 'text-[#64748B]'
                    }`}
                  />
                  <input
                    id="booking-contact"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={formData.contact}
                    onChange={(e) => {
                      const nextPhone = sanitizePhoneInput(e.target.value);
                      onUpdateForm({ contact: nextPhone });
                      if (errors.contact && validateInternationalPhone(nextPhone)) {
                        clearError('contact');
                      }
                    }}
                    onBlur={() => {
                      if (formData.contact.trim() && !validateInternationalPhone(formData.contact)) {
                        setErrors((prev) => ({
                          ...prev,
                          contact: t.booking.errors.phoneInvalid,
                        }));
                      }
                    }}
                    placeholder={t.booking.contactPlaceholder}
                    aria-invalid={Boolean(errors.contact)}
                    className={`w-full border rounded-xl pl-10 pr-3 py-2.5 text-[14px] font-mono tabular-nums text-[#041427] placeholder:font-sans placeholder:text-[#94A3B8] outline-none transition-colors ${
                      errors.contact
                        ? 'border-rose-500 bg-rose-50/40 focus:bg-white focus:border-rose-600'
                        : 'bg-[#F8FAFC] focus:bg-white border-[#CBD5E1] focus:border-[#0f2747]'
                    }`}
                  />
                </div>
                {errors.contact && (
                  <p
                    role="alert"
                    className="mt-1 flex items-start gap-1 text-[12px] font-medium text-rose-600 leading-snug"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{errors.contact}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Summary & Primary Warm Gold Submit CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
              <p className="text-[13px] text-[#475569]">{t.booking.paymentNote}</p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                <div className="sm:text-right">
                  <span className="block text-[11px] font-semibold text-[#64748B]">
                    {t.booking.totalLabel}
                  </span>
                  <div className="flex items-baseline sm:justify-end gap-2 font-mono tabular-nums">
                    <span className="text-[22px] font-extrabold text-[#041427] whitespace-nowrap">
                      {formData.destinationId === 'custom'
                        ? `${lang === 'ru' ? 'от ' : 'from '}`
                        : ''}
                      ${total.usd}
                    </span>
                    <span className="text-[14px] font-bold text-[#0f2747] whitespace-nowrap">
                      / {formatKgs(total.kgs)} {t.booking.som}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#c8a663] hover:bg-[#b5914d] active:scale-[0.99] text-[#041427] text-[15px] font-bold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#041427] focus-visible:ring-offset-2"
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
