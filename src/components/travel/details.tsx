import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Heart, CalendarDays, MapPin, Star } from 'lucide-react';
import { catalogOptions } from '@/lib/travel-query';
import { travelAction } from '@/lib/travel.functions';
import { bookingSchema } from '@/lib/travel-rules';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PageTitle, Empty, Field, dateLabel, moneyLabel } from './shared';
import { useSession } from './session';

export function TourDetail({ id }: { id: string }) {
  const { data } = useSuspenseQuery(catalogOptions); const { user } = useSession(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [favorite, setFavorite] = useState(false);
  const action = useServerFn(travelAction); const query = useQueryClient(); const navigate = useNavigate(); const tour = data.tours.find(t => t.id === id);
  if (!tour) return <main className="travel-page" dir="rtl"><Empty>این سفر در دسترس نیست.</Empty></main>;
  const leader = data.leaders.find(l => l.user_id === tour.leader_id); const media = data.media.find(m => m.leader_id === tour.leader_id && m.kind === 'image');
  async function book(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!user || !tour) return; setBusy(true); setMessage(''); const f = new FormData(e.currentTarget);
    try {
      const files = f.getAll('documents').filter((v): v is File => v instanceof File && v.size > 0);
      if (files.length > 10) throw new Error('حداکثر ۱۰ مدرک انتخاب کنید.');
      const parsed = bookingSchema.parse({ trip: tour.id, passenger_name: f.get('passenger_name'), contact: f.get('contact'), remarks: f.get('remarks') || '', documents: [], accept_rules: f.get('rules') === 'on' });
      if (tour.required_documents && !files.length) throw new Error('مدارک مورد نیاز سفر را انتخاب کنید.');
      for (const file of files) if (file.size > 10 * 1024 * 1024 || !['application/pdf','image/jpeg','image/png'].includes(file.type)) throw new Error('مدرک باید PDF، JPG یا PNG و حداکثر ۱۰ مگابایت باشد.');
      const paths: string[] = [];
      for (const file of files) { const path = `${user.id}/${crypto.randomUUID()}.${file.type === 'application/pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : 'jpg'}`; const { error } = await supabase.storage.from('booking-documents').upload(path, file); if (error) throw error; paths.push(path); }
      await action({ data: { kind: 'book', booking: { ...parsed, documents: paths } } }); await query.invalidateQueries({ queryKey: ['panel'] }); await navigate({ to: '/account' });
    } catch (err) { setMessage(err instanceof Error ? err.message : 'درخواست ثبت نشد.'); } finally { setBusy(false); }
  }
  return <main className="travel-page" dir="rtl" lang="fa"><PageTitle title={tour.title} subtitle={tour.category} />{media?.url && <img className="travel-cover" src={media.url} alt={media.caption || tour.title} />}<div className="travel-detail-grid"><section><div className="travel-facts"><span><MapPin />{tour.destination}</span><span><CalendarDays />{dateLabel(tour.starts_at)} تا {dateLabel(tour.ends_at)}</span><strong>{moneyLabel(tour.price)}</strong></div><Link to="/leaders/$leaderId" params={{ leaderId: tour.leader_id }}>همراه سفر: {leader?.display_name || 'تورلیدر'}</Link><h2 dir="rtl" lang="fa">درباره سفر</h2><p className="whitespace-pre-wrap">{tour.description || 'توضیحات سفر هنوز درج نشده است.'}</p><h2 dir="rtl" lang="fa">قوانین سفر</h2><p className="whitespace-pre-wrap">{tour.rules || 'قوانین ویژه‌ای ثبت نشده است.'}</p><h2 dir="rtl" lang="fa">مدارک مورد نیاز</h2><p>{tour.required_documents || 'مدرکی نیاز نیست.'}</p><p>ظرفیت: {tour.capacity.toLocaleString('fa-IR')} نفر</p>{user && <Button variant="outline" className="no-print" onClick={async () => { try { await action({ data: { kind: 'favorite', id, remove: favorite } }); setFavorite(!favorite); } catch { setMessage('این سفر قبلاً ذخیره شده یا اکنون در دسترس نیست.'); } }}><Heart />{favorite ? 'حذف از علاقه‌مندی‌ها' : 'ذخیره سفر'}</Button>}</section><section className="travel-booking no-print"><h2 dir="rtl" lang="fa">درخواست رزرو</h2>{Date.parse(tour.starts_at) <= Date.now() ? <p>زمان ثبت درخواست این سفر گذشته است.</p> : !user ? <Button asChild><Link to="/auth">ورود برای رزرو</Link></Button> : <form className="travel-form" onSubmit={book}><Field name="passenger_name" label="نام و نام خانوادگی مسافر" required maxLength={100} /><Field name="contact" label="شماره تماس" type="tel" required maxLength={30} /><Field name="remarks" label="توضیحات مسافر" type="textarea" maxLength={2000} /><label className="travel-field"><span>مدارک مسافر</span><input name="documents" aria-label="مدارک مسافر" type="file" multiple accept="application/pdf,image/jpeg,image/png" /></label><label className="travel-check"><input name="rules" type="checkbox" required />قوانین این سفر را می‌پذیرم.</label><Button disabled={busy}>{busy ? 'در حال ثبت…' : 'ارسال درخواست'}</Button><p>پرداخت پس از تأیید تورلیدر انجام می‌شود.</p></form>}<p role="status" className="travel-message">{message}</p></section></div></main>;
}
export function LeaderDetail({ id }: { id: string }) {
  const { data } = useSuspenseQuery(catalogOptions); const leader = data.leaders.find(l => l.user_id === id);
  if (!leader) return <main className="travel-page" dir="rtl"><Empty>این تورلیدر در دسترس نیست.</Empty></main>;
  const tours = data.tours.filter(t => t.leader_id === id); const media = data.media.filter(m => m.leader_id === id); const reviews = data.reviews.filter(r => r.leader_id === id);
  return <main className="travel-page" dir="rtl" lang="fa"><PageTitle title={leader.display_name || 'تورلیدر'} subtitle="تورلیدر تأییدشده تورینو" /><p className="travel-bio">{leader.bio}</p><h2 dir="rtl" lang="fa">سفرها</h2>{tours.length ? <div className="travel-list">{tours.map(t => <Link key={t.id} to="/tours/$tourId" params={{ tourId: t.id }}><strong>{t.title}</strong><span>{dateLabel(t.starts_at)}</span><span>{Date.parse(t.ends_at) < Date.now() ? 'برگزار شده' : 'پیش رو'}</span></Link>)}</div> : <Empty>هنوز سفری ثبت نشده است.</Empty>}<h2 dir="rtl" lang="fa">لحظه‌های سفر</h2>{media.length ? <div className="travel-gallery">{media.map(m => <figure key={m.id}>{m.kind === 'video' ? <video controls preload="metadata" src={m.url} /> : <img src={m.url} alt={m.caption} />}<figcaption>{m.caption}</figcaption></figure>)}</div> : <Empty>هنوز تصویری منتشر نشده است.</Empty>}<h2 dir="rtl" lang="fa">تجربه مسافران</h2>{reviews.length ? <div className="travel-list">{reviews.map(r => <article key={r.id}><span className="flex items-center gap-1"><Star />{r.rating.toLocaleString('fa-IR')} از ۵</span><p>{r.comment}</p></article>)}</div> : <Empty>هنوز تجربه‌ای ثبت نشده است.</Empty>}</main>;
}