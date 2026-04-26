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
  }, []);

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
          onUpdate: (self) => {
            const index = Math.min(
              FRAME_COUNT - 1,
              Math.floor(self.progress * FRAME_COUNT),
            );
            const img = framesRef.current[index];
            if (img && img.complete) {
              drawCover(img);
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
        }, 100);

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
        <div className="absolute inset-0 bg-black/40 z-0" />

        {loaded && (
          <>
            {/* Overlay Text */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center px-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-9xl font-serif text-foreground leading-tight"
              >
                Visual <br /> Language
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-mono text-xs mt-6 text-foreground/80 uppercase tracking-[0.2em]"
              >
                Scroll to explore
              </motion.p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
