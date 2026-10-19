import { createFileRoute } from '@tanstack/react-router';
import { panelOptions } from '@/lib/travel-query';
import { pageHead } from '@/lib/metadata';
import { AdminPanel } from '@/components/travel/panels';
export const Route = createFileRoute('/_authenticated/management')({ head: () => pageHead('مدیریت', 'بررسی مجوز تورلیدرها و اطلاعات سفر'), loader: ({ context }) => context.queryClient.ensureQueryData(panelOptions), component: AdminPanel });