import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/metadata';
import { AuthPage } from '@/components/travel/auth';
export const Route = createFileRoute('/auth')({ head: () => pageHead('ورود و ثبت‌نام', 'ورود به حساب گردشگر یا تورلیدر در تورینو'), component: AuthPage });