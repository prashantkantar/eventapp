'use client';
import { useTranslations } from 'next-intl';
import { EventCategory, BangaloreZone, EventFilters } from '@/types/event';
import { clsx } from 'clsx';

const CATEGORIES: EventCategory[] = [
  'Music', 'Comedy', 'Food & Drink', 'Sports', 'Art', 'Theatre', 'Nightlife', 'Kids', 'Wellness',
];

const ZONES: BangaloreZone[] = [
  'North Bangalore', 'South Bangalore', 'East Bangalore', 'West Bangalore', 'Central Bangalore',
];

interface FilterBarProps {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const t = useTranslations('filters');
  const tCat = useTranslations('categories');
  const tZone = useTranslations('zones');

  function toggleCategory(cat: EventCategory) {
    const categories = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories });
  }

  return (
    <div className="space-y-3">
      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => onChange({ ...filters, categories: [] })}
          className={clsx(
            'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
            filters.categories.length === 0
              ? 'bg-violet-600 text-white border-violet-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
          )}
        >
          {t('allCategories')}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={clsx(
              'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
              filters.categories.includes(cat)
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
            )}
          >
            {tCat(cat)}
          </button>
        ))}
      </div>

      {/* Zone + Date row */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        <select
          value={filters.zone ?? ''}
          onChange={(e) => onChange({ ...filters, zone: (e.target.value as BangaloreZone) || null })}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-violet-400 cursor-pointer"
        >
          <option value="">{t('allZones')}</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>{tZone(z)}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date ?? ''}
          onChange={(e) => onChange({ ...filters, date: e.target.value || null })}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-violet-400 cursor-pointer"
        />

        <select
          value={filters.timeOfDay ?? ''}
          onChange={(e) => onChange({ ...filters, timeOfDay: (e.target.value as EventFilters['timeOfDay']) || null })}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-violet-400 cursor-pointer"
        >
          <option value="">{t('anyTime')}</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </div>
    </div>
  );
}
