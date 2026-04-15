import { MOCK_EVENTS } from '@/lib/mock-data/events';
import BookingClient from '@/components/booking/BookingClient';

export function generateStaticParams() {
  return MOCK_EVENTS.map((e) => ({ id: e.id }));
}

export default function BookingPage() {
  return <BookingClient />;
}
