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
  ConfirmedBooking,
  Language,
  TRANSLATIONS,
  buildTelegramUrl,
  buildWhatsAppUrl,
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
  }, [booking?.reference, booking?.vehicle.image]);

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
    if (b.childSeatCount > 0) {
      selected.push(`${bLabels.optionChildSeat}: ${b.childSeatCount}`);
    }
    return selected.length > 0 ? selected.join(', ') : t.optionsNone;
  };

  const buildSummaryText = (b: ConfirmedBooking) => {
    const carLabel = `${b.vehicle.name[lang]} (${b.vehicle.models})`;
    const priceLabel = `$${b.priceUsd} / ${formatKgs(b.priceKgs)} ${bLabels.som}`;
    const dateTimeLabel = [b.date, b.time].filter(Boolean).join(', ');
    const hotel = b.hotelAddress.trim();
    const flight = b.flightNumber.trim();

    const lines = [
      'Hello! I would like to book a transfer from Manas Airport (BSZ).',
      `Route: ${b.fromLabel} -> ${b.toLabel}`,
    ];

    if (hotel) {
      lines.push(`Hotel / Address: ${hotel}`);
    }

    lines.push(`Car: ${carLabel} (${priceLabel})`);

    if (b.childSeatCount > 0) {
      lines.push(`Child seat: ${b.childSeatCount}`);
    }

    lines.push(`Date & Time: ${dateTimeLabel}`);

    if (flight) {
      lines.push(`Flight number: ${flight}`);
    }

    lines.push('Please send me the payment link/QR to confirm.');
    return lines.join('\n');
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#041427]/75 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_28px_80px_rgba(4,20,39,0.38)] overflow-hidden max-h-[92vh] flex flex-col text-[#041427]"
          >
            {/* Executive Navy Header */}
            <div className="p-6 pb-5 bg-[#041427] text-white flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#f9e4c8] text-[#041427] text-[11px] font-bold uppercase tracking-[0.04em] mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.statusLabel}</span>
                </div>
                <h2
                  id="booking-modal-title"
                  className="text-[22px] font-extrabold tracking-[-0.015em] text-white"
                >
                  {t.title}
                </h2>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-[#CBD5E1]">{t.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close confirmation dialog"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 bg-[#FFFFFF]">
              {/* Selected Vehicle Preview */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="w-24 aspect-[4/3] rounded-lg overflow-hidden bg-[#FFFFFF] border border-[#E2E8F0] shrink-0">
                  {!imgFailed ? (
                    <img
                      src={booking.vehicle.image}
                      alt={booking.vehicle.name[lang]}
                      referrerPolicy="no-referrer"
                      onError={() => setImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#0f2747]">
                      <CarFront className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[11px] text-[#64748B]">
                      {t.referenceLabel}:{' '}
                      <span className="font-mono font-bold text-[#041427]">
                        {booking.reference}
                      </span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#f9e4c8] text-[#041427] text-[10px] font-bold shrink-0">
                      {booking.vehicle.badge[lang]}
                    </span>
                  </div>
                  <div className="text-[16px] font-bold text-[#041427] truncate">
                    {booking.vehicle.name[lang]}
                  </div>
                  <div className="text-[12px] text-[#475569] truncate">
                    {booking.vehicle.models}
                  </div>
                </div>
              </div>

              {/* Structured Summary */}
              <dl className="space-y-2.5 text-[14px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#64748B] shrink-0">{t.routeLabel}</dt>
                  <dd className="text-[#041427] font-semibold text-right">
                    {booking.fromLabel} → {booking.toLabel}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#64748B] shrink-0">{t.hotelLabel}</dt>
                  <dd className="text-[#041427] font-medium text-right">
                    {booking.hotelAddress || t.hotelEmpty}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#64748B] shrink-0">{t.dateTimeLabel}</dt>
                  <dd className="text-[#041427] font-mono font-medium tabular-nums text-right">
                    {booking.date} · {booking.time}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#64748B] shrink-0">{t.flightLabel}</dt>
                  <dd className="text-[#041427] font-mono text-right">
                    {booking.flightNumber || t.flightEmpty}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#64748B] shrink-0">{t.optionsLabel}</dt>
                  <dd className="text-[#041427] text-right">{getOptionsList(booking)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#64748B] shrink-0">{t.passengerLabel}</dt>
                  <dd className="text-[#041427] font-medium text-right">{booking.passengerName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#64748B] shrink-0">{t.contactLabel}</dt>
                  <dd className="text-[#041427] font-mono text-right">{booking.contact}</dd>
                </div>
                <div className="pt-3.5 mt-1 border-t border-[#E2E8F0] flex items-baseline justify-between gap-4">
                  <dt className="text-[#041427] font-bold">{t.totalLabel}</dt>
                  <dd className="font-mono tabular-nums text-right">
                    <span className="text-[22px] font-extrabold text-[#041427]">
                      ${booking.priceUsd}
                    </span>{' '}
                    <span className="text-[14px] font-bold text-[#0f2747]">
                      / {formatKgs(booking.priceKgs)} {bLabels.som}
                    </span>
                  </dd>
                </div>
              </dl>

              {/* Actions */}
              <div className="pt-2 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={buildWhatsAppUrl(buildSummaryText(booking))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#c8a663] hover:bg-[#b5914d] text-[#041427] text-[13px] font-bold shadow-[0_6px_18px_rgba(200,166,99,0.28)] transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{t.sendWhatsapp}</span>
                  </a>
                  <a
                    href={buildTelegramUrl(buildSummaryText(booking))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0f2747] hover:bg-[#041427] text-white text-[13px] font-semibold transition-colors whitespace-nowrap"
                  >
                    <Send className="w-4 h-4 shrink-0 text-[#f9e4c8]" />
                    <span>{t.sendTelegram}</span>
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-[#475569] hover:text-[#041427] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#b5914d]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copied ? t.copiedBtn : t.copyBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg text-[13px] font-semibold text-[#0f2747] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
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
