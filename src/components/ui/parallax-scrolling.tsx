import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import starryMountain from "@/assets/starry-mountain.jpg";
import earthStrata from "@/assets/earth-strata.jpg";

const CDN = "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/";

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"night" | "day">("night");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = parallaxRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: reducedMotion ? true : 0.35, invalidateOnRefresh: true },
      });
      tl.to(".parallax__visuals", { y: () => -window.innerHeight * 1.2 * 1.175 * 0.7, duration: 1, ease: "none" }, 0)
        .to(".parallax__underground", { y: () => -window.innerHeight, duration: 1, ease: "none" }, 0)
        .to(".parallax__underground", { y: () => -window.innerHeight * 2.8, duration: 2, ease: "none" });
      if (!reducedMotion) {
        // Counter the shared descent at different speeds to retain mountain depth.
        // The rear sky stays in view while the foreground reveals the earth.
        for (const [layer, yPercent] of [[1, 70], [2, 55], [3, 40], [4, 10]]) {
          tl.to(`[data-parallax-layer="${layer}"]`, { yPercent, duration: 1, ease: "none" }, 0);
        }
      }
    }, root);

    const lenis = new Lenis({ smoothWheel: !reducedMotion });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      context.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax" data-mode={mode} ref={parallaxRef}>
      <div className="parallax__mode-control" role="group" aria-label="حالت نمایش" dir="rtl" lang="fa">
        <Button variant="ghost" size="icon" className="parallax__mode-button" aria-label="حالت شب" title="حالت شب" aria-pressed={mode === "night"} onClick={() => setMode("night")}><Moon /></Button>
        <Button variant="ghost" size="icon" className="parallax__mode-button" aria-label="حالت روز" title="حالت روز" aria-pressed={mode === "day"} onClick={() => setMode("day")}><Sun /></Button>
      </div>
      <section className="parallax__header" aria-label="تورینو؛ کوهستان و لایه‌های زمین">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" />
          <div data-parallax-layers className="parallax__layers">
            <img src={`${CDN}6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp`} loading="eager" data-parallax-layer="1" alt="" className="parallax__layer-img" />
            <img src={starryMountain} loading="eager" data-parallax-layer="1" alt="" className="parallax__layer-img parallax__starry" />
            <img src={`${CDN}6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp`} loading="eager" data-parallax-layer="2" alt="" className="parallax__layer-img" />
            <div data-parallax-layer="3" className="parallax__layer-title">
              <h1 className="parallax__title" dir="rtl" lang="fa">تورینو</h1>
            </div>
            <img src={`${CDN}6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp`} loading="eager" data-parallax-layer="4" alt="" className="parallax__layer-img" />
          </div>
          <div className="parallax__fade" />
        </div>
        <div className="parallax__underground" aria-hidden="true">
          <img src={earthStrata} width={1024} height={1920} loading="eager" alt="" className="parallax__earth-img" />
          <div className="parallax__earth-shade" />
        </div>
      </section>
    </div>
  );
}
