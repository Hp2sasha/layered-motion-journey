import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import '@lovable.dev/cloud-auth-js/styles.css';
import { Button } from '@/components/ui/button';
import { Field } from './shared';
import { useSession } from './session';
import scene from '@/assets/hero-sky-no-sun.webp';

const credentials = z.object({ email: z.string().trim().email().max(255), password: z.string().min(8).max(128) });
export function AuthPage() {
  const [mode, setMode] = useState<'login'|'signup'|'forgot'>('login'); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const { user } = useSession(); const navigate = useNavigate();
  useEffect(() => { if (user) navigate({ to: '/account', replace: true }); }, [user, navigate]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage(''); const form = new FormData(e.currentTarget);
    try {
      const email = z.string().trim().email().max(255).parse(form.get('email'));
      if (mode === 'forgot') { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (error) throw error; setMessage('اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی ارسال می‌شود.'); return; }
      const valid = credentials.parse({ email, password: form.get('password') });
      if (mode === 'signup') {
        const name = z.string().trim().min(1).max(100).parse(form.get('display_name'));
        if (form.get('account_type') === 'leader') sessionStorage.setItem('torino:apply-leader', 'yes');
        const { data, error } = await supabase.auth.signUp({ ...valid, options: { emailRedirectTo: window.location.origin, data: { display_name: name } } });
        if (error) throw error;
        if (data.session) await navigate({ to: '/account' }); else setMessage('برای تکمیل ثبت‌نام، لینک تأیید ایمیل خود را باز کنید.');
      } else { const { error } = await supabase.auth.signInWithPassword(valid); if (error) throw error; await navigate({ to: '/account' }); }
    } catch (error) { setMessage(error instanceof z.ZodError ? 'ایمیل معتبر و رمز حداقل ۸ حرفی وارد کنید.' : error instanceof Error ? error.message : 'ورود انجام نشد. دوباره تلاش کنید.'); } finally { setBusy(false); }
  }
  async function social(provider: 'google'|'lovable') { setBusy(true); setMessage(''); try { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin }); if (result.error) throw result.error; if (!result.redirected) await navigate({ to: '/account' }); } catch { setMessage('ورود انجام نشد. دوباره تلاش کنید.'); } finally { setBusy(false); } }
  return <main className="travel-auth" dir="rtl" lang="fa"><img className="travel-auth-scenery" src={scene} alt="" /><section className="travel-auth-form"><span className="travel-auth-brand">تورینو</span><h1 dir="rtl" lang="fa">{mode === 'signup' ? 'آغاز همراهی' : mode === 'forgot' ? 'بازیابی رمز' : 'خوش آمدید'}</h1>
    {mode !== 'forgot' && <div className="travel-auth-tabs"><Button variant={mode === 'login' ? 'default' : 'ghost'} onClick={() => { setMode('login'); setMessage(''); }}>ورود</Button><Button variant={mode === 'signup' ? 'default' : 'ghost'} onClick={() => { setMode('signup'); setMessage(''); }}>ثبت‌نام</Button></div>}
    <form onSubmit={submit} className="travel-form">{mode === 'signup' && <><Field label="نام و نام خانوادگی" name="display_name" required maxLength={100} /><label className="travel-field"><span>نوع حساب</span><select name="account_type"><option value="tourist">گردشگر</option><option value="leader">تورلیدر</option></select></label></>}<Field label="ایمیل" name="email" type="email" required maxLength={255} />{mode !== 'forgot' && <Field label="رمز عبور" name="password" type="password" required maxLength={128} />}<Button type="submit" disabled={busy}>{busy ? 'لطفاً صبر کنید…' : mode === 'signup' ? 'ثبت‌نام' : mode === 'forgot' ? 'ارسال لینک بازیابی' : 'ورود'}</Button></form>
    <p role="status" className="travel-message">{message}</p>{mode === 'login' && <Button variant="link" onClick={() => setMode('forgot')}>رمز عبور را فراموش کردم</Button>}{mode === 'forgot' ? <Button variant="ghost" onClick={() => setMode('login')}>بازگشت به ورود</Button> : <div className="travel-social"><Button variant="outline" disabled={busy} onClick={() => social('google')}>ادامه با Google</Button><Button className="lovable-auth-button" disabled={busy} onClick={() => social('lovable')}>Continue with Lovable</Button></div>}
  </section></main>;
}
export function ResetPassword() {
  const [ready, setReady] = useState(false); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { setReady(new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'); }, []);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); try { const f = new FormData(e.currentTarget); const password = z.string().min(8).max(128).parse(f.get('password')); if (password !== f.get('confirm')) throw new Error('رمزها یکسان نیستند.'); const { error } = await supabase.auth.updateUser({ password }); if (error) throw error; setMessage('رمز جدید ذخیره شد.'); } catch (err) { setMessage(err instanceof Error ? err.message : 'رمز ذخیره نشد.'); } finally { setBusy(false); } }
  return <main className="travel-page" dir="rtl" lang="fa"><section className="travel-auth-form"><h1 dir="rtl" lang="fa">رمز جدید</h1>{ready ? <form onSubmit={submit} className="travel-form"><Field label="رمز جدید" type="password" name="password" required /><Field label="تکرار رمز جدید" type="password" name="confirm" required /><Button disabled={busy}>ذخیره رمز</Button></form> : <p>برای تنظیم رمز جدید، لینک بازیابی ایمیل را باز کنید.</p>}<p role="status">{message}</p></section></main>;
}