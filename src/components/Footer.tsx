import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import {
  CONTACT_INFO,
  Language,
  TRANSLATIONS,
  buildTelegramUrl,
  buildWhatsAppUrl,
} from '../data/transferData';

interface FooterProps {
  lang: Language;
  bookingMessage: string;
}

export function Footer({ lang, bookingMessage }: FooterProps) {
  const t = TRANSLATIONS[lang];

  const whatsappUrl = buildWhatsAppUrl(bookingMessage);
  const telegramUrl = buildTelegramUrl(bookingMessage);

  return (
    <footer
      id="contacts"
      className="scroll-mt-20 bg-[#041427] text-white border-t border-[#0f2747]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Column 1: Brand & Hours */}
          <div className="lg:col-span-5 space-y-5">
            <a
              href="#top"
              className="inline-block text-[18px] font-extrabold tracking-[0.14em] uppercase text-white"
            >
              {t.brand}
            </a>
            <p className="text-[14px] leading-[1.65] text-[#CBD5E1] max-w-sm">{t.footer.about}</p>
            <div className="space-y-2.5 pt-1 text-[13px] text-[#E2E8F0]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#c8a663] mt-0.5 shrink-0" />
                <span>
                  <strong className="font-semibold text-white">{t.footer.hoursTitle}:</strong>{' '}
                  {t.footer.hoursValue}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#f9e4c8] mt-0.5 shrink-0" />
                <span>{t.footer.locationValue}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-3">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#f9e4c8] mb-4">
              {t.footer.navTitle}
            </h3>
            <ul className="space-y-2.5 text-[14px] text-[#CBD5E1]">
              <li>
                <a href="#fleet" className="hover:text-white transition-colors">
                  {t.nav.fleet}
                </a>
              </li>
              <li>
                <a href="#routes" className="hover:text-white transition-colors">
                  {t.nav.routes}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  {t.nav.howItWorks}
                </a>
              </li>
              <li>
                <a href="#booking-form" className="hover:text-white transition-colors">
                  {t.howItWorks.ctaBtn}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Contacts & Messengers */}
          <div className="lg:col-span-4">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#f9e4c8] mb-4">
              {t.footer.contactsTitle}
            </h3>
            <div className="space-y-3 mb-6">
              <a
                href={CONTACT_INFO.phoneHref}
                className="flex items-center gap-2.5 text-[17px] font-mono tabular-nums font-semibold text-white hover:text-[#c8a663] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#c8a663] shrink-0" />
                <span>{CONTACT_INFO.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2.5 text-[14px] text-[#CBD5E1] hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#f9e4c8] shrink-0" />
                <span>{CONTACT_INFO.email}</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c8a663] hover:bg-[#b5914d] text-[#041427] text-[13px] font-bold transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{t.footer.whatsappBtn}</span>
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0f2747] hover:bg-[#17365e] border border-white/15 text-white text-[13px] font-semibold transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4 shrink-0 text-[#f9e4c8]" />
                <span>{t.footer.telegramBtn}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-[#94A3B8]">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.paymentHint}</p>
        </div>
      </div>
    </footer>
  );
}
