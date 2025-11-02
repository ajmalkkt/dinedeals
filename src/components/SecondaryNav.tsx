import React, { useRef, useState } from "react";
import {
  SHOW_ENTERTAINMENT,
  SHOW_FINANCIAL_SERVICE,
  SHOW_CUISINE_NAV,
} from "../config/appConfig";

interface Props {
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
  onAddBusiness: () => void;
  onCuisineSelect?: (cuisine: string | null) => void; // can be null for "All Offers"
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
  { name: "Ice cream", img: "/images/cuisines/icecream.png" },
];
const cuisineLists = [
  { name: "Qatari Dine", img: "/images/cuisines/QatariDine.png" },
  { name: "Arabic Dishes", img: "/images/cuisines/ArabicDishes.png" },
  { name: "Mandi", img: "/images/cuisines/Mandi.png" },
  { name: "Fried Chicken", img: "/images/cuisines/FriedChicken.png" },
  { name: "Grill", img: "/images/cuisines/Grill.png" },
  { name: "Shawaya", img: "/images/cuisines/Shawaya.png" },
  { name: "Shawarma", img: "/images/cuisines/Shawarma.png" },
  { name: "Pizza", img: "/images/cuisines/Pizza.png" },
  { name: "Burger", img: "/images/cuisines/Burger.png" },
  { name: "Sandwich", img: "/images/cuisines/Sandwich.png" },
  { name: "Bakes", img: "/images/cuisines/Bakes.png" },
  { name: "Juice", img: "/images/cuisines/Juice.png" },
  { name: "Falooda", img: "/images/cuisines/Falooda.png" },
  { name: "Ice Cream", img: "/images/cuisines/IceCream.png" },
  { name: "Dessert", img: "/images/cuisines/Dessert.png" },
  { name: "Coffee", img: "/images/cuisines/Coffee.png" },
  { name: "Tea", img: "/images/cuisines/Tea.png" },
  { name: "Healthy", img: "/images/cuisines/Healthy.png" },
  { name: "Philipino Cuisine", img: "/images/cuisines/PhilipinoCuisine.png" },
  { name: "Chinese", img: "/images/cuisines/Chinese.png" },
  { name: "Italian", img: "/images/cuisines/Italian.png" },
  { name: "Thailand Cuisine", img: "/images/cuisines/ThailandCuisine.png" },
  { name: "Pakistani Food", img: "/images/cuisines/PakistaniFood.png" },
  { name: "South Indian", img: "/images/cuisines/SouthIndian.png" },
  { name: "North Indian", img: "/images/cuisines/NorthIndian.png" },
  { name: "Sadya", img: "/images/cuisines/Sadya.png" },
];


const categoryList = [
  "All Offers",
  "Malls",
  "Independent Restaurants",
  "Catering Services",
];

const SecondaryNav: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  onAddBusiness,
  onCuisineSelect,
}) => {
  const cuisineRowRef = useRef<HTMLDivElement>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const scrollBy = (offset: number) => {
    cuisineRowRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleCuisineClick = (cuisine: string | null) => {
    setSelectedCuisine(cuisine);
    if (onCuisineSelect) onCuisineSelect(cuisine);
  };

  const categories = [
    ...categoryList,
    ...(SHOW_ENTERTAINMENT ? ["Entertainment"] : []),
    ...(SHOW_FINANCIAL_SERVICE ? ["Financial Service"] : []),
  ];

  if (SHOW_CUISINE_NAV) {
    return (
      <div className="bg-purple-600 text-white w-full">
        <div className="container mx-auto px-2 w-full py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Dropdown for mobile */}
          <div className="relative w-full sm:hidden">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="w-full bg-purple-700 text-white px-4 py-2 rounded font-medium appearance-none pr-8"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
          {/* Horizontal buttons for desktop */}
          <div className="hidden sm:flex flex-row flex-wrap sm:flex-nowrap items-center gap-4 w-full">
            {categories.map((c) => (
              <button
                key={c}
                className={`hover:text-purple-200 font-medium whitespace-nowrap ${
                  selectedCategory === c ? "text-orange-300" : ""
                }`}
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
            <span className="mr-2">+</span> Add your Business
          </button>
        </div>
      </div>
    );
  }

  // --- cuisine layout ---
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
          className="flex overflow-x-auto space-x-4 px-4 py-3 items-center scrollbar-hide"
          style={{
            maxWidth: "100%",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
        
        {/* --- All Offers (Clear Filter) item --- */}
        <div
          onClick={() => handleCuisineClick(null)}
          className={`flex flex-col items-center w-24 flex-shrink-0 cursor-pointer transition-transform transform-gpu origin-center ${
            selectedCuisine === null ? "scale-105" : "hover:scale-105"
          }`}
        >
          <div
            className={`w-16 h-16 flex items-center justify-center rounded-full shadow mb-1 text-base font-bold ${
              selectedCuisine === null
                ? "bg-white-500 text-white ring-4 ring-blue-400"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
          <img
            src="/images/cuisines/All.jpg"
            alt="All Offers"
            className={`w-16 h-16 object-contain rounded-full shadow mb-2 `}
          />
          </div>
          <span
            className={`text-sm font-medium ${
              selectedCuisine === null ? "text-blue-600" : "text-gray-700"
            }`}
            style={{ fontFamily: "Montserrat, Arial, sans-serif", fontWeight: 400 }}
          >
            All Offers
          </span>
        </div>

        {/* --- Cuisine items --- */}
        {cuisineList.map((c) => (
          <div
            key={c.name}
            onClick={() => handleCuisineClick(c.name)}
            className={`flex flex-col items-center w-24 flex-shrink-0 cursor-pointer transition-transform transform-gpu origin-center ${
              selectedCuisine === c.name ? "scale-105" : "hover:scale-105"
            }`}
          >
            <img
              src={c.img}
              alt={c.name}
              className={`w-16 h-16 object-contain rounded-full shadow mb-1 ${
                selectedCuisine === c.name ? "ring-4 ring-blue-400" : ""
              }`}
            />
            <span
              className={`text-sm font-medium ${
                selectedCuisine === c.name ? "text-blue-600" : "text-gray-700"
              }`}
              style={{ fontFamily: "Montserrat, Arial, sans-serif", fontWeight: 400 }}
            >
              {c.name}
            </span>
          </div>
        ))}
       </div>
      </div>
    </div>
  );
};

export default SecondaryNav;
