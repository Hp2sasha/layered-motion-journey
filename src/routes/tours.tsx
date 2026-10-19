import { createFileRoute } from '@tanstack/react-router';
import { catalogOptions } from '@/lib/travel-query';
import { pageHead } from '@/lib/metadata';
import { TourCatalog } from '@/components/travel/catalog';
export const Route = createFileRoute('/tours')({ head: () => pageHead('سفرها', 'جست‌وجوی تورها و مقاصد سفر در تورینو'), loader: ({ context }) => context.queryClient.ensureQueryData(catalogOptions), component: TourCatalog });