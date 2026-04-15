'use client';
import { create } from 'zustand';
import { BookingState, BookingStep, AttendeeDetails, PaymentMethod, SelectedTier } from '@/types/booking';
import { calcTotal } from '@/lib/booking-utils';

interface BookingStore extends BookingState {
  initBooking: (eventId: string, firstTierId: string, firstTierLabel: string, firstTierPrice: number) => void;
  setStep: (step: BookingStep) => void;
  updateTierQuantity: (tierId: string, tierLabel: string, unitPrice: number, quantity: number) => void;
  setAttendee: (attendee: AttendeeDetails) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setUpiId: (id: string) => void;
  reset: () => void;
}

const DEFAULT_STATE: BookingState = {
  eventId: '',
  step: 'seats',
  selectedTiers: [],
  attendee: null,
  paymentMethod: null,
  upiId: '',
  totalAmountInr: 0,
  convenienceFeeInr: 0,
};

export const useBookingStore = create<BookingStore>((set) => ({
  ...DEFAULT_STATE,

  initBooking: (eventId, firstTierId, firstTierLabel, firstTierPrice) => {
    const tiers: SelectedTier[] = [{ tierId: firstTierId, tierLabel: firstTierLabel, quantity: 1, unitPriceInr: firstTierPrice }];
    const { convenienceFee, total } = calcTotal(tiers);
    set({ ...DEFAULT_STATE, eventId, selectedTiers: tiers, convenienceFeeInr: convenienceFee, totalAmountInr: total });
  },

  setStep: (step) => set({ step }),

  updateTierQuantity: (tierId, tierLabel, unitPrice, quantity) =>
    set((state) => {
      let tiers = state.selectedTiers.filter((t) => t.tierId !== tierId);
      if (quantity > 0) {
        tiers = [...tiers, { tierId, tierLabel, quantity, unitPriceInr: unitPrice }];
      }
      const { convenienceFee, total } = calcTotal(tiers);
      return { selectedTiers: tiers, convenienceFeeInr: convenienceFee, totalAmountInr: total };
    }),

  setAttendee: (attendee) => set({ attendee }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setUpiId: (id) => set({ upiId: id }),
  reset: () => set(DEFAULT_STATE),
}));
