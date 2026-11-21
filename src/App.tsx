import { useEffect, useRef, useState } from 'react';
import {
  BookingFormData,
  ConfirmedBooking,
  DESTINATIONS,
  FLEET_VEHICLES,
  FleetVehicle,
  Language,
  TARIFFS,
  TRANSLATIONS,
  TariffOption,
  calculateFare,
} from './data/transferData';
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
    destinationId: 'bishkek-hotel',
    customAddress: '',
    isReversed: false,
    tariffId: 'economy',
    vehicleId: 'hyundai-solaris',
    date: getDefaultDate(),
    time: '14:30',
    flightNumber: '',
    meetWithSign: true,
    childSeat: false,
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
        ? 'Манас Трансфер — Трансфер из аэропорта Манас (FRU) в Бишкек и на Иссык-Куль'
        : 'Manas Transfer — Airport Transfer from Manas (FRU) to Bishkek & Issyk-Kul';
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

  const handleSelectTariffCard = (tariff: TariffOption) => {
    setFormData((prev) => ({
      ...prev,
      tariffId: tariff.id,
      vehicleId: tariff.defaultVehicleId,
    }));
  };

  const handleSelectVehicleFromFleet = (vehicle: FleetVehicle) => {
    setFormData((prev) => ({
      ...prev,
      tariffId: vehicle.tariffId,
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
    setFormData((prev) => ({ ...prev, destinationId, isReversed: false }));
    scrollToBookingForm();
  };

  const handleSubmitBooking = () => {
    const vehicle =
      FLEET_VEHICLES.find((v) => v.id === formData.vehicleId) ?? FLEET_VEHICLES[0];
    const tariff =
      TARIFFS.find((item) => item.id === formData.tariffId) ?? TARIFFS[0];
    const destination =
      DESTINATIONS.find((dest) => dest.id === formData.destinationId) ?? DESTINATIONS[0];
    const { kgs, usd } = calculateFare(
      vehicle.basePriceKgs,
      vehicle.basePriceUsd,
      destination,
      formData.childSeat
    );

    const airportText = TRANSLATIONS[lang].booking.airportName;
    const destText =
      formData.destinationId === 'custom' && formData.customAddress.trim()
        ? formData.customAddress.trim()
        : destination.shortLabel[lang];

    const randomDigits = Math.floor(100 + Math.random() * 900);
    const reference = `MT-${formData.date.slice(5).replace('-', '')}-${randomDigits}`;

    setConfirmedBooking({
      reference,
      fromLabel: formData.isReversed ? destText : airportText,
      toLabel: formData.isReversed ? airportText : destText,
      date: formData.date,
      time: formData.time,
      flightNumber: formData.flightNumber.trim(),
      tariff,
      vehicle,
      meetWithSign: formData.meetWithSign,
      childSeat: formData.childSeat,
      priceKgs: kgs,
      priceUsd: usd,
      passengerName: formData.passengerName.trim(),
      contact: formData.contact.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-[#080D18] text-[#EDF2FA]">
      <Header lang={lang} onChangeLang={setLang} />

      <main>
        <HeroSection
          lang={lang}
          formData={formData}
          vehicleHighlighted={vehicleHighlighted}
          onUpdateForm={handleUpdateForm}
          onSelectTariffCard={handleSelectTariffCard}
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

      <Footer lang={lang} />

      <BookingConfirmationModal
        lang={lang}
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />
    </div>
  );
}
