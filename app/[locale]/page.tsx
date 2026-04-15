'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MOCK_EVENTS } from '@/lib/mock-data/events';
import { applyFilters, sortByDate } from '@/lib/filters';
import { EventFilters } from '@/types/event';
import EventCard from '@/components/discovery/EventCard';
import FilterBar from '@/components/discovery/FilterBar';
import SearchBar from '@/components/discovery/SearchBar';
import Button from '@/components/ui/Button';

const DEFAULT_FILTERS: EventFilters = {
  categories: [],
  zone: null,
  date: null,
  timeOfDay: null,
  searchQuery: '',
};

export default function HomePage() {
  const t = useTranslations('home');
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);

  const events = useMemo(() => {
    return sortByDate(applyFilters(MOCK_EVENTS, filters));
  }, [filters]);

  const featuredEvent = MOCK_EVENTS.find((e) => e.isFeatured);
  const hasActiveFilters =
    filters.categories.length > 0 || filters.zone || filters.date || filters.timeOfDay || filters.searchQuery;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-1 text-sm">{t('subtitle')}</p>
      </div>

      {/* Featured banner */}
      {featuredEvent && filters.categories.length === 0 && !filters.searchQuery && (
        <div
          className="relative rounded-2xl overflow-hidden h-40 md:h-52 bg-cover bg-center flex items-end p-4"
          style={{ backgroundImage: `url(${featuredEvent.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="relative z-10">
            <span className="text-yellow-300 text-xs font-semibold uppercase tracking-wider">{t('featuredBadge')}</span>
            <h2 className="text-white font-bold text-lg leading-tight mt-1">{featuredEvent.title}</h2>
            <p className="text-gray-300 text-sm">{featuredEvent.venue.zone}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <SearchBar
        value={filters.searchQuery}
        onChange={(q) => setFilters((f) => ({ ...f, searchQuery: q }))}
      />

      {/* Filters */}
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Results */}
      {events.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-gray-500">{t('noEvents')}</p>
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
              {t('clearFilters')}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
