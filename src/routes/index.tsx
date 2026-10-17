import { createFileRoute } from "@tanstack/react-router";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تورینو" },
      { name: "description", content: "تورینو — بخش هیرو با لایه‌های متحرک و اسکرول نرم." },
      { property: "og:title", content: "تورینو" },
      { property: "og:description", content: "تورینو — بخش هیرو با لایه‌های متحرک و اسکرول نرم." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <ParallaxComponent />;
}
