import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/metadata';
import { ResetPassword } from '@/components/travel/auth';
export const Route = createFileRoute('/reset-password')({ head: () => pageHead('بازیابی رمز', 'تنظیم رمز جدید حساب تورینو'), component: ResetPassword });