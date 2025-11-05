import React, { useState } from "react";
import { SHOW_PRODUCTS, SHOW_COUPONS } from "../config/appConfig";
import { SHOW_OFFERS } from "../config/appConfig";

interface Props {
  onSearch: (q: string) => void;
  selectedCountry: string;
  onSelectCountry: (c: string) => void;
  onAddBusiness: () => void;
  onSearchClick?: (cuisine: string | null, isSeach: boolean | true) => void; // optional search click handler
  searchQuery: string;
}

export default function TopHeader(
  { onSearch, selectedCountry, onSelectCountry, onAddBusiness, onSearchClick, searchQuery }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  // to set the search key, use useState feature 
  //this method will be called when input changes for search text box
  // and pass it to onSearchClick when search button is clicked 
  // passing true for isSearch to indicate search button click  
  const [searchKey, setSearchKey] = useState<string | null>(null);
  const handleSearchClick = () => {
    onSearchClick(searchKey, true);
  };
  return (
    <header className="bg-white shadow-md w-full">
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-2 py-2 w-full">
          {/* 3-level stacking on mobile, single row on desktop */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between w-full">
            {/* Level 1: logo, country dropdown, hamburger menu (mobile only) */}
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-100 to-orange-200 text-blue-700 px-1.5 py-1 rounded-xl font-semibold text-lg shadow-sm border border-blue-300">
                <img
                  src="/browseQtr.webp"
                  alt="DineDeals Icon"
                  className="w-6 h-6 rounded-full border border-orange-300 shadow-sm"
                />
                <span className="block truncate tracking-wide">DineDeals</span>
              </div>

              <div className="flex md:hidden items-center gap-2">
                <select
                  value={selectedCountry}
                  onChange={(e) => onSelectCountry(e.target.value)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium border-none outline-none cursor-pointer w-[70%] min-w-[90px] max-w-[140px] ml-auto block"
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
                    <button onClick={() => { setMenuOpen(false); onAddBusiness(); }} className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100">Add Your Business</button>
                    <a href="/admin" className="block w-full text-left px-4 py-2 text-green-700 hover:bg-gray-100">Admin Panel</a>
                  </div>
                )}
              </div>
            </div>
            {/* Level 2: nav buttons */}
            <div className="flex flex-row items-center gap-2 md:ml-4 md:w-auto w-full overflow-x-auto md:overflow-x-visible">
              {SHOW_OFFERS && (
                <button className="bg-purple-600 text-white px-5 py-1 rounded-full font-medium text-sm">Offers</button>
              )}
              {SHOW_PRODUCTS && (
                <button className="bg-blue-600 text-white px-5 py-1 rounded-full font-medium text-sm">Products</button>
              )}
              {SHOW_COUPONS && (
                <button className="bg-blue-600 text-white px-5 py-1 rounded-full font-medium text-sm">Coupons</button>
              )}
            </div>
            {/* Level 3: search bar, country dropdown, hamburger (desktop only) */}
            <div className="flex flex-row items-center gap-2 w-full">
              <input
                type="text"
                value={searchQuery}
                placeholder="Find restaurant offers and deals"
                className="w-[80%] md:w-[80%] flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm"
                onChange={(e) => {
                                  onSearch(e.target.value);
                                  setSearchKey(e.target.value);
                                }
                         }
              />
              <button className="bg-purple-600 text-white px-5 py-1 rounded-full font-medium text-sm"
                onClick={()=>handleSearchClick()}>Search</button>
              <div className="hidden md:flex items-center gap-2">
                <select
                  value={selectedCountry}
                  onChange={(e) => onSelectCountry(e.target.value)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium border-none outline-none cursor-pointer w-[70%] min-w-[90px] max-w-[140px] ml-auto block"
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
                    <button onClick={() => { setMenuOpen(false); onAddBusiness(); }} className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100">Add Your Business</button>
                    <a href="/admin" className="block w-full text-left px-4 py-2 text-green-700 hover:bg-gray-100">Admin Panel</a>
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
