import { Event, EventFilters } from '@/types/event';

export function applyFilters(events: Event[], filters: EventFilters): Event[] {
  return events.filter((event) => {
    if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
      return false;
    }
    if (filters.zone && event.venue.zone !== filters.zone) {
      return false;
    }
    if (filters.date && event.date !== filters.date) {
      return false;
    }
    if (filters.timeOfDay && event.timeOfDay !== filters.timeOfDay) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matches =
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.venue.name.toLowerCase().includes(q) ||
        event.tags.some((t) => t.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });
}

export function sortByDate(events: Event[]): Event[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}
