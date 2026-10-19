import { createFileRoute } from '@tanstack/react-router';
import { panelOptions } from '@/lib/travel-query';
import { pageHead } from '@/lib/metadata';
import { AccountPanel } from '@/components/travel/panels';
export const Route = createFileRoute('/_authenticated/account')({ head: () => pageHead('پنل من', 'سفرها، رزروها و اطلاعات حساب تورینو'), loader: ({ context }) => context.queryClient.ensureQueryData(panelOptions), component: AccountPanel });