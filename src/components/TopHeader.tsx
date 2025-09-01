import React from "react";

interface Props {
  onSearch: (q: string) => void;
  selectedCountry: string;
  onSelectCountry: (c: string) => void;
}

export default function TopHeader({ onSearch, selectedCountry, onSelectCountry }: Props) {
  return (
    <header className="bg-white shadow-md">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-lg">
                DineDeals
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <button className="bg-purple-600 text-white px-5 py-1 rounded-full font-medium text-sm">
                Offers
              </button>
              <button className="bg-blue-600 text-white px-5 py-1 rounded-full font-medium text-sm">
                Products
              </button>
              <button className="bg-blue-600 text-white px-5 py-1 rounded-full font-medium text-sm">
                Coupons
              </button>
            </div>

            {/* Search and Country */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Find restaurant offers and deals"
                  className="w-72 px-3 py-1 border border-gray-300 rounded-full text-sm"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
              <button className="bg-purple-600 text-white px-5 py-1 rounded-full font-medium text-sm">
                Search
              </button>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => onSelectCountry(e.target.value)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium border-none outline-none cursor-pointer"
                >
                  <option value="Qatar">🇶🇦 QA-EN</option>
                  <option value="UAE">🇦🇪 AE-EN</option>
                  <option value="Bahrain">🇧🇭 BH-EN</option>
                  <option value="Kuwait">🇰🇼 KW-EN</option>
                  <option value="Saudi Arabia">🇸🇦 SA-EN</option>
                </select>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 font-medium hover:text-purple-600">LOGIN</button>
              <button className="md:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
