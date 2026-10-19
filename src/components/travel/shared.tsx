import type { ReactNode } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const dateLabel = (s: string) => new Date(s).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
export const moneyLabel = (n: number) => `${n.toLocaleString('fa-IR')} تومان`;
export const statusLabel = (s: string) => ({ pending: 'در انتظار تأیید', approved: 'تأیید شده', rejected: 'رد شده', paid: 'پرداخت شده', suspended: 'تعلیق شده', revoked: 'مجوز باطل شده' }[s] ?? s);
export function Field({ label, name, type = 'text', value, required = false, maxLength = 160 }: { label: string; name: string; type?: string; value?: string | number; required?: boolean; maxLength?: number }) {
  return <label className="travel-field"><span>{label}</span>{type === 'textarea' ? <Textarea name={name} defaultValue={value} required={required} maxLength={maxLength} /> : <Input name={name} type={type} defaultValue={value} required={required} maxLength={maxLength} min={type === 'number' ? 0 : undefined} />}</label>;
}
export function PrintButton() { return <Button variant="outline" size="sm" className="no-print" onClick={() => window.print()}><Printer />چاپ</Button>; }
export function PageTitle({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return <div className="travel-page-title"><div><h1 dir="rtl" lang="fa">{title}</h1>{subtitle && <p>{subtitle}</p>}</div><div className="flex gap-2 items-center">{children}<PrintButton /></div></div>;
}
export function Empty({ children }: { children: ReactNode }) { return <div className="travel-empty">{children}</div>; }
export function Table({ headers, children }: { headers: string[]; children: ReactNode }) { return <div className="travel-table-wrap"><table className="travel-table"><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>; }