import { createFileRoute } from '@tanstack/react-router';
import { catalogOptions } from '@/lib/travel-query';
import { pageHead } from '@/lib/metadata';
import { LeaderCatalog } from '@/components/travel/catalog';
export const Route = createFileRoute('/leaders')({ head: () => pageHead('تورلیدرها', 'معرفی تورلیدرهای تأییدشده و تجربه‌های سفر در تورینو'), loader: ({ context }) => context.queryClient.ensureQueryData(catalogOptions), component: LeaderCatalog });