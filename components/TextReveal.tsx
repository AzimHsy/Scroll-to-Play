"use client";

import { useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  children: string;
  className?: string;
}

export function TextReveal({ children, className = "" }: TextRevealProps) {
  const container = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Split string into individual characters
  const characters = useMemo(() => children.split(""), [children]);

  useGSAP(
    () => {
      const targets = charsRef.current.filter(Boolean);
      if (targets.length === 0) return;

      // Animate character by character as we scroll
      gsap.to(targets, {
        backgroundPosition: "0% 0",
        ease: "none",
        stagger: 0.15,
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
          end: "bottom 45%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { dependencies: [characters], scope: container },
  );

  return (
    <div ref={container} className={className}>
      {characters.map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            charsRef.current[i] = el;
          }}
          className="inline-block"
          style={{
            backgroundImage: "linear-gradient(to right, #f0ede6 50%, #222 50%)",
            backgroundSize: "200% 100%",
            backgroundPosition: "100% 0",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            // Maintain space width correctly
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
