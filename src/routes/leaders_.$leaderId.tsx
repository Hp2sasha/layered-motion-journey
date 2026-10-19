import { createFileRoute } from '@tanstack/react-router';
import { catalogOptions } from '@/lib/travel-query';
import { pageHead } from '@/lib/metadata';
import { LeaderDetail } from '@/components/travel/details';
export const Route = createFileRoute('/leaders_/$leaderId')({ head: () => pageHead('پروفایل تورلیدر', 'معرفی، سفرها، تصاویر و تجربه مسافران تورلیدر در تورینو'), loader: ({ context }) => context.queryClient.ensureQueryData(catalogOptions), component: () => <LeaderDetail id={Route.useParams().leaderId} /> });