import heroAirportImg from '../assets/images/hero_manas_airport_night_1795273722657.jpg';
import economySedanImg from '../assets/images/tariff_economy_sedan_1795273722419.jpg';
import comfortSedanImg from '../assets/images/tariff_comfort_sedan_1795273724368.jpg';
import businessSedanImg from '../assets/images/car_mercedes_eclass_light_1795274961194.jpg';
import minivanImg from '../assets/images/tariff_minivan_family_1795273725551.jpg';
import minibusImg from '../assets/images/car_sprinter_bus_light_1795274961853.jpg';
import coachYutongImg from '../assets/images/car_yutong_coach_light_1795871899882.jpg';
import electricHybridImg from '../assets/images/tariff_electric_ev_1795273724251.jpg';
import businessElectricImg from '../assets/images/car_zeekr_001_light_1795274962325.jpg';

export type Language = 'en' | 'ru';

export type FleetGroupId = 'petrol' | 'minivan-bus' | 'electric';
export type FleetFilterId = 'all' | FleetGroupId;

export interface FleetVehicle {
  id: string;
  order: number;
  groupId: FleetGroupId;
  name: Record<Language, string>;
  badge: Record<Language, string>;
  models: string;
  capacityLine: Record<Language, string>;
  passengersLabel: string;
  luggageLabel: string;
  description: Record<Language, string>;
  features: Record<Language, string[]>;
  basePriceUsd: number;
  basePriceKgs: number;
  image: string;
}

export interface Destination {
  id: string;
  label: Record<Language, string>;
  shortLabel: Record<Language, string>;
  regionNote: Record<Language, string>;
  distanceKm: number;
  duration: Record<Language, string>;
  multiplier: number;
}

export interface BookingFormData {
  destinationId: string;
  hotelAddress: string;
  isReversed: boolean;
  vehicleId: string;
  date: string;
  time: string;
  flightNumber: string;
  meetWithSign: boolean;
  childSeat: boolean;
  passengerName: string;
  contact: string;
}

export interface ConfirmedBooking {
  reference: string;
  fromLabel: string;
  toLabel: string;
  hotelAddress: string;
  date: string;
  time: string;
  flightNumber: string;
  vehicle: FleetVehicle;
  meetWithSign: boolean;
  childSeat: boolean;
  priceKgs: number;
  priceUsd: number;
  passengerName: string;
  contact: string;
}

export const HERO_IMAGE = heroAirportImg;

export const CHILD_SEAT_PRICE_KGS = 300;
export const CHILD_SEAT_PRICE_USD = 3;

export const CONTACT_INFO = {
  phoneDisplay: '+996 770 44 33 05',
  phoneHref: 'tel:+996770443305',
  whatsappNumber: '996770443305',
  telegramHandle: 'HOPEAT',
  whatsappDefaultText:
    'Hello! I would like to book a transfer from Manas Airport (BSZ). Please send me the payment link/QR to confirm.',
  email: 'info@manastransfer.kg',
};

export const FLEET_GROUPS: {
  id: FleetGroupId;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
}[] = [
  {
    id: 'petrol',
    title: {
      en: 'Petrol Sedans',
      ru: 'Бензиновые седаны',
    },
    subtitle: {
      en: 'Reliable everyday, comfort, and executive sedans for city transfers and intercity highways.',
      ru: 'Надёжные седаны базового, стандартного и представительского класса для города и междугородних поездок.',
    },
  },
  {
    id: 'minivan-bus',
    title: {
      en: 'Minivans & Buses',
      ru: 'Минивэны и автобусы',
    },
    subtitle: {
      en: 'Spacious transport for families, ski equipment, corporate groups, and large tourist delegations.',
      ru: 'Просторный транспорт для семей, туристических групп, горнолыжного снаряжения и крупных делегаций.',
    },
  },
  {
    id: 'electric',
    title: {
      en: 'Electric Vehicles',
      ru: 'Электромобили',
    },
    subtitle: {
      en: 'Whisper-quiet modern electric and hybrid-EV vehicles with smooth suspension and zero tailpipe emissions.',
      ru: 'Современные бесшумные электромобили и гибриды с мягким ходом и нулевыми выбросами.',
    },
  },
];

export const FLEET_VEHICLES: FleetVehicle[] = [
  // Group 1 — Petrol Sedans
  {
    id: 'economy',
    order: 1,
    groupId: 'petrol',
    name: { en: 'Economy', ru: 'Эконом' },
    badge: { en: 'Essential', ru: 'Базовый класс' },
    models: 'KIA Rio, Hyundai Solaris',
    capacityLine: { en: '1–3 pax • 2–3 bags', ru: '1–3 пасс. • 2–3 багажа' },
    passengersLabel: '1–3',
    luggageLabel: '2–3',
    description: {
      en: 'Clean, air-conditioned petrol sedan for a straightforward, affordable airport transfer directly to your hotel.',
      ru: 'Чистый бензиновый седан с кондиционером для быстрой и доступной поездки из аэропорта до отеля.',
    },
    features: {
      en: ['Air conditioning', 'USB phone charger', '60 min free airport waiting', 'Fixed all-inclusive fare'],
      ru: ['Кондиционер', 'Зарядка USB', '60 мин бесплатного ожидания', 'Фиксированная цена без доплат'],
    },
    basePriceUsd: 34,
    basePriceKgs: 3000,
    image: economySedanImg,
  },
  {
    id: 'comfort-sedan',
    order: 2,
    groupId: 'petrol',
    name: { en: 'Comfort Sedan', ru: 'Комфорт Седан' },
    badge: { en: 'Standard', ru: 'Standard' },
    models: 'Toyota Corolla, Hyundai Sonata, Kia K5',
    capacityLine: { en: '1–3 pax • 2–3 bags', ru: '1–3 пасс. • 2–3 багажа' },
    passengersLabel: '1–3',
    luggageLabel: '2–3',
    description: {
      en: 'Generous legroom, quiet cabin, and a full-size trunk ideal for Bishkek city stays or long-distance Kyrgyzstan routes.',
      ru: 'Просторный салон, мягкая подвеска и вместительный багажник для поездок по Бишкеку и на Иссык-Куль.',
    },
    features: {
      en: ['Dual-zone climate control', 'Complimentary bottled water', 'USB-C fast charging', 'Terminal meet & greet'],
      ru: ['Двухзонный климат-контроль', 'Вода в салоне', 'Зарядка Type-C', 'Встреча с табличкой в зале прилёта'],
    },
    basePriceUsd: 40,
    basePriceKgs: 3500,
    image: comfortSedanImg,
  },
  {
    id: 'business-class',
    order: 3,
    groupId: 'petrol',
    name: { en: 'Business Class', ru: 'Бизнес-класс' },
    badge: { en: 'Executive / VIP', ru: 'Executive / VIP' },
    models: 'Toyota Camry, KIA K7, Hyundai Grandeur',
    capacityLine: { en: '1–3 pax • 2–3 bags', ru: '1–3 пасс. • 2–3 багажа' },
    passengersLabel: '1–3',
    luggageLabel: '2–3',
    description: {
      en: 'Full-size executive petrol sedans with plush leather seating, enhanced soundproofing, and uniformed English-speaking chauffeur.',
      ru: 'Представительские седаны с кожаным салоном, усиленной шумоизоляцией и водителем в деловом стиле.',
    },
    features: {
      en: ['Leather executive cabin', 'In-car Wi-Fi & water', 'USB-C fast charging', 'Priority curbside pickup'],
      ru: ['Кожаный салон бизнес-класса', 'Wi-Fi и вода', 'Быстрая зарядка Type-C', 'Приоритетная подача к выходу'],
    },
    basePriceUsd: 55,
    basePriceKgs: 4800,
    image: businessSedanImg,
  },

  // Group 2 — Minivans & Buses
  {
    id: 'minivan',
    order: 4,
    groupId: 'minivan-bus',
    name: { en: 'Minivan', ru: 'Минивэн' },
    badge: { en: 'Family & Small Group', ru: 'Family & Small Group' },
    models: 'KIA Carnival, Hyundai Staria, Honda Odyssey, Toyota Sienna',
    capacityLine: { en: '4–5 pax • 4–5 bags', ru: '4–5 пасс. • 4–5 багажа' },
    passengersLabel: '4–5',
    luggageLabel: '4–5',
    description: {
      en: 'Wide sliding doors, individual rear seating, and generous luggage capacity for families, trekkers, and mountain gear.',
      ru: 'Широкие сдвижные двери, удобная посадка и просторный багажник для семей и путешественников со снаряжением.',
    },
    features: {
      en: ['Multi-zone rear A/C', 'Space for bulky suitcases & skis', 'USB charging every row', 'Child seat available on request'],
      ru: ['Климат-контроль по рядам', 'Место для крупных чемоданов и лыж', 'Зарядки USB у каждого ряда', 'Детское кресло по запросу'],
    },
    basePriceUsd: 65,
    basePriceKgs: 5700,
    image: minivanImg,
  },
  {
    id: 'minibus',
    order: 5,
    groupId: 'minivan-bus',
    name: { en: 'Minibus', ru: 'Микроавтобус' },
    badge: { en: 'Group Shuttle', ru: 'Group Shuttle' },
    models: 'Mercedes-Benz Sprinter',
    capacityLine: { en: '6–12 pax • 6–12 bags', ru: '6–12 пасс. • 6–12 багажа' },
    passengersLabel: '6–12',
    luggageLabel: '6–12',
    description: {
      en: 'High-roof Mercedes-Benz Sprinter configured for touring groups, corporate teams, and direct resort transfers to Karakol or Bokonbaevo.',
      ru: 'Высокий Mercedes-Benz Sprinter для туристических групп, корпоративных команд и поездок в Каракол или Боконбаево.',
    },
    features: {
      en: ['High-roof standing cabin', 'Dedicated rear luggage bay', 'Reclining passenger seats', 'Group airport reception'],
      ru: ['Высокий просторный салон', 'Отдельный багажный отсек', 'Откидные сиденья', 'Встреча всей группы в терминале'],
    },
    basePriceUsd: 93,
    basePriceKgs: 8100,
    image: minibusImg,
  },
  {
    id: 'coach',
    order: 6,
    groupId: 'minivan-bus',
    name: { en: 'Coach', ru: 'Туристический автобус' },
    badge: { en: 'Large Delegation / Tourist group', ru: 'Large Delegation / Tourist group' },
    models: 'Yutong',
    capacityLine: { en: '15–50 pax • 15+ bags', ru: '15–50 пасс. • 15+ багажа' },
    passengersLabel: '15–50',
    luggageLabel: '15+',
    description: {
      en: 'Full-size 12-meter Yutong tourist coach with under-floor luggage compartments, PA microphone, and climate control for delegations.',
      ru: 'Полноразмерный 12-метровый туристический автобус Yutong с вместительным багажником и микрофоном гида для делегаций.',
    },
    features: {
      en: ['Under-floor luggage compartments', 'Tour guide PA microphone', 'Overhead A/C & reading lights', 'Licensed highway coach driver'],
      ru: ['Нижние багажные отсеки', 'Микрофон для гида', 'Индивидуальный обдув и свет', 'Опытный водитель категории D'],
    },
    basePriceUsd: 160,
    basePriceKgs: 14000,
    image: coachYutongImg,
  },

  // Group 3 — Electric (at the very end)
  {
    id: 'electric-hybrid',
    order: 7,
    groupId: 'electric',
    name: { en: 'Electric / Hybrid', ru: 'Электро / Гибрид' },
    badge: { en: 'Zero-Emission / Quiet Ride', ru: 'Zero-Emission / Quiet Ride' },
    models: 'GAC Aion, BYD, Changan Q05',
    capacityLine: { en: '1–3 pax • 2–3 bags', ru: '1–3 пасс. • 2–3 багажа' },
    passengersLabel: '1–3',
    luggageLabel: '2–3',
    description: {
      en: 'Modern zero-emission electric and plug-in hybrid sedans delivering a serene, vibration-free drive into Bishkek.',
      ru: 'Современные электромобили и гибриды с бесшумным плавным ходом и заботой об экологии.',
    },
    features: {
      en: ['Whisper-quiet electric drive', 'Wi-Fi & bottled water', 'Fast USB-C ports', 'Pre-conditioned cabin climate'],
      ru: ['Бесшумный электропривод', 'Wi-Fi и бутилированная вода', 'Быстрые порты Type-C', 'Комфортная температура до посадки'],
    },
    basePriceUsd: 34,
    basePriceKgs: 3000,
    image: electricHybridImg,
  },
  {
    id: 'business-electric',
    order: 8,
    groupId: 'electric',
    name: { en: 'Business Electric', ru: 'Бизнес Электро' },
    badge: { en: 'Executive EV', ru: 'Executive EV' },
    models: 'Zeekr 001, Li Auto L7 / L9',
    capacityLine: { en: '1–3 pax • 2–3 bags', ru: '1–3 пасс. • 2–3 багажа' },
    passengersLabel: '1–3',
    luggageLabel: '2–3',
    description: {
      en: 'Flagship next-generation luxury EVs featuring air suspension, panoramic glass roof, massage seats, and acoustic glazing.',
      ru: 'Флагманские электромобили нового поколения с пневмоподвеской, панорамной крышей и массажем сидений.',
    },
    features: {
      en: ['Air suspension & acoustic glass', 'Massage & ventilated seats', 'High-speed Wi-Fi & 65W USB-C', 'Bottled water & meet with sign'],
      ru: ['Пневмоподвеска и двойные стёкла', 'Массаж и вентиляция сидений', 'Wi-Fi и зарядка Type-C 65W', 'Вода и встреча с табличкой'],
    },
    basePriceUsd: 65,
    basePriceKgs: 5700,
    image: businessElectricImg,
  },
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'bishkek',
    label: {
      en: 'Bishkek (City Center & Hotels)',
      ru: 'Бишкек (Центр и отели)',
    },
    shortLabel: {
      en: 'Bishkek',
      ru: 'Бишкек',
    },
    regionNote: {
      en: 'Chuy Valley · Capital City',
      ru: 'Чуйская долина · Столица',
    },
    distanceKm: 32,
    duration: { en: '35–40 min', ru: '35–40 мин' },
    multiplier: 1,
  },
  {
    id: 'bishkek-south',
    label: {
      en: 'Bishkek (South District / Asanbay)',
      ru: 'Бишкек (Южные мкр. / Асанбай)',
    },
    shortLabel: {
      en: 'Bishkek South',
      ru: 'Бишкек (Юг)',
    },
    regionNote: {
      en: 'Southern Foothills',
      ru: 'Южная часть города',
    },
    distanceKm: 39,
    duration: { en: '45 min', ru: '45 мин' },
    multiplier: 1.12,
  },
  {
    id: 'ala-archa',
    label: {
      en: 'Ala-Archa National Park',
      ru: 'Природный парк Ала-Арча',
    },
    shortLabel: {
      en: 'Ala-Archa National Park',
      ru: 'Ала-Арча',
    },
    regionNote: {
      en: 'Tian Shan Alpine Gorge',
      ru: 'Ущелье Тянь-Шаня',
    },
    distanceKm: 68,
    duration: { en: '1h 20m', ru: '1 ч 20 мин' },
    multiplier: 1.75,
  },
  {
    id: 'issyk-kul',
    label: {
      en: 'Issyk-Kul (Cholpon-Ata / Tamchy)',
      ru: 'Иссык-Куль (Чолпон-Ата / Тамчы)',
    },
    shortLabel: {
      en: 'Issyk-Kul (Cholpon-Ata)',
      ru: 'Иссык-Куль (Чолпон-Ата)',
    },
    regionNote: {
      en: 'North Shore Resort Zone',
      ru: 'Северный берег Иссык-Куля',
    },
    distanceKm: 280,
    duration: { en: '3h 50m', ru: '3 ч 50 мин' },
    multiplier: 4.0,
  },
  {
    id: 'bokonbaevo',
    label: {
      en: 'Bokonbaevo (South Shore Issyk-Kul)',
      ru: 'Боконбаево (Южный берег Иссык-Куля)',
    },
    shortLabel: {
      en: 'Bokonbaevo',
      ru: 'Боконбаево',
    },
    regionNote: {
      en: 'Yurt Camps & Skazka Canyon',
      ru: 'Южный берег · Каньон Сказка',
    },
    distanceKm: 315,
    duration: { en: '4h 20m', ru: '4 ч 20 мин' },
    multiplier: 4.5,
  },
  {
    id: 'karakol',
    label: {
      en: 'Karakol (City / Ski Resort)',
      ru: 'Каракол (Город / горнолыжная база)',
    },
    shortLabel: {
      en: 'Karakol',
      ru: 'Каракол',
    },
    regionNote: {
      en: 'Eastern Issyk-Kul & Trekking Hub',
      ru: 'Восточный Иссык-Куль и горы',
    },
    distanceKm: 425,
    duration: { en: '5h 40m', ru: '5 ч 40 мин' },
    multiplier: 5.5,
  },
  {
    id: 'custom',
    label: {
      en: 'Other Destination in Kyrgyzstan',
      ru: 'Другое направление по Кыргызстану',
    },
    shortLabel: {
      en: 'Custom Destination',
      ru: 'Индивидуальный маршрут',
    },
    regionNote: {
      en: 'Nationwide Door-to-Door',
      ru: 'По всему Кыргызстану',
    },
    distanceKm: 35,
    duration: { en: 'By route', ru: 'По маршруту' },
    multiplier: 1,
  },
];

export function calculateFare(
  baseKgs: number,
  baseUsd: number,
  destination: Destination,
  withChildSeat = false
) {
  const kgs =
    Math.round((baseKgs * destination.multiplier) / 100) * 100 +
    (withChildSeat ? CHILD_SEAT_PRICE_KGS : 0);
  const usd =
    Math.round(baseUsd * destination.multiplier) +
    (withChildSeat ? CHILD_SEAT_PRICE_USD : 0);
  return { kgs, usd };
}

export function formatKgs(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function buildBookingMessage(formData: BookingFormData, lang: Language): string {
  const vehicle =
    FLEET_VEHICLES.find((v) => v.id === formData.vehicleId) ?? FLEET_VEHICLES[0];
  const destination =
    DESTINATIONS.find((dest) => dest.id === formData.destinationId) ?? DESTINATIONS[0];
  const { kgs, usd } = calculateFare(
    vehicle.basePriceKgs,
    vehicle.basePriceUsd,
    destination,
    formData.childSeat
  );

  const airportLabel = TRANSLATIONS[lang].booking.airportName;
  const hotel = formData.hotelAddress.trim();
  const destinationLabel =
    formData.destinationId === 'custom' && hotel ? hotel : destination.shortLabel[lang];

  const fromLabel = formData.isReversed ? destinationLabel : airportLabel;
  const toLabel = formData.isReversed ? airportLabel : destinationLabel;

  const carLabel = `${vehicle.name[lang]} (${vehicle.models})`;
  const priceLabel = `$${usd} / ${formatKgs(kgs)} ${TRANSLATIONS[lang].booking.som}`;
  const dateTimeLabel = [formData.date, formData.time].filter(Boolean).join(', ');
  const flight = formData.flightNumber.trim();

  const lines = [
    'Hello! I would like to book a transfer from Manas Airport (BSZ).',
    `Route: ${fromLabel} -> ${toLabel}`,
  ];

  if (hotel) {
    lines.push(`Hotel / Address: ${hotel}`);
  }

  lines.push(`Car: ${carLabel} (${priceLabel})`);
  lines.push(`Date & Time: ${dateTimeLabel}`);

  if (flight) {
    lines.push(`Flight number: ${flight}`);
  }

  lines.push('Please send me the payment link/QR to confirm.');

  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildTelegramUrl(message: string): string {
  return `https://t.me/${CONTACT_INFO.telegramHandle}?text=${encodeURIComponent(message)}`;
}

export const TRANSLATIONS = {
  en: {
    brand: 'Manas Transfer',
    nav: {
      fleet: 'Our Fleet',
      routes: 'Routes & Rates',
      howItWorks: 'How It Works',
      contacts: 'Contacts',
      quickOrder: 'Book Now',
      orderViaWhatsapp: 'Message on WhatsApp',
      orderViaTelegram: 'Message on Telegram',
    },
    hero: {
      kicker: 'Manas International Airport (BSZ) · Bishkek · Bokonbaevo · Karakol',
      title: 'Executive Transfers from Manas Airport (BSZ) Across Kyrgyzstan',
      subtitle:
        'Fixed-price airport pickup with meet & greet, live flight tracking, and 24/7 English-speaking dispatch. Choose petrol sedans, family minivans, Sprinter shuttles, Yutong coaches, or electric vehicles.',
      highlights: [
        'Fixed all-inclusive price in USD & KGS',
        'Free live flight tracking',
        '24/7 English-speaking support',
      ],
    },
    booking: {
      formHeading: 'Book Your Airport Transfer',
      fromLabel: 'Pickup',
      toLabel: 'Drop-off',
      airportName: 'Manas Airport (BSZ)',
      swapAria: 'Swap pickup and drop-off',
      hotelLabel: 'Hotel / Destination (Hotel name & address)',
      hotelPlaceholder: 'e.g. Hyatt Regency Bishkek, 191 Abdrahmanov St',
      selectTariffTitle: 'Select vehicle class',
      selectedCarBadge: 'Selected',
      optionSign: 'Meet with name sign',
      optionFree: 'Free',
      optionChildSeat: 'Child seat',
      dateLabel: 'Arrival date',
      timeLabel: 'Time',
      flightLabel: 'Flight number',
      flightPlaceholder: 'e.g. TK 344',
      nameLabel: 'Passenger name',
      namePlaceholder: 'Alex Morgan',
      contactLabel: 'Phone, WhatsApp, or Telegram',
      contactPlaceholder: '+996 770 00 00 00 or @username',
      totalLabel: 'Fixed fare',
      submitBtn: 'Book Transfer',
      viewRoutesBtn: 'View Route',
      som: 'KGS',
      tariffUpdatedHint: 'Vehicle selected in booking form',
      paymentNote: 'Pay after arrival: Cash (USD / KGS), Visa / Mastercard, or MBank transfer',
      errors: {
        dateRequired: 'Please select a travel date',
        hotelRequired: 'Please enter your destination address or hotel name',
        nameRequired: 'Enter passenger name for meet & greet',
        contactRequired: 'Enter phone number or messenger handle',
      },
    },
    fleetSection: {
      title: 'Our Fleet',
      subtitle:
        'Structured for every trip across Kyrgyzstan — petrol sedans for city and highway reliability, minivans and Yutong coaches for groups, and whisper-quiet electric vehicles.',
      filters: {
        all: 'All Classes',
        petrol: 'Petrol Sedans',
        'minivan-bus': 'Minivans & Buses',
        electric: 'Electric',
      },
      routeHint: 'Manas (BSZ) → Bishkek',
      bookNowBtn: 'Book Now',
      selectedBtn: 'Selected',
      detailsBtn: 'Details',
      hideDetailsBtn: 'Hide Details',
      includedHeading: 'Included in transfer',
    },
    routesSection: {
      title: 'Fixed Destination Rates Across Kyrgyzstan',
      subtitle:
        'Transparent flat fares from Manas Airport (BSZ) to Bishkek, Ala-Archa, Cholpon-Ata, Bokonbaevo, and Karakol. Select any route to load it into the calculator.',
      routeCol: 'Route from Manas Airport (BSZ)',
      timeCol: 'Distance & Time',
      actionBtn: 'View Route',
    },
    benefits: {
      title: 'Why Travelers Choose Manas Transfer',
      subtitle: 'Dependable, transparent service for international visitors, families, and delegations.',
      items: [
        {
          number: '01',
          title: 'Fixed Price',
          description:
            'Your fare in USD and KGS is locked upon booking—never inflated by city traffic, night arrivals, or airport parking.',
          fact: 'Zero hidden fees upon arrival',
        },
        {
          number: '02',
          title: 'Free Flight Tracking',
          description:
            'We track your actual landing time by flight number. If your flight is delayed, pickup shifts automatically with no waiting surcharge.',
          fact: 'Up to 60 minutes complimentary waiting',
        },
        {
          number: '03',
          title: 'Meet & Greet With Name Sign',
          description:
            'Your chauffeur awaits inside the Manas arrivals hall with a personalized name board, handles your luggage, and escorts you to the vehicle.',
          fact: 'Personal reception inside BSZ terminal',
        },
        {
          number: '04',
          title: '24/7 English-Speaking Support',
          description:
            'Direct WhatsApp and Telegram dispatch in fluent English and Russian around the clock for effortless international arrivals.',
          fact: '24/7 English & Russian Dispatch',
        },
      ],
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Three simple steps—no account creation or complex checkout.',
      steps: [
        {
          number: '01',
          title: 'Choose Route, Hotel & Car Class',
          description:
            'Pick your destination (Bishkek, Bokonbaevo, Karakol, or any hotel), enter your arrival time and flight number, and click Book Transfer.',
        },
        {
          number: '02',
          title: 'Instant WhatsApp / Telegram Confirmation',
          description:
            'Send your pre-filled details to our 24/7 dispatcher. You receive confirmation within 5 minutes and your driver’s direct contact ahead of landing.',
        },
        {
          number: '03',
          title: 'Terminal Reception & Direct Ride',
          description:
            'Meet your driver with a name sign inside BSZ arrivals, load your suitcases, and travel straight to your hotel door.',
        },
      ],
      ctaBtn: 'Book Transfer',
    },
    modal: {
      statusLabel: 'Booking Ready',
      title: 'Confirm Your Transfer',
      subtitle:
        'Tap WhatsApp or Telegram below to send your complete itinerary directly to our 24/7 dispatcher and receive your payment link/QR.',
      referenceLabel: 'Booking ID',
      routeLabel: 'Route',
      hotelLabel: 'Hotel / Address',
      hotelEmpty: 'Not specified',
      dateTimeLabel: 'Date & Time',
      flightLabel: 'Flight number',
      flightEmpty: 'Not specified',
      vehicleLabel: 'Car class',
      optionsLabel: 'Options',
      optionsNone: 'Standard pickup',
      passengerLabel: 'Passenger',
      contactLabel: 'Contact',
      totalLabel: 'Fixed fare',
      copyBtn: 'Copy details',
      copiedBtn: 'Copied',
      sendWhatsapp: 'Confirm in WhatsApp',
      sendTelegram: 'Confirm in Telegram',
      closeBtn: 'Close',
    },
    footer: {
      about:
        'Fixed-price airport transfers from Manas International Airport (BSZ) to Bishkek, Bokonbaevo, Karakol, and across Kyrgyzstan. Petrol sedans, minivans, Sprinter shuttles, Yutong coaches, and electric vehicles.',
      hoursTitle: 'Operating Hours',
      hoursValue: '24/7 — round-the-clock dispatch & English support',
      locationValue: 'Manas Airport (BSZ) · Bishkek, Kyrgyzstan',
      navTitle: 'Navigation',
      contactsTitle: '24/7 Contacts & Messengers',
      whatsappBtn: 'WhatsApp',
      telegramBtn: 'Telegram',
      copyright: '© 2026 Manas Transfer. All rights reserved.',
      paymentHint: 'Cash (USD / KGS), Visa / Mastercard, MBank, and corporate invoices accepted',
    },
  },
  ru: {
    brand: 'Манас Трансфер',
    nav: {
      fleet: 'Наш автопарк',
      routes: 'Тарифы и маршруты',
      howItWorks: 'Как это работает',
      contacts: 'Контакты',
      quickOrder: 'Заказать',
      orderViaWhatsapp: 'Написать в WhatsApp',
      orderViaTelegram: 'Написать в Telegram',
    },
    hero: {
      kicker: 'Международный аэропорт Манас (BSZ) · Бишкек · Боконбаево · Каракол',
      title: 'Трансфер из аэропорта Манас (BSZ) в Бишкек и по Кыргызстану',
      subtitle:
        'Встреча с табличкой в зале прилёта, отслеживание рейса и круглосуточная поддержка на английском и русском. Бензиновые седаны, минивэны, Sprinter, автобусы Yutong и электромобили по фиксированной цене.',
      highlights: [
        'Фиксированная цена в USD и KGS',
        'Бесплатное отслеживание рейсов',
        'Поддержка 24/7 на английском и русском',
      ],
    },
    booking: {
      formHeading: 'Бронирование трансфера из аэропорта',
      fromLabel: 'Откуда',
      toLabel: 'Куда',
      airportName: 'Аэропорт Манас (BSZ)',
      swapAria: 'Поменять местами откуда и куда',
      hotelLabel: 'Отель / Адрес назначения (название отеля и адрес)',
      hotelPlaceholder: 'Например, Hyatt Regency Bishkek, ул. Абдрахманова 191',
      selectTariffTitle: 'Выберите класс автомобиля',
      selectedCarBadge: 'Выбрано',
      optionSign: 'Встреча с табличкой',
      optionFree: 'Бесплатно',
      optionChildSeat: 'Детское кресло',
      dateLabel: 'Дата прилёта',
      timeLabel: 'Время',
      flightLabel: 'Номер рейса',
      flightPlaceholder: 'Например, TK 344',
      nameLabel: 'Имя пассажира',
      namePlaceholder: 'Алексей / Айбек',
      contactLabel: 'Телефон, WhatsApp или Telegram',
      contactPlaceholder: '+996 770 00 00 00 или @username',
      totalLabel: 'Фиксированная цена',
      submitBtn: 'Забронировать трансфер',
      viewRoutesBtn: 'Все маршруты',
      som: 'сом',
      tariffUpdatedHint: 'Автомобиль выбран в форме бронирования',
      paymentNote: 'Оплата после поездки: наличные (USD / сом), карта Visa / Mastercard или MBank',
      errors: {
        dateRequired: 'Выберите дату поездки',
        hotelRequired: 'Укажите название отеля или адрес назначения',
        nameRequired: 'Укажите имя для встречи с табличкой',
        contactRequired: 'Укажите телефон или мессенджер для связи',
      },
    },
    fleetSection: {
      title: 'Наш автопарк',
      subtitle:
        'Чёткое разделение по классам для любых задач: надёжные бензиновые седаны, минивэны и туристические автобусы Yutong для групп, а также бесшумные электромобили.',
      filters: {
        all: 'Все классы',
        petrol: 'Бензиновые седаны',
        'minivan-bus': 'Минивэны и автобусы',
        electric: 'Электромобили',
      },
      routeHint: 'Манас (BSZ) → Бишкек',
      bookNowBtn: 'Забронировать',
      selectedBtn: 'Выбран',
      detailsBtn: 'Подробнее',
      hideDetailsBtn: 'Скрыть',
      includedHeading: 'Включено в поездку',
    },
    routesSection: {
      title: 'Фиксированные тарифы по Кыргызстану',
      subtitle:
        'Прозрачные цены из аэропорта «Манас» (BSZ) в Бишкек, Ала-Арчу, Чолпон-Ату, Боконбаево и Каракол. Нажмите на маршрут, чтобы подставить его в форму.',
      routeCol: 'Направление из аэропорта Манас (BSZ)',
      timeCol: 'Расстояние и время',
      actionBtn: 'Выбрать маршрут',
    },
    benefits: {
      title: 'Преимущества сервиса',
      subtitle: 'Понятные и надёжные условия для туристов, семей и деловых делегаций.',
      items: [
        {
          number: '01',
          title: 'Фиксированная цена',
          description:
            'Стоимость в долларах и сомах закрепляется при заказе и не меняется из-за пробок, ночного прилёта или парковки в аэропорту.',
          fact: 'Никаких скрытых доплат по прибытии',
        },
        {
          number: '02',
          title: 'Бесплатное отслеживание рейсов',
          description:
            'Мы отслеживаем реальное время посадки по номеру рейса. При задержке самолёта водитель бесплатно сдвинет время подачи и дождётся вас.',
          fact: 'До 60 минут бесплатного ожидания после посадки',
        },
        {
          number: '03',
          title: 'Встреча с табличкой',
          description:
            'Водитель встречает вас в зале прилёта аэропорта «Манас» с именной табличкой, помогает с багажом и провожает до автомобиля.',
          fact: 'Персональная встреча в терминале BSZ',
        },
        {
          number: '04',
          title: 'Круглосуточная поддержка на английском языке',
          description:
            'Диспетчерская работает 24/7 на английском и русском языках в WhatsApp и Telegram — удобно для иностранных гостей и любых рейсов.',
          fact: '24/7 English & Russian Concierge',
        },
      ],
    },
    howItWorks: {
      title: 'Как это работает',
      subtitle: 'Всего 3 простых шага — без регистрации и сложных анкет.',
      steps: [
        {
          number: '01',
          title: 'Выберите маршрут, отель и класс авто',
          description:
            'Укажите направление (Бишкек, Боконбаево, Каракол или конкретный отель), дату, номер рейса и нажмите «Забронировать трансфер».',
        },
        {
          number: '02',
          title: 'Мгновенное подтверждение в WhatsApp / Telegram',
          description:
            'Отправьте готовое сообщение диспетчеру 24/7. За 5 минут мы подтвердим заказ и заранее вышлем контакты водителя и номер авто.',
        },
        {
          number: '03',
          title: 'Встреча в терминале и прямая поездка',
          description:
            'Водитель встретит вас с табличкой в зале прилёта BSZ, поможет с чемоданами и доставит прямо до дверей отеля.',
        },
      ],
      ctaBtn: 'Забронировать трансфер',
    },
    modal: {
      statusLabel: 'Заявка готова',
      title: 'Подтвердите трансфер',
      subtitle:
        'Нажмите WhatsApp или Telegram ниже, чтобы мгновенно отправить готовые детали диспетчеру 24/7 и получить ссылку / QR для подтверждения.',
      referenceLabel: 'Номер заявки',
      routeLabel: 'Маршрут',
      hotelLabel: 'Отель / Адрес',
      hotelEmpty: 'Не указан',
      dateTimeLabel: 'Дата и время',
      flightLabel: 'Номер рейса',
      flightEmpty: 'Не указан',
      vehicleLabel: 'Класс авто',
      optionsLabel: 'Опции',
      optionsNone: 'Стандартная подача',
      passengerLabel: 'Пассажир',
      contactLabel: 'Контакт',
      totalLabel: 'Фиксированная цена',
      copyBtn: 'Скопировать детали',
      copiedBtn: 'Скопировано',
      sendWhatsapp: 'Подтвердить в WhatsApp',
      sendTelegram: 'Подтвердить в Telegram',
      closeBtn: 'Закрыть',
    },
    footer: {
      about:
        'Трансферы по фиксированной цене из международного аэропорта «Манас» (BSZ) в Бишкек, Боконбаево, Каракол и по всему Кыргызстану. Бензиновые седаны, минивэны, Sprinter, автобусы Yutong и электромобили.',
      hoursTitle: 'Режим работы',
      hoursValue: '24/7 — круглосуточная подача и поддержка',
      locationValue: 'Аэропорт «Манас» (BSZ) · Бишкек, Кыргызстан',
      navTitle: 'Навигация',
      contactsTitle: 'Контакты и мессенджеры 24/7',
      whatsappBtn: 'WhatsApp',
      telegramBtn: 'Telegram',
      copyright: '© 2026 Манас Трансфер. Все права защищены.',
      paymentHint: 'Оплата: наличные (USD / сом), Visa / Mastercard, MBank, безналичный расчёт',
    },
  },
} as const;
