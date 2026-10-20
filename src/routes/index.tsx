import { createFileRoute } from "@tanstack/react-router";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";
import { TourCatalog } from '@/components/travel/catalog';
import { catalogOptions } from '@/lib/travel-query';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تورینو" },
      { name: "description", content: "انتخاب سفر و رزرو تور با تورلیدرهای تورینو" },
      { property: "og:title", content: "تورینو" },
      { property: "og:description", content: "انتخاب سفر و رزرو تور با تورلیدرهای تورینو" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogOptions),
  component: Index,
});

function Index() {
  return <ParallaxComponent><TourCatalog compact /></ParallaxComponent>;
}
