import React from "react";

interface Props {
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
}

export default function SecondaryNav({ selectedCategory, onSelectCategory }: Props) {
  return (
    <div className="bg-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-8">
            {[
              "All Offers",
              "Malls",
              "Independent Restaurants",
              "Catering Services",
              "Entertainment",
              "Financial Service",
            ].map((c) => (
              <button
                key={c}
                className={`hover:text-purple-200 font-medium ${selectedCategory === c ? "text-orange-300" : ""}`}
                onClick={() => onSelectCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <button className="bg-orange-500 text-white px-3 py-1 rounded font-medium flex items-center text-sm">
            <span className="mr-2">+</span>
            Add your company
          </button>
        </div>
      </div>
    </div>
  );
}
