import { EventCategory } from './event';

export type SupportedLocale = 'en' | 'hi' | 'kn' | 'ta';

export interface UserPreferences {
  locale: SupportedLocale;
  interests: EventCategory[];
  savedEventIds: string[];
}
