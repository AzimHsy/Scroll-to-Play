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

  // Split into words to maintain natural line wrapping
  const words = useMemo(() => children.split(" "), [children]);

  useGSAP(
    () => {
      const targets = charsRef.current.filter(Boolean);
      if (targets.length === 0) return;

      gsap.to(targets, {
        backgroundPosition: "0% 0",
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
          end: "bottom 45%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { dependencies: [words], scope: container }
  );

  let charCounter = 0;

  return (
    <div ref={container} className={className}>
      {words.map((word, wordIdx) => {
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.3em]">
            {word.split("").map((char, charIdx) => {
              const currentIndex = charCounter++;
              return (
                <span
                  key={charIdx}
                  ref={(el) => {
                    charsRef.current[currentIndex] = el;
                  }}
                  className="inline-block"
                  style={{
                    backgroundImage: "linear-gradient(to right, #f0ede6 50%, #222 50%)",
                    backgroundSize: "200% 100%",
                    backgroundPosition: "100% 0",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
}
