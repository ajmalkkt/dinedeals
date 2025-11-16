import React, { useRef, useEffect, useState } from "react";
import { getAllRestaurants } from "../services/restaurantService";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  brands?: string[];
  onSelectRestaurant?: (restaurantId: String) => void;
}

export default function PopularBrands({ brands = [], onSelectRestaurant }: Props) {
  const brandsRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<String | null>(null);

  const handleRestaurantClick = (restaurantId: String) => {
    setSelectedRestaurant(restaurantId);
    if (onSelectRestaurant)
      onSelectRestaurant(restaurantId);
  };

  useEffect(() => {
    // Fetch restaurants for default brands if brands prop is not provided and not already loaded
    if ((!brands || brands.length === 0) && restaurants.length === 0) {
      getAllRestaurants().then((data) => setRestaurants(data || []));
    }
  }, [brands, restaurants.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotlightIdx((idx) => (idx === 0 ? 1 : 0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold animate-pulse bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">In the Spotlight</h3>
            {/* <img
              src={spotlightIdx === 0 ? "/images/spotlight.gif" : "/images/spotlight-food.gif"}
              alt="Spotlight"
              className="w-8 h-8 animate-bounce"
              onError={(e) => { e.currentTarget.src = '/images/offers/offer-1.jpg'; }}
            /> */}
          </div>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            aria-label="previous"
            onClick={prev}
            disabled={!canPrev}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-white rounded-full shadow-sm border hover:shadow-md ${
              !canPrev ? "opacity-40 pointer-events-none" : ""
            }`}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          {/* Right Arrow */}
          <button
            aria-label="next"
            onClick={next}
            disabled={!canNext}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-white rounded-full shadow-sm border hover:shadow-md ${
              !canNext ? "opacity-40 pointer-events-none" : ""
            }`}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          {/* Fade Gradients */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-20 bg-gradient-to-r from-gray-50 via-gray-50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 z-20 bg-gradient-to-l from-gray-50 via-gray-50 to-transparent" />

          {/* Scroll Container */}
          <div
            ref={brandsRef}
            className="flex items-center gap-1 overflow-x-hidden scroll-smooth py-1 pl-12 pr-12"
          >
            {(
              brands.length > 0
                ? brands
                : restaurants
            ).map((src, i) => (
              <div
                key={i}
                onClick={() => handleRestaurantClick(src.id)}
                className={`flex-shrink-0 w-16 h-16 bg-white rounded-lg border ${
                  selectedRestaurant === src.id
                    ? "border-blue-500 shadow-md"
                    : "border-gray-200"
                } flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer transition-colors`}
              >
                <img
                  src={src.brandUrl || src.logoUrl}
                  alt={`brand-${i}`}
                  className="w-10 h-10 object-contain rounded"
                />
              </div>

            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
