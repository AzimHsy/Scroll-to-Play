"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ContentSection() {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="bg-background w-full py-[10rem] px-[3rem] border-t border-border">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          ref={ref}
          initial={false}
          animate={{ backgroundPosition: isInView ? "0% 0" : "100% 0" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8"
          style={{
            backgroundImage: "linear-gradient(to right, #f0ede6 50%, #222 50%)",
            backgroundSize: "200% 100%",
            backgroundPosition: "100% 0",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          We craft experiences that move people.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-muted font-serif text-xl md:text-2xl max-w-2xl leading-relaxed"
        >
          Our approach combines aesthetic precision with technical excellence, ensuring every interaction feels intentional, fluid, and memorable.
        </motion.p>
      </div>
    </section>
  );
}
