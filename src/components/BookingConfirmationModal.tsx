import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CarFront,
  Check,
  CheckCircle2,
  Copy,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import {
  CONTACT_INFO,
  ConfirmedBooking,
  Language,
  TRANSLATIONS,
  formatKgs,
} from '../data/transferData';

interface BookingConfirmationModalProps {
  lang: Language;
  booking: ConfirmedBooking | null;
  onClose: () => void;
}

export function BookingConfirmationModal({
  lang,
  booking,
  onClose,
}: BookingConfirmationModalProps) {
  const t = TRANSLATIONS[lang].modal;
  const bLabels = TRANSLATIONS[lang].booking;
  const [copied, setCopied] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setCopied(false);
    setImgFailed(false);
  }, [booking?.reference]);

  useEffect(() => {
    if (!booking) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [booking, onClose]);

  const getOptionsList = (b: ConfirmedBooking): string => {
    const selected: string[] = [];
    if (b.meetWithSign) selected.push(bLabels.optionSign);
    if (b.childSeat) selected.push(bLabels.optionChildSeat);
    return selected.length > 0 ? selected.join(', ') : t.optionsNone;
  };

  const buildSummaryText = (b: ConfirmedBooking) => {
    if (lang === 'ru') {
      return [
        CONTACT_INFO.whatsappDefaultText,
        '',
        `Заявка: ${b.reference}`,
        `Маршрут: ${b.fromLabel} → ${b.toLabel}`,
        `Дата и время: ${b.date} в ${b.time}`,
        `Рейс: ${b.flightNumber || 'не указан'}`,
        `Тариф: ${b.tariff.name.ru}`,
        `Автомобиль: ${b.vehicle.name}`,
        `Опции: ${getOptionsList(b)}`,
        `Пассажир: ${b.passengerName} (${b.contact})`,
        `Стоимость: $${b.priceUsd} (${formatKgs(b.priceKgs)} сом)`,
      ].join('\n');
    }
    return [
      CONTACT_INFO.whatsappDefaultText,
      '',
      `Booking ID: ${b.reference}`,
      `Route: ${b.fromLabel} → ${b.toLabel}`,
      `Date & time: ${b.date} at ${b.time}`,
      `Flight: ${b.flightNumber || 'not specified'}`,
      `Tariff: ${b.tariff.name.en}`,
      `Vehicle: ${b.vehicle.name}`,
      `Options: ${getOptionsList(b)}`,
      `Passenger: ${b.passengerName} (${b.contact})`,
      `Fixed fare: $${b.priceUsd} (${formatKgs(b.priceKgs)} KGS)`,
    ].join('\n');
  };

  const handleCopy = async () => {
    if (!booking) return;
    try {
      await navigator.clipboard.writeText(buildSummaryText(booking));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {booking && (
        <motion.div
          key="booking-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#040812]/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[#0D1628] border border-[#9EC0F5]/[0.16] shadow-[0_32px_90px_rgba(0,0,0,0.75)] overflow-hidden max-h-[92vh] flex flex-col text-[#EDF2FA]"
          >
            {/* Header */}
            <div className="p-6 pb-5 border-b border-[#9EC0F5]/[0.12] flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-[13px] font-medium text-[#C9AA6E] mb-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t.statusLabel}</span>
                </div>
                <h2
                  id="booking-modal-title"
                  className="text-[22px] font-semibold tracking-[-0.015em] text-[#F5F8FD]"
                >
                  {t.title}
                </h2>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-[#96AAC6]">{t.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close confirmation dialog"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#8398B8] hover:text-[#F5F8FD] hover:bg-[#9EC0F5]/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Selected Vehicle Preview */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#121F38] border border-[#9EC0F5]/[0.12]">
                <div className="w-24 aspect-[4/3] rounded-lg overflow-hidden bg-[#182744] shrink-0">
                  {!imgFailed ? (
                    <img
                      src={booking.vehicle.image}
                      alt={booking.vehicle.name}
                      referrerPolicy="no-referrer"
                      onError={() => setImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C9AA6E]">
                      <CarFront className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] text-[#8EA4C4]">
                    {t.referenceLabel}:{' '}
                    <span className="font-mono text-[#F5F8FD]">{booking.reference}</span>
                  </div>
                  <div className="text-[16px] font-semibold text-[#F5F8FD] truncate">
                    {booking.vehicle.name}
                  </div>
                  <div className="text-[12px] text-[#C9AA6E] truncate">
                    {booking.tariff.name[lang]}
                  </div>
                </div>
              </div>

              {/* Structured Summary */}
              <dl className="space-y-2.5 text-[14px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8398B8] shrink-0">{t.routeLabel}</dt>
                  <dd className="text-[#F5F8FD] font-medium text-right">
                    {booking.fromLabel} → {booking.toLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8398B8] shrink-0">{t.dateTimeLabel}</dt>
                  <dd className="text-[#F5F8FD] font-mono tabular-nums text-right">
                    {booking.date} · {booking.time}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8398B8] shrink-0">{t.flightLabel}</dt>
                  <dd className="text-[#F5F8FD] font-mono text-right">
                    {booking.flightNumber || t.flightEmpty}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8398B8] shrink-0">{t.optionsLabel}</dt>
                  <dd className="text-[#F5F8FD] text-right">{getOptionsList(booking)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8398B8] shrink-0">{t.passengerLabel}</dt>
                  <dd className="text-[#F5F8FD] text-right">{booking.passengerName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8398B8] shrink-0">{t.contactLabel}</dt>
                  <dd className="text-[#F5F8FD] font-mono text-right">{booking.contact}</dd>
                </div>
                <div className="pt-3 mt-1 border-t border-[#9EC0F5]/[0.12] flex items-baseline justify-between gap-4">
                  <dt className="text-[#C8D6EA] font-medium">{t.totalLabel}</dt>
                  <dd className="font-mono tabular-nums text-right">
                    <span className="text-[20px] font-semibold text-[#F5F8FD]">
                      ${booking.priceUsd}
                    </span>{' '}
                    <span className="text-[13px] text-[#C9AA6E]">
                      / {formatKgs(booking.priceKgs)} {bLabels.som}
                    </span>
                  </dd>
                </div>
              </dl>

              {/* Actions */}
              <div className="pt-2 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(
                      buildSummaryText(booking)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#C9AA6E] hover:bg-[#D8BC83] text-[#080D18] text-[13px] font-bold transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{t.sendWhatsapp}</span>
                  </a>
                  <a
                    href={`https://t.me/${CONTACT_INFO.telegramHandle}?text=${encodeURIComponent(
                      buildSummaryText(booking)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#152440] hover:bg-[#1D3054] border border-[#9EC0F5]/[0.16] text-[#F5F8FD] text-[13px] font-semibold transition-colors whitespace-nowrap"
                  >
                    <Send className="w-4 h-4 shrink-0 text-[#7CB7FF]" />
                    <span>{t.sendTelegram}</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[#96AAC6] hover:text-[#F5F8FD] hover:bg-[#9EC0F5]/10 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#C9AA6E]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copied ? t.copiedBtn : t.copyBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg text-[13px] font-semibold text-[#E6EFFB] hover:bg-[#9EC0F5]/10 transition-colors cursor-pointer"
                  >
                    {t.closeBtn}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
