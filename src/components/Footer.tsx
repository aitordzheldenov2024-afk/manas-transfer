import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { CONTACT_INFO, Language, TRANSLATIONS } from '../data/transferData';

interface FooterProps {
  lang: Language;
}

export function Footer({ lang }: FooterProps) {
  const t = TRANSLATIONS[lang];

  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(
    lang === 'ru'
      ? 'Здравствуйте! Хочу узнать цену и заказать трансфер из аэропорта Манас.'
      : 'Hello! I would like to book a transfer from Manas Airport (FRU).'
  )}`;
  const telegramUrl = `https://t.me/${CONTACT_INFO.telegramHandle}`;

  return (
    <footer
      id="contacts"
      className="scroll-mt-20 border-t border-[#9EC0F5]/[0.1] bg-[#060A14] text-[#EDF2FA]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#9EC0F5]/[0.09]">
          {/* Column 1: Brand & Hours */}
          <div className="lg:col-span-5 space-y-5">
            <a
              href="#top"
              className="inline-block text-[18px] font-semibold tracking-[0.14em] uppercase text-[#F5F8FD]"
            >
              {t.brand}
            </a>
            <p className="text-[14px] leading-[1.65] text-[#8EA4C4] max-w-sm">{t.footer.about}</p>
            <div className="space-y-2.5 pt-1 text-[13px] text-[#C8D6EA]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C9AA6E] mt-0.5 shrink-0" />
                <span>
                  <strong className="font-medium text-[#F5F8FD]">{t.footer.hoursTitle}:</strong>{' '}
                  {t.footer.hoursValue}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#7D93B4] mt-0.5 shrink-0" />
                <span>{t.footer.locationValue}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-3">
            <h3 className="text-[13px] font-semibold text-[#F5F8FD] mb-4">{t.footer.navTitle}</h3>
            <ul className="space-y-2.5 text-[14px] text-[#8EA4C4]">
              <li>
                <a href="#fleet" className="hover:text-[#F5F8FD] transition-colors">
                  {t.nav.fleet}
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-[#F5F8FD] transition-colors">
                  {t.nav.routes}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#F5F8FD] transition-colors">
                  {t.nav.howItWorks}
                </a>
              </li>
              <li>
                <a href="#booking-form" className="hover:text-[#F5F8FD] transition-colors">
                  {t.howItWorks.ctaBtn}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Contacts & Messengers */}
          <div className="lg:col-span-4">
            <h3 className="text-[13px] font-semibold text-[#F5F8FD] mb-4">
              {t.footer.contactsTitle}
            </h3>
            <div className="space-y-3 mb-6">
              <a
                href={CONTACT_INFO.phoneHref}
                className="flex items-center gap-2.5 text-[17px] font-mono tabular-nums font-medium text-[#F5F8FD] hover:text-[#C9AA6E] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C9AA6E] shrink-0" />
                <span>{CONTACT_INFO.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2.5 text-[14px] text-[#8EA4C4] hover:text-[#F5F8FD] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#7D93B4] shrink-0" />
                <span>{CONTACT_INFO.email}</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C9AA6E] hover:bg-[#D8BC83] text-[#080D18] text-[13px] font-semibold transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{t.footer.whatsappBtn}</span>
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#142038] hover:bg-[#1B2C4D] border border-[#9EC0F5]/[0.16] text-[#F5F8FD] text-[13px] font-semibold transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4 shrink-0 text-[#7CB7FF]" />
                <span>{t.footer.telegramBtn}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-[#687D9C]">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.paymentHint}</p>
        </div>
      </div>
    </footer>
  );
}
