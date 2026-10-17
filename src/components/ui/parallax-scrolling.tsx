import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import starrySky from "@/assets/hero-sky-starry.webp";

const CDN = "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/";
const MOONLIT_SKY = `${CDN}6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp`;

const MODE_KEY = "torino:mode";
type Mode = "day" | "night";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.6 4a6.9 6.9 0 0 0 10.4 10.5Z" />
    </svg>
  );
}

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("night");

  useEffect(() => {
    const saved = window.localStorage.getItem(MODE_KEY);
    if (saved === "day" || saved === "night") setMode(saved);
  }, []);

  const chooseMode = (next: Mode) => {
    setMode(next);
    window.localStorage.setItem(MODE_KEY, next);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggerElement = parallaxRef.current?.querySelector("[data-parallax-layers]");

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: triggerElement, start: "0% 0%", end: "100% 0%", scrub: 0 },
      });
      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 },
      ];
      layers.forEach((l, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${l.layer}"]`),
          { yPercent: l.yPercent, ease: "none" },
          idx === 0 ? undefined : "<",
        );
      });
    }

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax" ref={parallaxRef} data-mode={mode}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" />
          <div data-parallax-layers className="parallax__layers">
            <div data-parallax-layer="1" className="parallax__layer-sky">
              <img
                src={MOONLIT_SKY}
                loading="eager"
                alt=""
                className="parallax__layer-img parallax__sky"
                data-sky="night"
              />
              <img
                src={starrySky}
                loading="eager"
                alt=""
                className="parallax__layer-img parallax__sky"
                data-sky="day"
              />
            </div>
            <img src={`${CDN}6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp`} loading="eager" data-parallax-layer="2" alt="" className="parallax__layer-img" />
            <div data-parallax-layer="3" className="parallax__layer-title">
              <h2 className="parallax__title" dir="rtl" lang="fa">تورینو</h2>
            </div>
            <img src={`${CDN}6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp`} loading="eager" data-parallax-layer="4" alt="" className="parallax__layer-img" />
          </div>
          <div className="parallax__fade" />
        </div>
        <div className="parallax__mode" dir="rtl" role="group" aria-label="حالت نمایش آسمان">
          <button
            type="button"
            data-active={mode === "day"}
            aria-pressed={mode === "day"}
            onClick={() => chooseMode("day")}
          >
            <SunIcon />
            <span>روز</span>
          </button>
          <button
            type="button"
            data-active={mode === "night"}
            aria-pressed={mode === "night"}
            onClick={() => chooseMode("night")}
          >
            <MoonIcon />
            <span>شب</span>
          </button>
        </div>
      </section>
      <section className="parallax__content" aria-hidden="true" />
    </div>
  );
}
