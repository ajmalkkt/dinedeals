import React from "react";
import { SHOW_ENTERTAINMENT, SHOW_FINANCIAL_SERVICE, SHOW_CUISINE_NAV } from "../config/appConfig";

interface Props {
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
  onAddBusiness: () => void;
}

const cuisineList = [
  { name: "Biryani", img: "/images/cuisines/Biryani.png" },
  { name: "Chinese", img: "/images/cuisines/Chinese.png" },
  { name: "Pizzas", img: "/images/cuisines/Pizza.png" },
  { name: "Burgers", img: "/images/cuisines/burger.png" },
  { name: "North Indian", img: "/images/cuisines/northindian.png" },
  { name: "Momos", img: "/images/cuisines/Momos.png" },
  { name: "Meals", img: "/images/cuisines/meals.png" },
  { name: "Pure Veg", img: "/images/cuisines/PureVeg.png" },
  { name: "Ice cream", img: "/images/cuisines/icecream.png" }
];

const categoryList = [
  "All Offers",
  "Malls",
  "Independent Restaurants",
  "Catering Services",
];

const SecondaryNav: React.FC<Props> = ({ selectedCategory, onSelectCategory, onAddBusiness }) => {
  const categories = [
    ...categoryList,
    ...(SHOW_ENTERTAINMENT ? ["Entertainment"] : []),
    ...(SHOW_FINANCIAL_SERVICE ? ["Financial Service"] : []),
  ];

  if (SHOW_CUISINE_NAV) {
    // Classic nav
    return (
      <div className="bg-purple-600 text-white w-full">
        <div className="container mx-auto px-2 w-full py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Dropdown for mobile */}
          <div className="relative w-full sm:hidden">
            <select
              value={selectedCategory}
              onChange={e => onSelectCategory(e.target.value)}
              className="w-full bg-purple-700 text-white px-4 py-2 rounded font-medium appearance-none pr-8"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
          {/* Horizontal buttons for desktop */}
          <div className="hidden sm:flex flex-row flex-wrap sm:flex-nowrap items-center gap-4 w-full">
            {categories.map(c => (
              <button
                key={c}
                className={`hover:text-purple-200 font-medium whitespace-nowrap ${selectedCategory === c ? "text-orange-300" : ""}`}
                onClick={() => onSelectCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            className="bg-orange-500 text-white px-3 py-1 rounded font-medium flex items-center text-sm whitespace-nowrap mt-2 sm:mt-0"
            onClick={onAddBusiness}
          >
            <span className="mr-2">+</span>
            Add your Business
          </button>
        </div>
      </div>
    );
  }
  // Cuisine image layout
  // Add ref for scrolling
  const cuisineRowRef = React.useRef<HTMLDivElement>(null);

  const scrollBy = (offset: number) => {
    if (cuisineRowRef.current) {
      cuisineRowRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white w-full py-4">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">What's on your mind?</h2>
          <div className="flex gap-2">
            <button
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-200"
              aria-label="Previous"
              onClick={() => scrollBy(-160)}
            >
              &#8592;
            </button>
            <button
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-200"
              aria-label="Next"
              onClick={() => scrollBy(160)}
            >
              &#8594;
            </button>
          </div>
        </div>
        <div
          ref={cuisineRowRef}
          className="flex flex-row gap-8 pb-2 justify-start overflow-x-auto scrollbar-hide"
          style={{ maxWidth: '100%', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cuisineList.map(c => (
            <div key={c.name} className="flex flex-col items-center w-32 flex-shrink-0">
              <img src={c.img} alt={c.name} className="w-24 h-24 object-contain rounded-full shadow mb-2" />
              <span className="text-lg font-medium text-gray-700" style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 400 }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;