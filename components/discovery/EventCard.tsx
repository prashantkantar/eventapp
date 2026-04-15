'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Clock, Users } from 'lucide-react';
import { Event } from '@/types/event';
import { formatInr, formatDateShort, formatTime } from '@/lib/format';
import Badge from '@/components/ui/Badge';

interface EventCardProps {
  event: Event;
}

function localizedTitle(event: Event, locale: string): string {
  if (locale === 'kn' && event.titleKn) return event.titleKn;
  if (locale === 'hi' && event.titleHi) return event.titleHi;
  if (locale === 'ta' && event.titleTa) return event.titleTa;
  return event.title;
}

export default function EventCard({ event }: EventCardProps) {
  const locale = useLocale();
  const t = useTranslations('home');
  const tCat = useTranslations('categories');

  const seatsLeft = event.tiers.reduce((sum, t) => sum + t.availableSeats, 0);
  const isLowSeats = seatsLeft > 0 && seatsLeft <= 10;

  return (
    <Link
      href={`/${locale}/events/${event.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col border border-gray-100"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {event.isFeatured && <Badge variant="yellow">{t('featuredBadge')}</Badge>}
          {event.isSoldOut && <Badge variant="red">{t('soldOut')}</Badge>}
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="purple">{tCat(event.category)}</Badge>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-bold text-gray-900">
          {event.minPriceInr === 0 ? t('free') : `${t('from')} ${formatInr(event.minPriceInr)}`}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors">
          {localizedTitle(event, locale)}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{formatDateShort(event.date)}, {formatTime(event.startTime)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{event.venue.name}</span>
        </div>

        {isLowSeats && (
          <div className="flex items-center gap-1.5 text-orange-500 text-xs font-medium">
            <Users className="h-3.5 w-3.5" />
            {t('seatsLeft', { count: seatsLeft })}
          </div>
        )}
      </div>
    </Link>
  );
}
