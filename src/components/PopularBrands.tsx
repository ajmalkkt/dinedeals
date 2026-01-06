import React, { useRef, useEffect, useState } from "react";
import { getAllRestaurants } from "../services/restaurantService";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Props {
  brands?: string[];
  onSelectRestaurant?: (restaurantId: String) => void;
}

export default function PopularBrands({ brands = [], onSelectRestaurant }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<String | null>(null);

  // 1. Fetch Data
  useEffect(() => {
    if ((!brands || brands.length === 0) && restaurants.length === 0) {
      getAllRestaurants().then((data) => setRestaurants(data || []));
    }
  }, [brands, restaurants.length]);

  // 2. Handle Selection
  const handleRestaurantClick = (restaurantId: String) => {
    // Toggle selection: if clicking same one, unselect (optional, or keep selected)
    // setSelectedRestaurant(prev => prev === restaurantId ? null : restaurantId); 
    
    // Current logic: Always select
    setSelectedRestaurant(restaurantId);
    if (onSelectRestaurant) onSelectRestaurant(restaurantId);
  };

  // 3. Simple Scroll Functions
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200; // Pixel amount to scroll
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const dataToRender = brands.length > 0 ? brands : restaurants;

  if (dataToRender.length === 0) return null;

  return (
    <section className="mb-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1 px-1">
        <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
        <h3 className="text-lg font-semibold animate-pulse brand-gradient-text">In the Spotlight</h3>
        {/* Optional: Add animated icon back if needed */}
      </div>

      <div className="relative group">
        
        {/* 
           LEFT ARROW 
           - Hidden on mobile (touch devices scroll naturally)
           - Visible on Desktop (md:flex)
           - Appears on hover (group-hover) or always visible depending on preference
        */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md rounded-full p-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        {/* 
           SCROLL CONTAINER 
           - overflow-x-auto: Enables native scrolling
           - scrollbar-hide: Hides the ugly bar (needs CSS utility)
           - snap-x: Aligns items nicely
        */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 px-1 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Inline style to ensure hidden scrollbar
        >
          {dataToRender.map((src, i) => (
            <div
              key={i}
              onClick={() => handleRestaurantClick(src.id)}
              className={`
                snap-start flex-shrink-0 cursor-pointer flex flex-col items-center gap-2 transition-transform hover:scale-105
              `}
            >
              {/* Image Circle/Card */}
              <div
                className={`
                  w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 overflow-hidden shadow-sm
                  ${selectedRestaurant === src.id 
                    ? "border-blue-600 ring-2 ring-blue-100 ring-offset-1" 
                    : "border-gray-100 hover:border-blue-200"
                  }
                `}
              >
                <img
                  src={src.brandUrl || src.logoUrl}
                  alt={src.name || `brand-${i}`}
                  className="w-12 h-12 object-contain"
                  loading="lazy"
                />
              </div>

              {/* Optional: Brand Name Label (makes it look more like a Nav) */}
              <span className={`text-xs font-medium truncate max-w-[70px] ${selectedRestaurant === src.id ? 'text-blue-600' : 'text-gray-600'}`}>
                {src.name}
              </span>
            </div>
          ))}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md rounded-full p-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}