import { SelectedTier } from '@/types/booking';

const CONVENIENCE_FEE_RATE = 0.03; // 3%

export function calcConvenienceFee(subtotal: number): number {
  return Math.round(subtotal * CONVENIENCE_FEE_RATE);
}

export function calcTotal(tiers: SelectedTier[]): {
  subtotal: number;
  convenienceFee: number;
  total: number;
} {
  const subtotal = tiers.reduce((sum, t) => sum + t.quantity * t.unitPriceInr, 0);
  const convenienceFee = subtotal === 0 ? 0 : calcConvenienceFee(subtotal);
  return { subtotal, convenienceFee, total: subtotal + convenienceFee };
}

export function buildQrPayload(bookingId: string, eventId: string, tiers: SelectedTier[]): string {
  return JSON.stringify({ bookingId, eventId, tiers, ts: Date.now() });
}

export function generateBookingId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BK-${date}-${rand}`;
}
