import { Hero } from "@/components/Hero";
import { ContentSection } from "@/components/ContentSection";
import { FooterSequence } from "@/components/FooterSequence";

export default function Home() {
  return (
    <main className="w-full relative">
      <Hero />
      <ContentSection />
      
      {/* Spacer to give scrolling effect some extra breathing room before footer */}
      <div className="h-[20vh] w-full bg-background"></div>
      
      <div className="w-full">
        <FooterSequence />
      </div>
    </main> 
  );
}
