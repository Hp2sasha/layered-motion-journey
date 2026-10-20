# Layered Motion Journey

Copy-paste this component to /components/ui folder:
```tsx
parallax-scrolling.tsx
// src/components/ui/component.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxComponent() {
  const parallaxRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Clean up GSAP and ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    


      


        


          


          


            
            
            


              

Parallax


            


            
          


          


        


      


      


        
          
        
      


    


  );
}

demo.tsx
// src/demos/default.tsx
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

export default function ParallaxDemo() {
  return (
    <>
      
      


        

Resource by Osmo
        


      


    
  );
}
```

Install NPM dependencies:
```bash
gsap, @studio-freight/lenis
```
میخواهم همه این ویژگی ها رو برای بخش هیروی سایتم اضافه کنم

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://layered-motion-journey.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f519aa4d-39c1-518c-aa9b-ff947da845a5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
