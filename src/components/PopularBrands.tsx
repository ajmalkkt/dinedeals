import React, { useRef, useEffect, useState } from "react";
import restaurantsData from "../data/restaurants.json";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  brands?: string[];
}

export default function PopularBrands({ brands = [] }: Props) {
  const brandsRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const el = brandsRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 0);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    } else {
      window.addEventListener("resize", update);
    }
    return () => {
      el.removeEventListener("scroll", update);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", update);
    };
  }, [brands]);

  const scrollAmount = () => {
    const el = brandsRef.current;
    return el ? Math.round(el.clientWidth * 0.7) : 200;
  };

  const prev = () => {
    const el = brandsRef.current;
    if (!el) return;
    el.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  };

  const next = () => {
    const el = brandsRef.current;
    if (!el) return;
    el.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  };

  return (
    <section className="mb-2">
      <div className="bg-gray-50 rounded-lg border p-2 relative overflow-hidden">
        <div className="flex items-center justify-between mb-1 px-2">
          <h3 className="text-lg font-semibold">Popular Restaurants & Malls</h3>
        </div>

        <div className="relative">
          <button aria-label="previous" onClick={prev} disabled={!canPrev} className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-sm border hover:shadow-md ${!canPrev ? 'opacity-40 pointer-events-none' : ''}`}>
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          <button aria-label="next" onClick={next} disabled={!canNext} className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-sm border hover:shadow-md ${!canNext ? 'opacity-40 pointer-events-none' : ''}`}>
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          <div ref={brandsRef} className="flex items-center gap-1 overflow-x-auto py-1 pl-12 pr-12" style={{ WebkitOverflowScrolling: 'touch' }}>
            {(
              brands.length > 0
                ? brands
                : restaurantsData.slice(0, 8).map((r) => r.brandUrl || r.logoUrl)
            ).map((src, i) => (
              <div key={i} className="flex-shrink-0 w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer transition-colors">
                <img src={src} alt={`brand-${i}`} className="w-10 h-10 object-contain rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
