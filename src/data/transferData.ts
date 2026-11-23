export type Language = 'ru' | 'en';

export type TariffId =
  | 'economy'
  | 'comfort'
  | 'electric'
  | 'premium'
  | 'business'
  | 'minivan-bus';

export type FleetFilterId = 'all' | TariffId;

export interface TariffOption {
  id: TariffId;
  name: Record<Language, string>;
  modelsSummary: Record<Language, string>;
  passengersLabel: string;
  luggageLabel: string;
  basePriceKgs: number;
  basePriceUsd: number;
  pricePrefix?: Record<Language, string>;
  secondaryPriceNote?: Record<Language, string>;
  defaultVehicleId: string;
  image: string;
}

export interface FleetVehicle {
  id: string;
  name: string;
  subtitle: Record<Language, string>;
  tariffId: TariffId;
  filterTags: TariffId[];
  classLabel: Record<Language, string>;
  passengers: string;
  luggage: string;
  features: Record<Language, string[]>;
  basePriceKgs: number;
  basePriceUsd: number;
  pricePrefix?: Record<Language, string>;
  image: string;
}

export interface Destination {
  id: string;
  label: Record<Language, string>;
  shortLabel: Record<Language, string>;
  distanceKm: number;
  duration: Record<Language, string>;
  multiplier: number;
}

export interface BookingFormData {
  destinationId: string;
  customAddress: string;
  isReversed: boolean;
  tariffId: TariffId;
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
  date: string;
  time: string;
  flightNumber: string;
  tariff: TariffOption;
  vehicle: FleetVehicle;
  meetWithSign: boolean;
  childSeat: boolean;
  priceKgs: number;
  priceUsd: number;
  passengerName: string;
  contact: string;
}

export const HERO_IMAGE = '/src/assets/images/hero_manas_airport_night_1795273722657.jpg';

export const CHILD_SEAT_PRICE_KGS = 300;
export const CHILD_SEAT_PRICE_USD = 3;

export const CONTACT_INFO = {
  phoneDisplay: '+996 770 44 33 05',
  phoneHref: 'tel:+996770443305',
  whatsappNumber: '996770443305',
  telegramHandle: 'HOPEAT',
  whatsappDefaultText:
    'Hello! I would like to book a transfer from Manas Airport (FRU). Please send me the payment link/QR to confirm.',
  email: 'info@manastransfer.kg',
};

export const TARIFFS: TariffOption[] = [
  {
    id: 'economy',
    name: { ru: 'Эконом-класс', en: 'Economy' },
    modelsSummary: { ru: 'KIA Rio, Hyundai Solaris', en: 'KIA Rio, Hyundai Solaris' },
    passengersLabel: '3',
    luggageLabel: '2',
    basePriceKgs: 3000,
    basePriceUsd: 34,
    defaultVehicleId: 'hyundai-solaris',
    image: '/src/assets/images/tariff_economy_sedan_1795273722419.jpg',
  },
  {
    id: 'comfort',
    name: { ru: 'Комфорт', en: 'Comfort' },
    modelsSummary: { ru: 'KIA K5, Toyota Camry', en: 'KIA K5, Toyota Camry' },
    passengersLabel: '3',
    luggageLabel: '3',
    basePriceKgs: 3500,
    basePriceUsd: 40,
    defaultVehicleId: 'kia-k5',
    image: '/src/assets/images/tariff_comfort_sedan_1795273724368.jpg',
  },
  {
    id: 'electric',
    name: { ru: 'Электро', en: 'Electric (EV)' },
    modelsSummary: { ru: 'BYD Han, BYD Song Plus EV', en: 'BYD Han, BYD Song Plus EV' },
    passengersLabel: '4',
    luggageLabel: '3',
    basePriceKgs: 3000,
    basePriceUsd: 34,
    defaultVehicleId: 'byd-han',
    image: '/src/assets/images/tariff_electric_ev_1795273724251.jpg',
  },
  {
    id: 'premium',
    name: { ru: 'Премиум', en: 'Premium' },
    modelsSummary: { ru: 'Mercedes E-Class, BMW X7', en: 'Mercedes E-Class, BMW X7' },
    passengersLabel: '4',
    luggageLabel: '3',
    basePriceKgs: 4800,
    basePriceUsd: 55,
    defaultVehicleId: 'mercedes-e-class',
    image: '/src/assets/images/car_mercedes_eclass_light_1795274961194.jpg',
  },
  {
    id: 'business',
    name: { ru: 'Бизнес', en: 'Business EV' },
    modelsSummary: { ru: 'Zeekr 001, Li Auto L7 / L9', en: 'Zeekr 001, Li Auto L7 / L9' },
    passengersLabel: '4',
    luggageLabel: '3',
    basePriceKgs: 5700,
    basePriceUsd: 65,
    defaultVehicleId: 'zeekr-001',
    image: '/src/assets/images/car_zeekr_001_light_1795274962325.jpg',
  },
  {
    id: 'minivan-bus',
    name: { ru: 'Минивэн / Автобус', en: 'Minivan / Bus' },
    modelsSummary: {
      ru: 'KIA Carnival (7 мест), Sprinter, 12-м автобус',
      en: 'KIA Carnival (7-seat), Sprinter, 12m Coach',
    },
    passengersLabel: '7–45',
    luggageLabel: '6+',
    basePriceKgs: 5700,
    basePriceUsd: 65,
    pricePrefix: { ru: 'от', en: 'from' },
    secondaryPriceNote: { ru: '7 мест $65 · 12-м 8 100 сом', en: '7-seat $65 · 12m 8,100 KGS' },
    defaultVehicleId: 'kia-carnival',
    image: '/src/assets/images/tariff_minivan_family_1795273725551.jpg',
  },
];

export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'hyundai-solaris',
    name: 'Hyundai Solaris',
    subtitle: {
      ru: 'Аналоги: KIA Rio — надёжный седан для быстрой и доступной поездки в город',
      en: 'Or KIA Rio — dependable sedan for an affordable, smooth airport ride',
    },
    tariffId: 'economy',
    filterTags: ['economy'],
    classLabel: { ru: 'Эконом-класс', en: 'Economy' },
    passengers: '3',
    luggage: '2',
    features: {
      ru: ['Кондиционер', 'Зарядка USB', 'Ожидание 60 мин бесплатно'],
      en: ['Air conditioning', 'USB charger', '60 min free waiting'],
    },
    basePriceKgs: 3000,
    basePriceUsd: 34,
    image: '/src/assets/images/tariff_economy_sedan_1795273722419.jpg',
  },
  {
    id: 'kia-k5',
    name: 'KIA K5',
    subtitle: {
      ru: 'Аналоги: Toyota Camry — просторный седан с мягкой подвеской и вместительным багажником',
      en: 'Or Toyota Camry — spacious cabin with smooth ride and generous trunk space',
    },
    tariffId: 'comfort',
    filterTags: ['comfort'],
    classLabel: { ru: 'Комфорт', en: 'Comfort' },
    passengers: '3',
    luggage: '3',
    features: {
      ru: ['Климат-контроль', 'Вода', 'Type-C', 'Встреча с табличкой'],
      en: ['Climate control', 'Water', 'USB-C', 'Meet & greet'],
    },
    basePriceKgs: 3500,
    basePriceUsd: 40,
    image: '/src/assets/images/tariff_comfort_sedan_1795273724368.jpg',
  },
  {
    id: 'byd-han',
    name: 'BYD Han EV',
    subtitle: {
      ru: 'Аналоги: BYD Song Plus EV — современный тихий электромобиль с плавным ходом и Wi-Fi',
      en: 'Or BYD Song Plus EV — whisper-quiet modern electric sedan with smooth ride & Wi-Fi',
    },
    tariffId: 'electric',
    filterTags: ['electric'],
    classLabel: { ru: 'Электро', en: 'Electric EV' },
    passengers: '4',
    luggage: '3',
    features: {
      ru: ['100% Электро', 'Wi-Fi', 'Вода', 'Быстрая зарядка Type-C'],
      en: ['100% Electric', 'Wi-Fi', 'Water', 'Fast USB-C charging'],
    },
    basePriceKgs: 3000,
    basePriceUsd: 34,
    image: '/src/assets/images/tariff_electric_ev_1795273724251.jpg',
  },
  {
    id: 'mercedes-e-class',
    name: 'Mercedes-Benz E-Class',
    subtitle: {
      ru: 'Немецкий бизнес-седан с идеальной шумоизоляцией для деловых поездок и встреч',
      en: 'Executive German sedan with quiet cabin for business travel and city transfers',
    },
    tariffId: 'premium',
    filterTags: ['premium'],
    classLabel: { ru: 'Премиум', en: 'Premium' },
    passengers: '3',
    luggage: '3',
    features: {
      ru: ['Кожаный салон', 'Wi-Fi', 'Вода', 'Type-C'],
      en: ['Leather interior', 'Wi-Fi', 'Water', 'USB-C'],
    },
    basePriceKgs: 4800,
    basePriceUsd: 55,
    image: '/src/assets/images/car_mercedes_eclass_light_1795274961194.jpg',
  },
  {
    id: 'bmw-x7',
    name: 'BMW X7',
    subtitle: {
      ru: 'Полноразмерный внедорожник с пневмоподвеской для города, горных маршрутов и Иссык-Куля',
      en: 'Full-size air-suspension SUV suited for city comfort, mountain roads, and Issyk-Kul',
    },
    tariffId: 'premium',
    filterTags: ['premium'],
    classLabel: { ru: 'Премиум', en: 'Premium' },
    passengers: '5',
    luggage: '4',
    features: {
      ru: ['Пневмоподвеска', 'Wi-Fi', 'Вода', 'Панорамная крыша'],
      en: ['Air suspension', 'Wi-Fi', 'Water', 'Panoramic roof'],
    },
    basePriceKgs: 4800,
    basePriceUsd: 55,
    image: '/src/assets/images/car_bmw_x7_light_1795274961495.jpg',
  },
  {
    id: 'zeekr-001',
    name: 'Zeekr 001',
    subtitle: {
      ru: 'Электрический лифтбек с пневмоподвеской, массажем сидений и бесшумным салоном',
      en: 'Flagship electric shooting brake with air suspension, massage seats, and quiet cabin',
    },
    tariffId: 'business',
    filterTags: ['business', 'electric'],
    classLabel: { ru: 'Бизнес · Электро', en: 'Business · Electric' },
    passengers: '3',
    luggage: '3',
    features: {
      ru: ['100% Электро', 'Wi-Fi', 'Вода', 'Type-C 65W'],
      en: ['100% Electric', 'Wi-Fi', 'Water', 'Type-C 65W'],
    },
    basePriceKgs: 5700,
    basePriceUsd: 65,
    image: '/src/assets/images/car_zeekr_001_light_1795274962325.jpg',
  },
  {
    id: 'li-auto-l9',
    name: 'Li Auto L9',
    subtitle: {
      ru: 'Флагманский кроссовер (также доступен Li Auto L7) с капитанскими креслами и подогревом',
      en: 'Flagship hybrid-EV SUV (Li Auto L7 also available) with captain seats & rear comfort',
    },
    tariffId: 'business',
    filterTags: ['business', 'electric'],
    classLabel: { ru: 'Бизнес · Электро', en: 'Business · Hybrid EV' },
    passengers: '5',
    luggage: '4',
    features: {
      ru: ['Гибрид EV', 'Wi-Fi', 'Вода', 'Массаж и климат 2-го ряда'],
      en: ['Range-Extended EV', 'Wi-Fi', 'Water', '2nd-row massage & climate'],
    },
    basePriceKgs: 5700,
    basePriceUsd: 65,
    image: '/src/assets/images/car_li_auto_l9_light_1795274961498.jpg',
  },
  {
    id: 'kia-carnival',
    name: 'KIA Carnival (7-Seater)',
    subtitle: {
      ru: 'Просторный 7-местный минивэн с раздвижными дверями для семьи или группы с багажом',
      en: 'Spacious 7-seat minivan with sliding doors for families or small groups with luggage',
    },
    tariffId: 'minivan-bus',
    filterTags: ['minivan-bus'],
    classLabel: { ru: 'Минивэн · 7 мест', en: '7-Seat Minivan' },
    passengers: '7',
    luggage: '6',
    features: {
      ru: ['До 7 мест', 'Раздельный климат', 'Wi-Fi', 'Зарядки USB у каждого ряда'],
      en: ['Up to 7 seats', 'Multi-zone A/C', 'Wi-Fi', 'USB ports every row'],
    },
    basePriceKgs: 5700,
    basePriceUsd: 65,
    image: '/src/assets/images/tariff_minivan_family_1795273725551.jpg',
  },
  {
    id: 'mercedes-sprinter',
    name: 'Mercedes-Benz Sprinter / Автобус 12 м',
    subtitle: {
      ru: 'Микроавтобусы Mercedes-Benz Sprinter и 12-метровые туристические автобусы для делегаций и туров',
      en: 'Mercedes-Benz Sprinter minibuses & 12-meter tour coaches for delegations and groups',
    },
    tariffId: 'minivan-bus',
    filterTags: ['minivan-bus'],
    classLabel: { ru: 'Минивэн и автобус · 12-метровый', en: 'Minibus & 12m Coach' },
    passengers: '18–45',
    luggage: '20+',
    features: {
      ru: ['12-метровый автобус / Sprinter', 'Большой багажный отсек', 'Кондиционер', 'Микрофон гида'],
      en: ['12-meter coach / Sprinter', 'Large luggage bay', 'A/C', 'Tour guide mic'],
    },
    basePriceKgs: 8100,
    basePriceUsd: 93,
    image: '/src/assets/images/car_sprinter_bus_light_1795274961853.jpg',
  },
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'bishkek-hotel',
    label: {
      ru: 'Бишкек / Отель (Центр города)',
      en: 'Bishkek / Hotel (City Center)',
    },
    shortLabel: {
      ru: 'Бишкек / Отель',
      en: 'Bishkek / Hotel',
    },
    distanceKm: 32,
    duration: { ru: '35–40 мин', en: '35–40 min' },
    multiplier: 1,
  },
  {
    id: 'bishkek-south',
    label: {
      ru: 'Бишкек (Южные мкр. / Асанбай)',
      en: 'Bishkek (South District / Asanbay)',
    },
    shortLabel: {
      ru: 'Южная часть Бишкека',
      en: 'South Bishkek',
    },
    distanceKm: 39,
    duration: { ru: '45 мин', en: '45 min' },
    multiplier: 1.12,
  },
  {
    id: 'ala-archa',
    label: {
      ru: 'Природный парк Ала-Арча',
      en: 'Ala-Archa National Park',
    },
    shortLabel: {
      ru: 'Ала-Арча',
      en: 'Ala-Archa Park',
    },
    distanceKm: 68,
    duration: { ru: '1 ч 20 мин', en: '1h 20m' },
    multiplier: 1.75,
  },
  {
    id: 'issyk-kul',
    label: {
      ru: 'Иссык-Куль (Чолпон-Ата / Тамчы)',
      en: 'Issyk-Kul (Cholpon-Ata / Tamchy)',
    },
    shortLabel: {
      ru: 'Иссык-Куль',
      en: 'Issyk-Kul',
    },
    distanceKm: 280,
    duration: { ru: '3 ч 50 мин', en: '3h 50m' },
    multiplier: 4.0,
  },
  {
    id: 'karakol',
    label: {
      ru: 'Каракол (Город / горнолыжная база)',
      en: 'Karakol (City / Ski Resort)',
    },
    shortLabel: {
      ru: 'Каракол',
      en: 'Karakol',
    },
    distanceKm: 425,
    duration: { ru: '5 ч 40 мин', en: '5h 40m' },
    multiplier: 5.5,
  },
  {
    id: 'custom',
    label: {
      ru: 'Другой адрес по Кыргызстану',
      en: 'Custom Address in Kyrgyzstan',
    },
    shortLabel: {
      ru: 'Индивидуальный маршрут',
      en: 'Custom route',
    },
    distanceKm: 35,
    duration: { ru: 'По маршруту', en: 'By route' },
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

export const TRANSLATIONS = {
  ru: {
    brand: 'Манас Трансфер',
    nav: {
      fleet: 'Наш автопарк',
      routes: 'Тарифы по стране',
      howItWorks: 'Как это работает',
      contacts: 'Контакты',
      quickOrder: 'WhatsApp / Telegram',
      orderViaWhatsapp: 'Написать в WhatsApp',
      orderViaTelegram: 'Написать в Telegram',
    },
    hero: {
      kicker: 'Аэропорт Манас (FRU) · Бишкек · Иссык-Куль · Весь Кыргызстан',
      title: 'Трансфер из аэропорта Манас в Бишкек и по Кыргызстану',
      subtitle:
        'Удобный выбор класса авто в один клик — от Эконома и электромобилей BYD до бизнес-класса Zeekr, минивэнов и 12-метровых автобусов. Фиксированная цена в сомах и долларах.',
      highlights: [
        'Фиксированная цена без доплат',
        'Бесплатное отслеживание рейса',
        'Поддержка 24/7 на русском и английском',
      ],
    },
    booking: {
      fromLabel: 'Откуда',
      toLabel: 'Куда',
      airportName: 'Аэропорт Манас (FRU)',
      swapAria: 'Поменять местами откуда и куда',
      customAddressPlaceholder: 'Укажите отель, улицу или город',
      selectTariffTitle: 'Выберите тариф',
      selectedCarBadge: 'Выбранный автомобиль',
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
      contactPlaceholder: '+996 555 000 000 или @username',
      totalLabel: 'Фиксированная стоимость',
      submitBtn: 'Забронировать трансфер',
      som: 'сом',
      tariffUpdatedHint: 'Автомобиль подставлен в форму',
      paymentNote: 'Оплата после поездки: наличные (сом / $), карта Visa / Mastercard или MBank',
      errors: {
        dateRequired: 'Выберите дату поездки',
        customAddressRequired: 'Укажите адрес назначения',
        nameRequired: 'Укажите имя для встречи с табличкой',
        contactRequired: 'Укажите телефон или мессенджер для связи',
      },
    },
    fleetSection: {
      title: 'Наш автопарк',
      subtitle:
        'Выбирайте конкретную модель под вашу поездку — от экономичного седана и современных электромобилей до минивэна KIA Carnival и 12-метрового автобуса. Кнопка «Выбрать» сразу подставит машину в форму.',
      filters: {
        all: 'Все',
        economy: 'Эконом',
        comfort: 'Комфорт',
        electric: 'Электро (BYD)',
        premium: 'Премиум',
        business: 'Бизнес',
        'minivan-bus': 'Минивэн и автобус',
      },
      seatsUnit: 'мест',
      bagsUnit: 'багажа',
      routeHint: 'Манас (FRU) → Бишкек',
      chooseBtn: 'Выбрать',
      chosenBtn: 'Выбран',
    },
    routesSection: {
      title: 'Фиксированные цены по направлениям',
      subtitle:
        'Стоимость трансфера из аэропорта «Манас» (FRU) в Бишкек, Ала-Арчу, на Иссык-Куль и в Каракол. Нажмите на нужный маршрут для расчёта.',
      routeCol: 'Направление из аэропорта Манас (FRU)',
      timeCol: 'В пути',
      clickHint: 'Нажмите на маршрут для выбора',
    },
    benefits: {
      title: 'Преимущества сервиса',
      subtitle: 'Понятные условия для туристов, семейных путешественников и деловых делегаций.',
      items: [
        {
          number: '01',
          title: 'Фиксированная цена',
          description:
            'Цена в сомах и долларах фиксируется при бронировании и не меняется из-за пробок, ночного прилёта или времени на парковке аэропорта.',
          fact: 'Никаких скрытых доплат по прибытии',
        },
        {
          number: '02',
          title: 'Бесплатное отслеживание рейсов',
          description:
            'Отслеживаем реальное время посадки по номеру рейса. Если самолёт задержится, водитель бесплатно скорректирует подачу и дождётся вас.',
          fact: 'До 60 минут бесплатного ожидания после посадки',
        },
        {
          number: '03',
          title: 'Встреча с табличкой',
          description:
            'Водитель встречает вас прямо в зале прилёта аэропорта «Манас» с именной табличкой, помогает с багажом и провожает к машине.',
          fact: 'Персональная встреча в терминале FRU',
        },
        {
          number: '04',
          title: 'Круглосуточная поддержка на английском языке',
          description:
            'Диспетчерская работает 24/7 на русском и английском языках в WhatsApp и Telegram — удобно для иностранных гостей и международных рейсов.',
          fact: '24/7 English & Russian Concierge',
        },
      ],
    },
    howItWorks: {
      title: 'Как это работает',
      subtitle: 'Всего 3 простых шага — без предоплаты и долгих согласований.',
      steps: [
        {
          number: '01',
          title: 'Оформите заявку за 1 минуту',
          description:
            'Выберите направление, дату, номер рейса и подходящий класс или автомобиль на сайте и нажмите «Забронировать трансфер».',
        },
        {
          number: '02',
          title: 'Подтверждение и контакты водителя',
          description:
            'Мы подтверждаем заказ в WhatsApp за 5 минут, а заранее отправляем вам имя водителя, марку, госномер машины и прямой телефон.',
        },
        {
          number: '03',
          title: 'Встреча с табличкой и поездка',
          description:
            'Водитель встречает вас у выхода из зала прилёта, помогает загрузить чемоданы и доставляет прямо до отеля или нужного адреса.',
        },
      ],
      ctaBtn: 'Забронировать трансфер',
    },
    modal: {
      statusLabel: 'Заявка подтверждена',
      title: 'Трансфер предварительно забронирован',
      subtitle:
        'Нажмите кнопку WhatsApp ниже, чтобы мгновенно отправить готовые детали диспетчеру, или дождитесь нашего сообщения в течение 5 минут.',
      referenceLabel: 'Номер заявки',
      routeLabel: 'Маршрут',
      dateTimeLabel: 'Дата и время',
      flightLabel: 'Номер рейса',
      flightEmpty: 'Не указан',
      tariffLabel: 'Тариф',
      vehicleLabel: 'Автомобиль',
      optionsLabel: 'Опции',
      optionsNone: 'Стандартная подача',
      passengerLabel: 'Пассажир',
      contactLabel: 'Контакт',
      totalLabel: 'Фиксированная цена',
      copyBtn: 'Скопировать детали',
      copiedBtn: 'Скопировано',
      sendWhatsapp: 'Перейти в WhatsApp',
      sendTelegram: 'Открыть в Telegram',
      closeBtn: 'Закрыть',
    },
    footer: {
      about:
        'Сервис трансферов из международного аэропорта «Манас» (FRU) в Бишкек, на Иссык-Куль и по всему Кыргызстану. Легковые авто, электромобили, минивэны и автобусы.',
      hoursTitle: 'Режим работы',
      hoursValue: '24/7 — круглосуточная подача и поддержка',
      locationValue: 'Аэропорт «Манас» (FRU) · Бишкек, Кыргызстан',
      navTitle: 'Навигация',
      contactsTitle: 'Контакты и мессенджеры 24/7',
      whatsappBtn: 'WhatsApp',
      telegramBtn: 'Telegram',
      copyright: '© 2026 Манас Трансфер. Все права защищены.',
      paymentHint: 'Оплата: наличные (сом / USD), Visa / Mastercard, MBank, безналичный расчёт',
    },
  },
  en: {
    brand: 'Manas Transfer',
    nav: {
      fleet: 'Our Fleet',
      routes: 'Kyrgyzstan Rates',
      howItWorks: 'How It Works',
      contacts: 'Contacts',
      quickOrder: 'WhatsApp / Telegram',
      orderViaWhatsapp: 'Message on WhatsApp',
      orderViaTelegram: 'Message on Telegram',
    },
    hero: {
      kicker: 'Manas Airport (FRU) · Bishkek · Issyk-Kul · All of Kyrgyzstan',
      title: 'Manas Airport Transfer to Bishkek & Across Kyrgyzstan',
      subtitle:
        'Pick your class in one click — from Economy sedans and BYD electric cars to Business Zeekr EVs, minivans, and 12-meter coaches. Fixed prices in KGS and USD.',
      highlights: [
        'Fixed all-inclusive price',
        'Free live flight tracking',
        '24/7 English-speaking support',
      ],
    },
    booking: {
      fromLabel: 'Pickup',
      toLabel: 'Drop-off',
      airportName: 'Manas Airport (FRU)',
      swapAria: 'Swap pickup and drop-off',
      customAddressPlaceholder: 'Enter hotel, street, or city',
      selectTariffTitle: 'Choose a tariff',
      selectedCarBadge: 'Selected vehicle',
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
      contactPlaceholder: '+996 555 000 000 or @username',
      totalLabel: 'Fixed fare',
      submitBtn: 'Book Transfer',
      som: 'KGS',
      tariffUpdatedHint: 'Vehicle loaded into booking form',
      paymentNote: 'Pay after arrival: Cash (KGS / USD), Visa / Mastercard, or MBank',
      errors: {
        dateRequired: 'Please select a travel date',
        customAddressRequired: 'Please enter your destination address',
        nameRequired: 'Enter passenger name for meet & greet',
        contactRequired: 'Enter phone number or messenger handle',
      },
    },
    fleetSection: {
      title: 'Our Fleet',
      subtitle:
        'Pick the exact vehicle for your trip — from Economy sedans and BYD electric cars to Business Zeekr/Li Auto, KIA Carnival minivans, and 12-meter coaches.',
      filters: {
        all: 'All',
        economy: 'Economy',
        comfort: 'Comfort',
        electric: 'Electric (BYD)',
        premium: 'Premium',
        business: 'Business',
        'minivan-bus': 'Minivan & Bus',
      },
      seatsUnit: 'seats',
      bagsUnit: 'bags',
      routeHint: 'Manas (FRU) → Bishkek',
      chooseBtn: 'Select',
      chosenBtn: 'Selected',
    },
    routesSection: {
      title: 'Fixed Destination Rates',
      subtitle:
        'Transparent fares from Manas Airport (FRU) to Bishkek, Ala-Archa, Issyk-Kul, and Karakol. Click any destination row to calculate.',
      routeCol: 'Route from Manas Airport (FRU)',
      timeCol: 'Travel time',
      clickHint: 'Click a route to apply',
    },
    benefits: {
      title: 'Why Ride With Us',
      subtitle: 'Clear, reliable service for tourists, families, and corporate delegations.',
      items: [
        {
          number: '01',
          title: 'Fixed Price',
          description:
            'Your fare in KGS and USD is locked upon booking—never inflated by city traffic, late-night arrivals, or airport parking fees.',
          fact: 'Zero hidden charges upon arrival',
        },
        {
          number: '02',
          title: 'Free Flight Tracking',
          description:
            'We monitor your flight status in real time. If your landing is delayed, your driver adjusts pickup automatically at no extra fee.',
          fact: 'Up to 60 minutes complimentary waiting',
        },
        {
          number: '03',
          title: 'Meet & Greet With Name Sign',
          description:
            'Your driver meets you directly inside the Manas arrivals hall with a clear name board, assists with luggage, and escorts you to the vehicle.',
          fact: 'Personal reception inside FRU terminal',
        },
        {
          number: '04',
          title: '24/7 English-Speaking Support',
          description:
            'Our round-the-clock dispatch team responds promptly in English and Russian via WhatsApp and Telegram for smooth international travel.',
          fact: '24/7 English & Russian Dispatch',
        },
      ],
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Three simple steps—no registration or advance prepayment required.',
      steps: [
        {
          number: '01',
          title: 'Submit Your Request in 1 Minute',
          description:
            'Choose your destination, date, flight number, and preferred class or vehicle, then click “Book Transfer”.',
        },
        {
          number: '02',
          title: 'Confirmation & Driver Contacts',
          description:
            'We confirm via WhatsApp within 5 minutes and send your driver’s name, license plate, and direct contact prior to landing.',
        },
        {
          number: '03',
          title: 'Meet at Arrivals & Ride',
          description:
            'Your driver greets you with a name sign outside baggage claim, loads your bags, and takes you straight to your hotel or destination.',
        },
      ],
      ctaBtn: 'Book Transfer',
    },
    modal: {
      statusLabel: 'Booking Confirmed',
      title: 'Your Transfer Is Reserved',
      subtitle:
        'Tap WhatsApp below to send your ready booking summary directly to our 24/7 dispatcher, or wait for our message within 5 minutes.',
      referenceLabel: 'Booking ID',
      routeLabel: 'Route',
      dateTimeLabel: 'Date & time',
      flightLabel: 'Flight number',
      flightEmpty: 'Not specified',
      tariffLabel: 'Tariff',
      vehicleLabel: 'Vehicle',
      optionsLabel: 'Options',
      optionsNone: 'Standard pickup',
      passengerLabel: 'Passenger',
      contactLabel: 'Contact',
      totalLabel: 'Fixed fare',
      copyBtn: 'Copy details',
      copiedBtn: 'Copied',
      sendWhatsapp: 'Continue in WhatsApp',
      sendTelegram: 'Open in Telegram',
      closeBtn: 'Close',
    },
    footer: {
      about:
        'Reliable airport transfers from Manas International Airport (FRU) to Bishkek, Issyk-Kul, and across Kyrgyzstan. Sedans, EVs, minivans, and 12m coaches.',
      hoursTitle: 'Working Hours',
      hoursValue: '24/7 — round-the-clock dispatch & English support',
      locationValue: 'Manas Airport (FRU) · Bishkek, Kyrgyzstan',
      navTitle: 'Navigation',
      contactsTitle: '24/7 Contacts & Messengers',
      whatsappBtn: 'WhatsApp',
      telegramBtn: 'Telegram',
      copyright: '© 2026 Manas Transfer. All rights reserved.',
      paymentHint: 'Cash (KGS / USD), Visa / Mastercard, MBank, and corporate invoicing accepted',
    },
  },
} as const;
