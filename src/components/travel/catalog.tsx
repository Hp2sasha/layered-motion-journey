import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, ArrowUpLeft, Search } from 'lucide-react';
import { catalogOptions } from '@/lib/travel-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTitle, Empty, dateLabel, moneyLabel } from './shared';

export function TourCatalog({ compact = false }: { compact?: boolean }) {
  const { data } = useSuspenseQuery(catalogOptions); const [search, setSearch] = useState(''); const [category, setCategory] = useState('همه');
  const categories = ['همه', ...new Set(data.tours.map(t => t.category))];
  const tours = data.tours.filter(t => Date.parse(t.starts_at) > Date.now() && (category === 'همه' || t.category === category) && `${t.title} ${t.destination}`.includes(search));
  return <section className={compact ? 'travel-home-tours' : 'travel-page'} dir="rtl" lang="fa"><PageTitle title={compact ? 'سفر بعدی شما' : 'سفرهای پیش رو'} subtitle="با تورلیدر دلخواهتان همراه شوید" />
    <div className="travel-filters no-print"><label className="travel-search"><Search /><Input aria-label="جست‌وجوی سفر یا مقصد" placeholder="سفر یا مقصد…" value={search} onChange={e => setSearch(e.target.value)} /></label><div className="flex flex-wrap gap-2">{categories.map(c => <Button size="sm" variant={c === category ? 'default' : 'ghost'} aria-pressed={c === category} key={c} onClick={() => setCategory(c)}>{c}</Button>)}</div></div>
    {tours.length ? <div className="travel-grid">{tours.slice(0, compact ? 3 : undefined).map(t => { const image = data.media.find(m => m.leader_id === t.leader_id && m.kind === 'image'); const leader = data.leaders.find(l => l.user_id === t.leader_id); return <article className="tour-card" key={t.id}>{image?.url && <img src={image.url} alt={image.caption || t.title} />}<div className="tour-card-body"><span className="travel-eyebrow">{t.category}</span><h2 dir="rtl" lang="fa"><Link to="/tours/$tourId" params={{ tourId: t.id }}>{t.title}</Link></h2><p><MapPin />{t.destination}</p><p><CalendarDays />{dateLabel(t.starts_at)}</p><Link to="/leaders/$leaderId" params={{ leaderId: t.leader_id }}>{leader?.display_name || 'تورلیدر'}</Link><div className="tour-card-footer"><strong>{moneyLabel(t.price)}</strong><Button variant="ghost" size="icon" asChild><Link aria-label={`مشاهده ${t.title}`} to="/tours/$tourId" params={{ tourId: t.id }}><ArrowUpLeft /></Link></Button></div></div></article>; })}</div> : <Empty>{search ? 'سفری با این مشخصات پیدا نشد.' : 'هنوز سفری منتشر نشده است.'}</Empty>}
  </section>;
}
export function LeaderCatalog() {
  const { data } = useSuspenseQuery(catalogOptions);
  return <main className="travel-page" dir="rtl" lang="fa"><PageTitle title="تورلیدرها" subtitle="همراهان سفر شما" />{data.leaders.length ? <div className="travel-grid">{data.leaders.map(l => { const img = data.media.find(m => m.leader_id === l.user_id && m.kind === 'image'); return <article className="tour-card" key={l.user_id}>{img?.url && <img src={img.url} alt={l.display_name} />}<div className="tour-card-body"><h2 dir="rtl" lang="fa">{l.display_name || 'تورلیدر'}</h2><p>{l.bio}</p><Button asChild variant="outline"><Link to="/leaders/$leaderId" params={{ leaderId: l.user_id }}>مشاهده پروفایل<ArrowUpLeft /></Link></Button></div></article>; })}</div> : <Empty>هنوز تورلیدری معرفی نشده است.</Empty>}</main>;
}