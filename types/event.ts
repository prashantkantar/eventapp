export type EventCategory =
  | 'Music'
  | 'Comedy'
  | 'Food & Drink'
  | 'Sports'
  | 'Art'
  | 'Theatre'
  | 'Nightlife'
  | 'Kids'
  | 'Wellness';

export type BangaloreZone =
  | 'North Bangalore'
  | 'South Bangalore'
  | 'East Bangalore'
  | 'West Bangalore'
  | 'Central Bangalore';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Venue {
  name: string;
  address: string;
  zone: BangaloreZone;
  lat: number;
  lng: number;
}

export interface Organizer {
  id: string;
  name: string;
  verified: boolean;
}

export interface TicketTier {
  id: string;
  label: string;
  priceInr: number;
  totalSeats: number;
  availableSeats: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  titleKn?: string;
  titleHi?: string;
  titleTa?: string;
  description: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  timeOfDay: TimeOfDay;
  venue: Venue;
  organizer: Organizer;
  imageUrl: string;
  tags: string[];
  isFeatured: boolean;
  isSoldOut: boolean;
  tiers: TicketTier[];
  minPriceInr: number;
}

export interface EventFilters {
  categories: EventCategory[];
  zone: BangaloreZone | null;
  date: string | null;
  timeOfDay: TimeOfDay | null;
  searchQuery: string;
}
