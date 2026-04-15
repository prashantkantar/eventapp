'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Calendar, MapPin, QrCode, Ticket } from 'lucide-react';
import { MOCK_BOOKINGS } from '@/lib/mock-data/bookings';
import { formatInr, formatIndianDate } from '@/lib/format';
import { ConfirmedBooking } from '@/types/booking';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { clsx } from 'clsx';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

export default function BookingsPage() {
  const t = useTranslations('bookings');
  const locale = useLocale();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bookings = MOCK_BOOKINGS.filter((b) => b.status === tab || (tab === 'past' && b.status === 'completed'));
  const upcoming = MOCK_BOOKINGS.filter((b) => b.status === 'upcoming');
  const past = MOCK_BOOKINGS.filter((b) => b.status !== 'upcoming');

  const displayed = tab === 'upcoming' ? upcoming : past;

  function BookingCard({ booking }: { booking: ConfirmedBooking }) {
    const isExpanded = expandedId === booking.bookingId;
    const statusVariant = booking.status === 'upcoming' ? 'green' : booking.status === 'cancelled' ? 'red' : 'gray';

    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setExpandedId(isExpanded ? null : booking.bookingId)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={statusVariant}>{t(`status.${booking.status}`)}</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{booking.eventTitle}</h3>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                {formatIndianDate(booking.eventDate)}
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{booking.venueName}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-gray-900">{booking.totalAmountInr === 0 ? 'Free' : formatInr(booking.totalAmountInr)}</p>
              <p className="text-xs text-gray-400 font-mono">{booking.bookingId}</p>
              <QrCode className="h-4 w-4 text-violet-400 ml-auto mt-1" />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <QRCode value={booking.qrPayload} size={140} />
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {booking.selectedTiers.map((tier) => (
                <div key={tier.tierId} className="flex justify-between">
                  <span>{tier.tierLabel} × {tier.quantity}</span>
                  <span className="font-medium text-gray-900">{tier.unitPriceInr === 0 ? 'Free' : formatInr(tier.unitPriceInr * tier.quantity)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center">Show QR code at the venue</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {(['upcoming', 'past'] as const).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={clsx(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              tab === tabKey ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {t(tabKey)}
          </button>
        ))}
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Ticket className="h-12 w-12 text-gray-200 mx-auto" />
          <p className="text-gray-400">{tab === 'upcoming' ? t('noUpcoming') : t('noPast')}</p>
          <Link href={`/${locale}`}>
            <Button variant="secondary">{t('browseEvents')}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((b) => (
            <BookingCard key={b.bookingId} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
