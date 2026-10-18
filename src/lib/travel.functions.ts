import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { z } from 'zod';
import { bookingSchema, tourSchema } from './travel-rules';

export const publicCatalog = createServerFn({ method: 'GET' }).handler(async () => {
  const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('اطلاعات سرویس در دسترس نیست');
  const db = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey', key); return fetch(input, { ...init, headers }); } } });
  const [tours, leaders, media, reviews] = await Promise.all([db.from('tours').select('*').order('starts_at'), db.from('leader_profiles').select('user_id,display_name,bio,status'), db.from('leader_media').select('*'), db.from('reviews').select('id,leader_id,rating,comment,created_at')]);
  for (const r of [tours, leaders, media, reviews]) if (r.error) throw new Error(r.error.message);
  const files = await Promise.all((media.data ?? []).map(async m => { const { data } = await db.storage.from('leader-media').createSignedUrl(m.path, 600); return { ...m, url: data?.signedUrl ?? '' }; }));
  return { tours: tours.data ?? [], leaders: leaders.data ?? [], media: files, reviews: reviews.data ?? [] };
});

export const panelData = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const db = context.supabase;
  const [profile, roles, leaders, tours, bookings, media, reviews, favorites] = await Promise.all([
    db.from('profiles').select('*').eq('id', context.userId).single(), db.from('user_roles').select('role').eq('user_id', context.userId),
    db.from('leader_profiles').select('*'), db.from('tours').select('*').order('starts_at'),
    db.from('bookings').select('*').order('created_at', { ascending: false }), db.from('leader_media').select('*'), db.from('reviews').select('*'), db.from('favorites').select('*'),
  ]);
  for (const r of [profile, roles, leaders, tours, bookings, media, reviews, favorites]) if (r.error) throw new Error(r.error.message);
  return { userId: context.userId, profile: profile.data, roles: (roles.data ?? []).map(r => r.role), leaders: leaders.data ?? [], tours: tours.data ?? [], bookings: bookings.data ?? [], media: media.data ?? [], reviews: reviews.data ?? [], favorites: favorites.data ?? [] };
});

const actionSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('apply') }),
  z.object({ kind: z.literal('profile'), display_name: z.string().trim().min(1).max(100), phone: z.string().max(30), bio: z.string().max(4000) }),
  z.object({ kind: z.literal('tour'), tour: tourSchema }),
  z.object({ kind: z.literal('publish'), id: z.string().uuid(), published: z.boolean() }),
  z.object({ kind: z.literal('book'), booking: bookingSchema }),
  z.object({ kind: z.literal('decide'), id: z.string().uuid(), decision: z.enum(['approved','rejected']) }),
  z.object({ kind: z.literal('reviewLeader'), id: z.string().uuid(), decision: z.enum(['approved','suspended','revoked']) }),
  z.object({ kind: z.literal('rate'), id: z.string().uuid(), rating: z.number().int().min(1).max(5), comment: z.string().max(2000) }),
  z.object({ kind: z.literal('favorite'), id: z.string().uuid(), remove: z.boolean() }),
  z.object({ kind: z.literal('media'), path: z.string().max(500), mediaKind: z.enum(['image','video']), caption: z.string().max(300), tour_id: z.string().uuid().nullable(), visible: z.boolean() }),
  z.object({ kind: z.literal('mediaVisibility'), id: z.string().uuid(), visible: z.boolean() }),
]);
export type TravelAction = z.infer<typeof actionSchema>;
export const travelAction = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((v: TravelAction) => actionSchema.parse(v)).handler(async ({ data, context }) => {
  const db = context.supabase; let result;
  switch (data.kind) {
    case 'apply': result = await db.rpc('apply_as_leader'); break;
    case 'profile': {
      result = await db.from('profiles').update({ display_name: data.display_name, phone: data.phone }).eq('id', context.userId);
      if (result.error) break;
      result = await db.from('leader_profiles').update({ display_name: data.display_name, bio: data.bio }).eq('user_id', context.userId); break;
    }
    case 'tour': result = await db.from('tours').insert({ ...data.tour, leader_id: context.userId }); break;
    case 'publish': result = await db.from('tours').update({ published: data.published }).eq('id', data.id).eq('leader_id', context.userId).select('id').single(); break;
    case 'book': result = await db.rpc('request_booking', data.booking); break;
    case 'decide': result = await db.rpc('decide_booking', { request_id: data.id, decision: data.decision }); break;
    case 'reviewLeader': result = await db.rpc('review_leader', { target: data.id, decision: data.decision }); break;
    case 'rate': result = await db.rpc('rate_trip', { request_id: data.id, stars: data.rating, message: data.comment }); break;
    case 'favorite': result = data.remove ? await db.from('favorites').delete().eq('tourist_id', context.userId).eq('tour_id', data.id) : await db.from('favorites').insert({ tourist_id: context.userId, tour_id: data.id }); break;
    case 'media': result = await db.from('leader_media').insert({ leader_id: context.userId, path: data.path, kind: data.mediaKind, caption: data.caption, tour_id: data.tour_id, visible: data.visible }); break;
    case 'mediaVisibility': result = await db.from('leader_media').update({ visible: data.visible }).eq('id', data.id).eq('leader_id', context.userId).select('id').single(); break;
  }
  if (result?.error) throw new Error(result.error.message);
  return { ok: true };
});
export const documentLink = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((v: { path: string }) => z.object({ path: z.string().min(1).max(500) }).parse(v)).handler(async ({ data, context }) => {
  const result = await context.supabase.storage.from('booking-documents').createSignedUrl(data.path, 60);
  if (result.error || !result.data) throw new Error('دسترسی به مدرک ممکن نیست');
  return result.data.signedUrl;
});