import React from "react";

interface Props {
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
}

export default function SecondaryNav({ selectedCategory, onSelectCategory }: Props) {
  const categories = [
    "All Offers",
    "Malls",
    "Independent Restaurants",
    "Catering Services",
    "Entertainment",
    "Financial Service",
  ];

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
        <button className="bg-orange-500 text-white px-3 py-1 rounded font-medium flex items-center text-sm whitespace-nowrap mt-2 sm:mt-0">
          <span className="mr-2">+</span>
          Add your Business
        </button>
      </div>
    </div>
  );
}