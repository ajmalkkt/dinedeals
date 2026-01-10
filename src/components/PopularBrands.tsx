import React, { useRef, useEffect, useState } from "react";
import { getAllRestaurants } from "../services/restaurantService";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Props {
  brands?: string[];
  onSelectRestaurant?: (restaurantId: String) => void;
}

export default function PopularBrands({ brands = [], onSelectRestaurant }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<String | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    if ((!brands || brands.length === 0) && restaurants.length === 0) {
      getAllRestaurants().then((data) => {
        setRestaurants(data || []);
      });
    }
  }, [brands, restaurants.length]);

  const originalData = brands.length > 0 ? brands : restaurants;
  
  // 2. DUPLICATE DATA for Infinite Marquee Effect
  // We double the array so when we reach the end of the first set, we can snap back to 0 seamlessly
  const marqueeData = [...originalData, ...originalData];

  // 3. INITIALIZE: Random Start Position
  useEffect(() => {
    if (originalData.length > 0 && scrollRef.current) {
      // Small timeout to ensure images/layout are rendered for correct width calculation
      setTimeout(() => {
        const container = scrollRef.current;
        if (container) {
          // Calculate the width of one set of items (approx half the total scroll width)
          const singleSetWidth = container.scrollWidth / 2;
          
          // Random starting position within the first set
          const randomStart = Math.floor(Math.random() * singleSetWidth);
          container.scrollLeft = randomStart;
          
          setIsReady(true); // Start animation only after setting position
        }
      }, 500);
    }
  }, [originalData.length]);

  // 4. ANIMATION LOOP (The "Marquee" Engine)
  useEffect(() => {
    if (!isReady || originalData.length === 0) return;

    const scrollContainer = scrollRef.current;
    const speed = 0.5; // Adjust speed: 0.5 is slow/smooth, 1 is faster

    const animate = () => {
      if (scrollContainer && !isPaused) {
        // Increment position
        scrollContainer.scrollLeft += speed;

        // INFINITE LOOP LOGIC:
        // If we have scrolled past the first set (halfway point), snap back to 0
        // -1 buffer helps prevent glitching on some screens
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 2) - 1) {
          scrollContainer.scrollLeft = 0;
        }
      }
      // Request next frame
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start the loop
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isReady, isPaused, originalData.length]);

  // 5. Handlers
  const handleRestaurantClick = (restaurantId: String) => {
    setSelectedRestaurant(restaurantId);
    if (onSelectRestaurant) onSelectRestaurant(restaurantId);
  };

  const scrollManual = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  if (originalData.length === 0) return null;

  return (
    <section 
      className="mb-2"
      // Pause on Hover (Desktop)
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      // Pause on Touch (Mobile)
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="flex items-center gap-2 mb-1 px-1">
        <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
        <h3 className="text-lg font-semibold animate-pulse brand-gradient-text">In the Spotlight</h3>
      </div>

      <div className="relative group">
        
        {/* Left Arrow (Manual Control) */}
        <button
          onClick={() => scrollManual('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md rounded-full p-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>

        {/* 
           SCROLL CONTAINER 
           - overflow-hidden (usually) or overflow-x-auto if you still want manual swipe
        */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-hidden pb-2 pt-1 px-1"
          style={{ whiteSpace: 'nowrap' }} // Ensures items stay in one line
        >
          {marqueeData.map((src, i) => (
            <div
              // Use index in key because items are duplicated, IDs won't be unique
              key={`${src.id}-${i}`}
              onClick={() => handleRestaurantClick(src.id)}
              className="flex-shrink-0 cursor-pointer flex flex-col items-center gap-2 transition-transform hover:scale-105"
            >
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
                  alt={src.name}
                  className="w-12 h-12 object-contain"
                  loading="lazy"
                />
              </div>

              <span className={`text-xs font-medium truncate max-w-[70px] ${selectedRestaurant === src.id ? 'text-blue-600' : 'text-gray-600'}`}>
                {src.name}
              </span>
            </div>
          ))}
        </div>

        {/* Right Arrow (Manual Control) */}
        <button
          onClick={() => scrollManual('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md rounded-full p-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}