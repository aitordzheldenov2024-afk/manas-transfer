import { useEffect, useRef, useState } from 'react';
import {
  BookingFormData,
  ConfirmedBooking,
  DESTINATIONS,
  FLEET_VEHICLES,
  FleetVehicle,
  Language,
  TRANSLATIONS,
  buildBookingMessage,
  calculateFare,
  resolveDropoffDisplayLabel,
} from './data/transferData';
import { validateInternationalPhone } from './utils/phoneValidation';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FleetSection } from './components/FleetSection';
import { RatesSection } from './components/RatesSection';
import { AdvantagesSection } from './components/AdvantagesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Footer } from './components/Footer';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';

function getDefaultDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [formData, setFormData] = useState<BookingFormData>(() => ({
    destinationId: 'bishkek',
    dropoffText: DESTINATIONS[0].label.en,
    hotelAddress: '',
    isReversed: false,
    vehicleId: 'economy',
    date: getDefaultDate(),
    time: '14:30',
    flightNumber: '',
    meetWithSign: true,
    childSeatCount: 0,
    passengerName: '',
    contact: '',
  }));

  const [vehicleHighlighted, setVehicleHighlighted] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === 'ru'
        ? 'Манас Трансфер — Трансфер из аэропорта Манас (BSZ) в Бишкек и по Кыргызстану'
        : 'Manas Transfer — Executive Airport Transfers from Manas (BSZ) Across Kyrgyzstan';

    // Translate dropoffText only if it exactly matches a preset label in the other language
    setFormData((prev) => {
      const matched = DESTINATIONS.find(
        (d) => d.id !== 'custom' && (d.label.en === prev.dropoffText || d.label.ru === prev.dropoffText)
      );
      if (matched && matched.label[lang] !== prev.dropoffText) {
        return { ...prev, dropoffText: matched.label[lang] };
      }
      return prev;
    });
  }, [lang]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  const handleUpdateForm = (patch: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const scrollToBookingForm = () => {
    const el = document.getElementById('booking-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectVehicleCard = (vehicle: FleetVehicle) => {
    setFormData((prev) => ({
      ...prev,
      vehicleId: vehicle.id,
    }));
  };

  const handleSelectVehicleFromFleet = (vehicle: FleetVehicle) => {
    setFormData((prev) => ({
      ...prev,
      vehicleId: vehicle.id,
    }));
    setVehicleHighlighted(true);
    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
    }
    highlightTimerRef.current = window.setTimeout(() => {
      setVehicleHighlighted(false);
    }, 2600);
    scrollToBookingForm();
  };

  const handleSelectDestinationFromRoutes = (destinationId: string) => {
    const dest = DESTINATIONS.find((d) => d.id === destinationId);
    setFormData((prev) => ({
      ...prev,
      destinationId,
      dropoffText: dest ? dest.label[lang] : prev.dropoffText,
      isReversed: false,
    }));
    scrollToBookingForm();
  };

  const handleSubmitBooking = () => {
    if (!validateInternationalPhone(formData.contact)) {
      return;
    }

    const vehicle =
      FLEET_VEHICLES.find((v) => v.id === formData.vehicleId) ?? FLEET_VEHICLES[0];
    const destination =
      DESTINATIONS.find((dest) => dest.id === formData.destinationId) ?? DESTINATIONS[0];
    const { kgs, usd } = calculateFare(
      vehicle.basePriceKgs,
      vehicle.basePriceUsd,
      destination,
      formData.childSeatCount
    );

    const airportText = TRANSLATIONS[lang].booking.airportName;
    const hotel = formData.hotelAddress.trim();
    const destText = resolveDropoffDisplayLabel(formData, lang);

    const randomDigits = Math.floor(100 + Math.random() * 900);
    const reference = `MT-${formData.date.slice(5).replace('-', '')}-${randomDigits}`;

    setConfirmedBooking({
      reference,
      fromLabel: formData.isReversed ? destText : airportText,
      toLabel: formData.isReversed ? airportText : destText,
      hotelAddress: hotel,
      date: formData.date,
      time: formData.time,
      flightNumber: formData.flightNumber.trim(),
      vehicle,
      meetWithSign: formData.meetWithSign,
      childSeatCount: formData.childSeatCount,
      priceKgs: kgs,
      priceUsd: usd,
      passengerName: formData.passengerName.trim(),
      contact: formData.contact.trim(),
    });
  };

  const bookingMessage = buildBookingMessage(formData, lang);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#041427]">
      <Header lang={lang} onChangeLang={setLang} bookingMessage={bookingMessage} />

      <main>
        <HeroSection
          lang={lang}
          formData={formData}
          vehicleHighlighted={vehicleHighlighted}
          onUpdateForm={handleUpdateForm}
          onSelectVehicleCard={handleSelectVehicleCard}
          onSubmitBooking={handleSubmitBooking}
        />

        <FleetSection
          lang={lang}
          selectedVehicleId={formData.vehicleId}
          onSelectVehicle={handleSelectVehicleFromFleet}
        />

        <RatesSection
          lang={lang}
          selectedDestinationId={formData.destinationId}
          onSelectDestination={handleSelectDestinationFromRoutes}
        />

        <AdvantagesSection lang={lang} />

        <HowItWorksSection lang={lang} onJumpToBooking={scrollToBookingForm} />
      </main>

      <Footer lang={lang} bookingMessage={bookingMessage} />

      <BookingConfirmationModal
        lang={lang}
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />
    </div>
  );
}
