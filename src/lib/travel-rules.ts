import { z } from 'zod';

export const tourSchema = z.object({
  title: z.string().trim().min(1).max(160), destination: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(80), description: z.string().max(6000),
  rules: z.string().max(6000), required_documents: z.string().max(2000),
  starts_at: z.string().datetime(), ends_at: z.string().datetime(),
  capacity: z.number().int().positive(), price: z.number().int().nonnegative(), published: z.boolean(),
}).refine(t => Date.parse(t.ends_at) > Date.parse(t.starts_at), 'پایان سفر باید پس از شروع باشد');
export const bookingSchema = z.object({
  trip: z.string().uuid(), passenger_name: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(1).max(30), remarks: z.string().max(2000),
  documents: z.array(z.string().max(500)).max(10), accept_rules: z.literal(true),
});
export function canOfferTours(status: string) { return status === 'approved'; }
export function canPay(status: string) { return status === 'approved'; }
export function canRate(status: string, endsAt: string, now = Date.now()) { return status === 'paid' && Date.parse(endsAt) <= now; }
export function panelForRoles(roles: string[]) { return roles.includes('admin') ? 'admin' : roles.includes('leader') ? 'leader' : 'tourist'; }