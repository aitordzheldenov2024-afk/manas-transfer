import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, MessageCircle, Send, X } from 'lucide-react';
import {
  Language,
  TRANSLATIONS,
  buildTelegramUrl,
  buildWhatsAppUrl,
} from '../data/transferData';

interface HeaderProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  bookingMessage: string;
}

export function Header({ lang, onChangeLang, bookingMessage }: HeaderProps) {
  const t = TRANSLATIONS[lang];
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setQuickMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQuickMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const whatsappUrl = buildWhatsAppUrl(bookingMessage);
  const telegramUrl = buildTelegramUrl(bookingMessage);

  const navItems = [
    { href: '#fleet', label: t.nav.fleet },
    { href: '#routes', label: t.nav.routes },
    { href: '#how-it-works', label: t.nav.howItWorks },
    { href: '#contacts', label: t.nav.contacts },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-[#041427]/96 backdrop-blur-xl border-b border-white/10 shadow-[0_6px_24px_rgba(4,20,39,0.28)]'
          : 'bg-[#041427]/80 backdrop-blur-md border-b border-white/[0.08]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="text-[17px] font-bold tracking-[0.14em] uppercase text-white hover:text-[#f9e4c8] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a663] rounded-sm"
        >
          {t.brand}
        </a>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-[14px] font-medium text-[#CBD6E4] hover:text-white transition-colors duration-200 whitespace-nowrap shrink-0 py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#c8a663] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a663] rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: EN/RU Switch + Warm Gold Book Now CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            role="group"
            aria-label="Language switch"
            className="flex items-center text-[13px] font-medium text-[#95A7BE]"
          >
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`px-1.5 py-1 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a663] rounded-sm ${
                lang === 'en' ? 'text-white font-bold' : 'hover:text-[#E2EAF4]'
              }`}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
            <span aria-hidden="true" className="text-white/25 select-none">
              /
            </span>
            <button
              type="button"
              onClick={() => onChangeLang('ru')}
              className={`px-1.5 py-1 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a663] rounded-sm ${
                lang === 'ru' ? 'text-white font-bold' : 'hover:text-[#E2EAF4]'
              }`}
              aria-pressed={lang === 'ru'}
            >
              RU
            </button>
          </div>

          {/* Primary Warm Gold Messenger Dropdown CTA */}
          <div ref={dropdownRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setQuickMenuOpen((prev) => !prev)}
              aria-expanded={quickMenuOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-[#041427] bg-[#c8a663] hover:bg-[#b5914d] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9e4c8]"
            >
              <span>{t.nav.quickOrder}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  quickMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {quickMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2.5 w-60 rounded-xl bg-white border border-[#E2E8F0] shadow-xl shadow-[#041427]/20 p-1.5 z-50 text-[#041427]"
              >
                <a
                  role="menuitem"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setQuickMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold text-[#041427] hover:bg-[#F8FAFC] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#c8a663] shrink-0" />
                  <span className="whitespace-nowrap">{t.nav.orderViaWhatsapp}</span>
                </a>
                <a
                  role="menuitem"
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setQuickMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold text-[#041427] hover:bg-[#F8FAFC] transition-colors"
                >
                  <Send className="w-4 h-4 text-[#0f2747] shrink-0" />
                  <span className="whitespace-nowrap">{t.nav.orderViaTelegram}</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#041427] border-b border-white/10 px-5 pt-3 pb-6 shadow-2xl">
          <nav className="flex flex-col mb-5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-[15px] font-medium text-[#E2EAF4] hover:text-[#f9e4c8] border-b border-white/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#c8a663] hover:bg-[#b5914d] text-[#041427] text-[13px] font-bold whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#0f2747] border border-white/15 text-white text-[13px] font-semibold whitespace-nowrap"
            >
              <Send className="w-4 h-4 text-[#f9e4c8]" />
              <span>Telegram</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
