export type BookingStep = 'seats' | 'attendee' | 'payment' | 'confirmation';

export type PaymentMethod = 'upi' | 'card' | 'netbanking';

export interface AttendeeDetails {
  name: string;
  email: string;
  phone: string;
}

export interface SelectedTier {
  tierId: string;
  tierLabel: string;
  quantity: number;
  unitPriceInr: number;
}

export interface BookingState {
  eventId: string;
  step: BookingStep;
  selectedTiers: SelectedTier[];
  attendee: AttendeeDetails | null;
  paymentMethod: PaymentMethod | null;
  upiId: string;
  totalAmountInr: number;
  convenienceFeeInr: number;
}

export interface ConfirmedBooking {
  bookingId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venueName: string;
  attendee: AttendeeDetails;
  selectedTiers: SelectedTier[];
  totalAmountInr: number;
  paymentMethod: PaymentMethod;
  status: 'upcoming' | 'completed' | 'cancelled';
  qrPayload: string;
  bookedAt: string;
}
