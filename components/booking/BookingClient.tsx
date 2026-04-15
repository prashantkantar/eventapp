'use client';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, ChevronLeft, Minus, Plus, Smartphone, CreditCard, Building } from 'lucide-react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { getEventById } from '@/lib/mock-data/events';
import { useBookingStore } from '@/store/booking-store';
import { formatInr, formatIndianDate, formatTime } from '@/lib/format';
import { buildQrPayload, generateBookingId } from '@/lib/booking-utils';
import { AttendeeDetails, BookingStep, ConfirmedBooking } from '@/types/booking';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { MOCK_BOOKINGS } from '@/lib/mock-data/bookings';

const STEPS: BookingStep[] = ['seats', 'attendee', 'payment', 'confirmation'];

const attendeeSchema = z.object({
  name: z.string().min(2, 'Enter full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
});

export default function BookingPage() {
  const { id, locale } = useParams() as { id: string; locale: string };
  const router = useRouter();
  const t = useTranslations('booking');
  const store = useBookingStore();
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  const event = getEventById(id);

  useEffect(() => {
    if (event && store.eventId !== id) {
      const firstTier = event.tiers[0];
      store.initBooking(id, firstTier.id, firstTier.label, firstTier.priceInr);
    }
  }, [id, event]);

  const { register, handleSubmit, formState: { errors } } = useForm<AttendeeDetails>({
    resolver: zodResolver(attendeeSchema),
  });

  if (!event) return <div className="text-center py-24 text-gray-500">Event not found.</div>;

  const stepIndex = STEPS.indexOf(store.step);

  // Step indicator
  const stepLabels = [t('step1'), t('step2'), t('step3'), t('step4')];

  function StepIndicator() {
    return (
      <div className="flex items-center justify-between mb-6">
        {STEPS.filter(s => s !== 'confirmation').map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              stepIndex > i ? 'bg-green-500 text-white' : stepIndex === i ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              {stepIndex > i ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`ml-1.5 text-xs hidden sm:block ${stepIndex === i ? 'text-violet-600 font-semibold' : 'text-gray-400'}`}>
              {stepLabels[i]}
            </span>
            {i < 2 && <div className="w-8 sm:w-16 h-0.5 mx-2 bg-gray-200" />}
          </div>
        ))}
      </div>
    );
  }

  // Step 1 — Seat selection
  if (store.step === 'seats') {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
        <StepIndicator />

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-1 text-sm">{event.title}</h2>
          <p className="text-gray-400 text-xs">{formatIndianDate(event.date)} · {formatTime(event.startTime)}</p>
        </div>

        <div className="space-y-3">
          {event.tiers.map((tier) => {
            const selected = store.selectedTiers.find((s) => s.tierId === tier.id);
            const qty = selected?.quantity ?? 0;
            return (
              <div key={tier.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{tier.label}</p>
                  <p className="text-violet-600 font-semibold">{tier.priceInr === 0 ? 'Free' : formatInr(tier.priceInr)}</p>
                  <p className="text-gray-400 text-xs">{tier.availableSeats} available</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => store.updateTierQuantity(tier.id, tier.label, tier.priceInr, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center font-semibold text-gray-900">{qty}</span>
                  <button
                    onClick={() => store.updateTierQuantity(tier.id, tier.label, tier.priceInr, Math.min(qty + 1, tier.availableSeats))}
                    disabled={qty >= tier.availableSeats}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price summary */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatInr(store.totalAmountInr - store.convenienceFeeInr)}</span></div>
          {store.convenienceFeeInr > 0 && (
            <div className="flex justify-between text-gray-500"><span>{t('convenienceFee')}</span><span>{formatInr(store.convenienceFeeInr)}</span></div>
          )}
          <div className="flex justify-between font-bold text-gray-900 border-t pt-2"><span>{t('total')}</span><span>{formatInr(store.totalAmountInr)}</span></div>
        </div>

        <Button
          fullWidth
          size="lg"
          disabled={store.selectedTiers.reduce((s, t) => s + t.quantity, 0) === 0}
          onClick={() => store.setStep('attendee')}
        >
          {t('next')}
        </Button>
      </div>
    );
  }

  // Step 2 — Attendee details
  if (store.step === 'attendee') {
    function onSubmit(data: AttendeeDetails) {
      store.setAttendee(data);
      store.setStep('payment');
    }
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
        <StepIndicator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
            <input {...register('name')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400" placeholder="Arjun Sharma" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <input {...register('email')} type="email" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400" placeholder="arjun@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
            <div className="flex">
              <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-500">+91</span>
              <input {...register('phone')} type="tel" maxLength={10} className="flex-1 px-4 py-2.5 rounded-r-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400" placeholder="9876543210" />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => store.setStep('seats')} type="button">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button fullWidth type="submit">{t('next')}</Button>
          </div>
        </form>
      </div>
    );
  }

  // Step 3 — Payment
  if (store.step === 'payment') {
    const methods = [
      { id: 'upi', label: t('payViaUPI'), icon: Smartphone },
      { id: 'card', label: t('payViaCard'), icon: CreditCard },
      { id: 'netbanking', label: t('payViaNetbanking'), icon: Building },
    ] as const;

    async function handlePay() {
      setProcessing(true);
      await new Promise((r) => setTimeout(r, 1800));
      const bookingId = generateBookingId();
      const qr = buildQrPayload(bookingId, id, store.selectedTiers);
      const booking: ConfirmedBooking = {
        bookingId,
        eventId: id,
        eventTitle: event!.title,
        eventDate: event!.date,
        venueName: event!.venue.name,
        attendee: store.attendee!,
        selectedTiers: store.selectedTiers,
        totalAmountInr: store.totalAmountInr,
        paymentMethod: store.paymentMethod ?? 'upi',
        status: 'upcoming',
        qrPayload: qr,
        bookedAt: new Date().toISOString(),
      };
      MOCK_BOOKINGS.unshift(booking);
      setConfirmed(booking);
      store.setStep('confirmation');
      setProcessing(false);
    }

    return (
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
        <StepIndicator />

        <div className="space-y-3">
          {methods.map(({ id: mid, label, icon: Icon }) => (
            <button
              key={mid}
              onClick={() => store.setPaymentMethod(mid)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-colors ${
                store.paymentMethod === mid ? 'border-violet-600 bg-violet-50' : 'border-gray-100 bg-white hover:border-violet-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${store.paymentMethod === mid ? 'text-violet-600' : 'text-gray-400'}`} />
              <span className={`font-medium ${store.paymentMethod === mid ? 'text-violet-700' : 'text-gray-700'}`}>{label}</span>
              {store.paymentMethod === mid && (
                <CheckCircle className="h-4 w-4 text-violet-600 ml-auto" />
              )}
            </button>
          ))}
        </div>

        {store.paymentMethod === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('upiId')}</label>
            <input
              value={store.upiId}
              onChange={(e) => store.setUpiId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400"
              placeholder={t('upiPlaceholder')}
            />
          </div>
        )}

        <div className="bg-gray-50 rounded-2xl p-4 text-sm">
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total</span><span>{formatInr(store.totalAmountInr)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => store.setStep('attendee')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            fullWidth
            size="lg"
            disabled={!store.paymentMethod || processing}
            onClick={handlePay}
          >
            {processing ? <Spinner size="sm" /> : t('payNow', { amount: store.totalAmountInr === 0 ? '0' : store.totalAmountInr.toLocaleString('en-IN') })}
          </Button>
        </div>
      </div>
    );
  }

  // Step 4 — Confirmation
  if (store.step === 'confirmation' && confirmed) {
    return (
      <div className="max-w-lg mx-auto space-y-6 text-center">
        <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('confirmed')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('bookingId')}: <span className="font-mono font-semibold text-gray-800">{confirmed.bookingId}</span></p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-100">
              <QRCode value={confirmed.qrPayload} size={160} />
            </div>
          </div>
          <p className="text-sm text-gray-500">Show this QR code at the venue</p>

          <div className="text-left space-y-2 border-t pt-4 text-sm text-gray-600">
            <div className="flex justify-between"><span>Event</span><span className="font-medium text-gray-900">{confirmed.eventTitle}</span></div>
            <div className="flex justify-between"><span>Date</span><span className="font-medium text-gray-900">{formatIndianDate(confirmed.eventDate)}</span></div>
            <div className="flex justify-between"><span>Venue</span><span className="font-medium text-gray-900">{confirmed.venueName}</span></div>
            <div className="flex justify-between"><span>Attendee</span><span className="font-medium text-gray-900">{confirmed.attendee.name}</span></div>
            <div className="flex justify-between"><span>Total Paid</span><span className="font-bold text-violet-600">{confirmed.totalAmountInr === 0 ? 'Free' : formatInr(confirmed.totalAmountInr)}</span></div>
          </div>
        </div>

        <div className="space-y-3">
          <Button fullWidth onClick={() => { store.reset(); router.push(`/${locale}/bookings`); }}>
            {t('viewBookings')}
          </Button>
          <Button fullWidth variant="secondary" onClick={() => { store.reset(); router.push(`/${locale}`); }}>
            {t('goHome')}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
