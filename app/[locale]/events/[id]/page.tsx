import { MOCK_EVENTS } from '@/lib/mock-data/events';
import EventDetailClient from '@/components/event-detail/EventDetailClient';

export function generateStaticParams() {
  return MOCK_EVENTS.map((e) => ({ id: e.id }));
}

export default function EventDetailPage() {
  return <EventDetailClient />;
}
