import { Link, useLocation } from '@tanstack/react-router';
import { Compass, LogOut, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from './session';
export function SiteNavigation() {
  const { user, signOut } = useSession(); const home = useLocation({ select: l => l.pathname === '/' });
  return <header className={`travel-nav no-print ${home ? 'travel-nav--scene' : ''}`} dir="rtl"><Link to="/" className="travel-brand"><Compass /><span>تورینو</span></Link><nav aria-label="ناوبری اصلی"><Link to="/tours">سفرها</Link><Link to="/leaders">تورلیدرها</Link></nav><div className="flex items-center gap-1">{user ? <><Button variant="ghost" asChild><Link to="/account"><UserRound />پنل من</Link></Button><Button variant="ghost" size="icon" aria-label="خروج" title="خروج" onClick={signOut}><LogOut /></Button></> : <Button variant="outline" asChild><Link to="/auth"><UserRound />ورود / ثبت‌نام</Link></Button>}</div></header>;
}