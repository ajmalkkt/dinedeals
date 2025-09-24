import React, { useState } from "react";

interface Props {
  onSearch: (q: string) => void;
  selectedCountry: string;
  onSelectCountry: (c: string) => void;
}

export default function TopHeader({ onSearch, selectedCountry, onSelectCountry }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-md w-full">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-2 py-2 w-full">
          {/* 3-level stacking on mobile, single row on desktop */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between w-full">
            {/* Level 1: logo, country dropdown, hamburger menu (mobile only) */}
            <div className="flex flex-row items-center justify-between w-full">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-lg">DineDeals</div>
              <div className="flex md:hidden items-center gap-2">
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
                <button className="relative" onClick={() => setMenuOpen((open) => !open)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 w-40 bg-white rounded shadow-lg z-10">
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">LOGIN</button>
                    <a href="#" className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100">Add Your Business</a>
                  </div>
                )}
              </div>
            </div>
            {/* Level 2: nav buttons */}
            <div className="flex flex-row items-center gap-2 md:ml-4 md:w-auto w-full overflow-x-auto md:overflow-x-visible">
              <button className="bg-purple-600 text-white px-5 py-1 rounded-full font-medium text-sm">Offers</button>
              <button className="bg-blue-600 text-white px-5 py-1 rounded-full font-medium text-sm">Products</button>
              <button className="bg-blue-600 text-white px-5 py-1 rounded-full font-medium text-sm">Coupons</button>
            </div>
            {/* Level 3: search bar, country dropdown, hamburger (desktop only) */}
            <div className="flex flex-row items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Find restaurant offers and deals"
                className="w-full md:w-auto flex-1 px-3 py-1 border border-gray-300 rounded-full text-sm"
                onChange={(e) => onSearch(e.target.value)}
              />
              <button className="bg-purple-600 text-white px-5 py-1 rounded-full font-medium text-sm">Search</button>
              <div className="hidden md:flex items-center gap-2">
                <select
                  value={selectedCountry}
                  onChange={(e) => onSelectCountry(e.target.value)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium border-none outline-none cursor-pointer"
                >
                  <option value="Qatar">QA-EN</option>
                  <option value="UAE">AE-EN</option>
                  <option value="Bahrain">BH-EN</option>
                  <option value="Kuwait">KW-EN</option>
                  <option value="Saudi Arabia">SA-EN</option>
                </select>
                <button className="relative" onClick={() => setMenuOpen((open) => !open)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 w-40 bg-white rounded shadow-lg z-10">
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">LOGIN</button>
                    <a href="#" className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100">Add Your Business</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
