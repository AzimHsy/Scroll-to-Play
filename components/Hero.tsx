"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const FRAME_COUNT = 96; // Updated to 96 to match the full frame count in /public/frames

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const framesRef = useRef<HTMLImageElement[]>([]);

  // Preload images
  useEffect(() => {
    // Prevent browser from restoring scroll position on refresh
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    const loadImages = async () => {
      const promises = [];
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const src = `/frames/frame_${i.toString().padStart(3, "0")}.jpg`;
        promises.push(
          new Promise<void>((resolve) => {
            img.src = src;
            img.onload = () => {
              framesRef.current[i - 1] = img;
              setLoadingProgress((prev) => prev + 1 / FRAME_COUNT);
              resolve();
            };
            img.onerror = () => {
              // Handle error gracefully so we don't block
              resolve();
            };
          }),
        );
      }
      await Promise.all(promises);
      setLoaded(true);
    };

    loadImages();

    // Clean up scroll restoration on unmount if needed
    return () => {
      if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  const overlayRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!loaded || !canvasRef.current || !containerRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw frame keeping object-cover aspect ratio
      const drawCover = (img: HTMLImageElement) => {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio,
        );
      };

      // Initial render and setup
      if (framesRef.current[0]) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawCover(framesRef.current[0]);

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: true,
          refreshPriority: 1,
          onUpdate: (self) => {
            const index = Math.min(
              FRAME_COUNT - 1,
              Math.floor(self.progress * FRAME_COUNT),
            );
            const img = framesRef.current[index];
            if (img && img.complete) {
              drawCover(img);
            }

            // Fade transition logic - now ends earlier (at 0.85 instead of 1.0)
            const fadeStart = 0.6;
            const fadeEnd = 0.9;

            if (self.progress > fadeStart) {
              const p = Math.min(
                1,
                (self.progress - fadeStart) / (fadeEnd - fadeStart),
              );
              if (overlayRef.current) {
                overlayRef.current.style.backgroundColor = `rgba(8, 8, 8, ${0.4 + p * 0.6})`;
              }
              if (textContainerRef.current) {
                textContainerRef.current.style.opacity = (1 - p).toString();
                textContainerRef.current.style.transform = `translateY(${-p * 50}px)`;
              }
            } else {
              if (overlayRef.current) {
                overlayRef.current.style.backgroundColor = "rgba(8, 8, 8, 0.4)";
              }
              if (textContainerRef.current) {
                textContainerRef.current.style.opacity = "1";
                textContainerRef.current.style.transform = "translateY(0px)";
              }
            }
          },
        });

        const handleResize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          // Redraw current frame based on scroll progress
          const st = ScrollTrigger.getAll().find(
            (s) => s.vars.trigger === containerRef.current,
          );
          const index = st
            ? Math.min(FRAME_COUNT - 1, Math.floor(st.progress * FRAME_COUNT))
            : 0;
          const img = framesRef.current[index];
          if (img && img.complete) {
            drawCover(img);
          }
        };

        window.addEventListener("resize", handleResize);

        // Force refresh after a small delay to ensure DOM is settled
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 500);

        return () => window.removeEventListener("resize", handleResize);
      }
    },
    { dependencies: [loaded] },
  );

  return (
    <>
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference font-mono text-[10px] uppercase text-foreground pointer-events-none">
        <div>Logo</div>
        <div className="flex gap-6 pointer-events-auto">
          <a href="#" className="hover:opacity-70 transition-opacity">
            Work
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            Studio
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Container */}
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-background overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Black Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-0 transition-colors duration-100"
          style={{ backgroundColor: "rgba(8, 8, 8, 0.4)" }}
        />

        {loaded && (
          <>
            {/* Overlay Text */}
            <div
              ref={textContainerRef}
              className="absolute bottom-12 left-6 md:left-12 z-10 pointer-events-none text-left transition-all duration-100 ease-out"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-7xl font-serif text-foreground leading-[0.9]"
              >
                Between frames, <br /> meaning lives.
              </motion.h1>
            </div>
          </>
        )}
      </div>
    </>
  );
}
