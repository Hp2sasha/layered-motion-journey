import { createFileRoute } from '@tanstack/react-router';
import { catalogOptions } from '@/lib/travel-query';
import { pageHead } from '@/lib/metadata';
import { TourDetail } from '@/components/travel/details';
export const Route = createFileRoute('/tours_/$tourId')({ head: () => pageHead('جزئیات سفر', 'اطلاعات تور، قوانین و درخواست رزرو سفر در تورینو'), loader: ({ context }) => context.queryClient.ensureQueryData(catalogOptions), component: () => <TourDetail id={Route.useParams().tourId} /> });