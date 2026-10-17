import { createFileRoute } from "@tanstack/react-router";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تورینو" },
      { name: "description", content: "تورینو؛ رزرو تور و سفر به مقصدهای تازه." },
      { property: "og:title", content: "تورینو" },
      { property: "og:description", content: "تورینو؛ رزرو تور و سفر به مقصدهای تازه." },
      { property: "og:image", content: "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp" },
      { name: "twitter:image", content: "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <ParallaxComponent />;
}
