"use client";

import { TextReveal } from "./TextReveal";

export function ContentSection() {
  return (
    <section className="bg-background w-full py-[10rem] px-[3rem] border-t border-border">
      <div className="max-w-5xl mx-auto">
        <TextReveal className="text-muted font-sans text-xl md:text-3xl max-w-3xl leading-relaxed">
          Our approach combines aesthetic precision with technical excellence, ensuring every interaction feels intentional, fluid, and memorable. We believe in the power of visual language to tell stories that resonate and inspire.
        </TextReveal>
      </div>
    </section>
  );
}
