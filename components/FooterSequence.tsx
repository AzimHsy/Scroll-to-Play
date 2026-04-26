"use client";

export function FooterSequence() {
  return (
    <footer className="bg-background text-foreground py-24 px-[3rem] border-t border-border flex flex-col md:flex-row justify-between items-center font-mono text-xs uppercase tracking-widest gap-8">
      <div>© {new Date().getFullYear()}</div>
      <div className="flex gap-8">
        <a href="#" className="hover:opacity-70 transition-opacity">Instagram</a>
        <a href="#" className="hover:opacity-70 transition-opacity">Twitter</a>
        <a href="#" className="hover:opacity-70 transition-opacity">LinkedIn</a>
      </div>
      <div>End of sequence</div>
    </footer>
  );
}
