"use client";

import { TextReveal } from "./TextReveal";

export function ContentSection() {
  return (
    <section className="relative z-10 bg-transparent w-full py-[10rem] px-[3rem] mt-[-50vh]">
      <div className="max-w-5xl mx-auto">
        <TextReveal className="text-muted font-sans text-xl md:text-3xl max-w-3xl leading-relaxed">
          A motion designer who turns ideas into living, breathing visuals. I
          believe the right movement can make people feel what words never
          could.
        </TextReveal>
      </div>
    </section>
  );
}
