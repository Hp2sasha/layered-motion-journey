import { createFileRoute } from "@tanstack/react-router";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Parallax — Layered Scrolling Hero" },
      { name: "description", content: "A layered parallax hero with smooth scrolling." },
      { property: "og:title", content: "Parallax — Layered Scrolling Hero" },
      { property: "og:description", content: "A layered parallax hero with smooth scrolling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <ParallaxComponent />;
}
