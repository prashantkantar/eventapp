'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MOCK_EVENTS } from '@/lib/mock-data/events';
import { applyFilters } from '@/lib/filters';
import { EventFilters } from '@/types/event';
import EventCard from '@/components/discovery/EventCard';
import SearchBar from '@/components/discovery/SearchBar';

export default function SearchPage() {
  const t = useTranslations('search');
  const [query, setQuery] = useState('');

  const DEFAULT_FILTERS: EventFilters = {
    categories: [],
    zone: null,
    date: null,
    timeOfDay: null,
    searchQuery: query,
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return applyFilters(MOCK_EVENTS, { ...DEFAULT_FILTERS, searchQuery: query });
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <SearchBar value={query} onChange={setQuery} />

      {query && (
        <p className="text-sm text-gray-500">
          {results.length > 0
            ? t('results', { count: results.length })
            : t('noResults', { query })}
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {!query && (
        <div className="text-center py-16 text-gray-400 text-sm">
          Start typing to search events, artists, or venues
        </div>
      )}
    </div>
  );
}
