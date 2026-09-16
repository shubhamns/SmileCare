import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
const heroImages = [
  { src: "/images/hero-clinic-interior.jpg", alt: "Modern SmileCare dental clinic interior" },
  { src: "/images/hero-consultation.jpg", alt: "Dentist consulting with a patient" },
  { src: "/images/hero-healthy-smile.jpg", alt: "Healthy smile after dental care" },
];
export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="sc-hero-image">
      {heroImages.map((img, i) => (
        <img key={img.src} src={img.src} alt={img.alt} className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out", i === index ? "opacity-100 z-0" : "opacity-0 z-0")} loading={i === 0 ? "eager" : "lazy"} />
      ))}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 pointer-events-none select-none z-10 max-w-[72%]">
        <p className="sc-script text-[1.625rem] sm:text-[1.75rem] leading-none rotate-[-3deg] mb-1">Your smile, our priority</p>
        <svg width="110" height="64" viewBox="0 0 110 64" fill="none" className="text-teal-600 -ml-0.5" aria-hidden="true">
          <path d="M8 8 C34 10 52 50 92 58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M86 54 L94 60 L88 66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {heroImages.map((_, i) => (
          <button key={i} type="button" aria-label={`Show image ${i + 1}`} onClick={() => setIndex(i)} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-white shadow-sm" : "w-1.5 bg-white/60 hover:bg-white/80")} />
        ))}
      </div>
    </div>
  );
}
