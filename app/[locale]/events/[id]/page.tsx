'use client';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { MapPin, Clock, Calendar, Users, Share2, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { getEventById } from '@/lib/mock-data/events';
import { formatInr, formatIndianDate, formatTime } from '@/lib/format';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function EventDetailPage() {
  const { id, locale } = useParams() as { id: string; locale: string };
  const router = useRouter();
  const t = useTranslations('eventDetail');
  const tCat = useTranslations('categories');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const event = getEventById(id);
  if (!event) {
    return (
      <div className="text-center py-24 text-gray-500">Event not found.</div>
    );
  }

  function localizedTitle() {
    if (locale === 'kn' && event!.titleKn) return event!.titleKn;
    if (locale === 'hi' && event!.titleHi) return event!.titleHi;
    if (locale === 'ta' && event!.titleTa) return event!.titleTa;
    return event!.title;
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(`Check out this event: ${event!.title} — ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  const totalSeats = event.tiers.reduce((s, t) => s + t.availableSeats, 0);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${event.venue.lat},${event.venue.lng}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Hero image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" sizes="(max-width: 720px) 100vw, 720px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          {event.isFeatured && <Badge variant="yellow">Featured</Badge>}
          {event.isSoldOut && <Badge variant="red">{t('soldOut')}</Badge>}
          <Badge variant="purple">{tCat(event.category)}</Badge>
        </div>
      </div>

      {/* Title + price */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{localizedTitle()}</h1>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-violet-600 font-semibold text-lg">
            {event.minPriceInr === 0 ? 'Free' : `From ${formatInr(event.minPriceInr)}`}
          </span>
          {event.organizer.verified && (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              {t('verified')} Organizer
            </span>
          )}
        </div>
      </div>

      {/* Date + venue */}
      <div className="bg-white rounded-2xl p-4 space-y-3 border border-gray-100">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-violet-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">{formatIndianDate(event.date)}</p>
            <p className="text-gray-500 text-sm">{formatTime(event.startTime)} – {formatTime(event.endTime)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-violet-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">{event.venue.name}</p>
            <p className="text-gray-500 text-sm">{event.venue.address}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 text-sm flex items-center gap-1 mt-1 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t('viewOnMaps')}
            </a>
          </div>
        </div>
        {totalSeats > 0 && totalSeats <= 20 && (
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-orange-500 flex-shrink-0" />
            <p className="text-orange-600 text-sm font-medium">{t('seatsLeft', { count: totalSeats })}</p>
          </div>
        )}
      </div>

      {/* About */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-2">{t('about')}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
      </div>

      {/* Ticket tiers */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">{t('ticketTiers')}</h2>
        <div className="space-y-2">
          {event.tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100"
            >
              <div>
                <p className="font-medium text-gray-900 text-sm">{tier.label}</p>
                <p className="text-gray-400 text-xs">{tier.availableSeats} {t('available')}</p>
              </div>
              <span className="font-bold text-gray-900">
                {tier.priceInr === 0 ? 'Free' : formatInr(tier.priceInr)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {event.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3 pb-4">
        {event.isSoldOut ? (
          <Button fullWidth disabled>{t('soldOut')}</Button>
        ) : (
          <Button fullWidth onClick={() => router.push(`/${locale}/book/${event.id}`)}>
            {t('book')}
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => setShowGroupModal(true)}
          className="flex-shrink-0"
        >
          <Users className="h-4 w-4 mr-1.5" />
          Group
        </Button>
        <Button variant="ghost" onClick={handleCopyLink} className="flex-shrink-0">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Group plan modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-4" onClick={() => setShowGroupModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-lg">Plan with Your Group</h3>
            <p className="text-gray-500 text-sm">Share this event with friends and book together.</p>
            <Button fullWidth onClick={handleWhatsApp}>
              Share on WhatsApp
            </Button>
            <Button fullWidth variant="secondary" onClick={handleCopyLink}>
              {copied ? 'Link Copied!' : 'Copy Link'}
            </Button>
            <button onClick={() => setShowGroupModal(false)} className="w-full text-gray-400 text-sm hover:text-gray-600 mt-2">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
