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
          ? 'bg-[#080D18]/92 backdrop-blur-xl border-b border-[#9EC0F5]/[0.12]'
          : 'bg-gradient-to-b from-[#080D18]/85 via-[#080D18]/45 to-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="text-[17px] font-semibold tracking-[0.14em] uppercase text-[#F2F6FC] hover:text-[#C9AA6E] transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E]/70 rounded-sm"
        >
          {t.brand}
        </a>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-[14px] font-medium text-[#A9BAD3] hover:text-[#F2F6FC] transition-colors duration-200 whitespace-nowrap shrink-0 py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-[#C9AA6E] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E]/70 rounded-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: EN/RU Switch + Primary Messenger Action */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            role="group"
            aria-label="Language switch"
            className="flex items-center text-[13px] font-medium text-[#7D91AE]"
          >
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`px-1.5 py-1 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E]/70 rounded-sm ${
                lang === 'en' ? 'text-[#F2F6FC] font-semibold' : 'hover:text-[#D1DDF0]'
              }`}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
            <span aria-hidden="true" className="text-[#9EC0F5]/25 select-none">
              /
            </span>
            <button
              type="button"
              onClick={() => onChangeLang('ru')}
              className={`px-1.5 py-1 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E]/70 rounded-sm ${
                lang === 'ru' ? 'text-[#F2F6FC] font-semibold' : 'hover:text-[#D1DDF0]'
              }`}
              aria-pressed={lang === 'ru'}
            >
              RU
            </button>
          </div>

          {/* Primary Messenger Dropdown CTA */}
          <div ref={dropdownRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setQuickMenuOpen((prev) => !prev)}
              aria-expanded={quickMenuOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#080D18] bg-[#E5EEFA] hover:bg-[#C9AA6E] rounded-lg transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9AA6E]"
            >
              <span>{t.nav.quickOrder}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  quickMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {quickMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2.5 w-60 rounded-xl glass-navy-panel shadow-2xl shadow-black/60 p-1.5 z-50"
              >
                <a
                  role="menuitem"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setQuickMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-[#EDF2FA] hover:bg-[#9EC0F5]/10 transition-colors duration-150"
                >
                  <MessageCircle className="w-4 h-4 text-[#C9AA6E] shrink-0" />
                  <span className="whitespace-nowrap">{t.nav.orderViaWhatsapp}</span>
                </a>
                <a
                  role="menuitem"
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setQuickMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-[#EDF2FA] hover:bg-[#9EC0F5]/10 transition-colors duration-150"
                >
                  <Send className="w-4 h-4 text-[#7CB7FF] shrink-0" />
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
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#EDF2FA] hover:bg-[#9EC0F5]/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1221]/98 backdrop-blur-2xl border-b border-[#9EC0F5]/[0.12] px-5 pt-3 pb-6">
          <nav className="flex flex-col mb-5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-[15px] font-medium text-[#DCE6F5] hover:text-[#C9AA6E] border-b border-[#9EC0F5]/[0.08] transition-colors"
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
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#C9AA6E] text-[#080D18] text-[13px] font-semibold whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#142038] border border-[#9EC0F5]/[0.15] text-[#EDF2FA] text-[13px] font-semibold whitespace-nowrap"
            >
              <Send className="w-4 h-4 text-[#7CB7FF]" />
              <span>Telegram</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
