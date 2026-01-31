import React, { useState, useEffect, useMemo, useRef } from "react";
import { LayoutGrid, ArrowUp } from "lucide-react"; // Import Icons

// Components
import FilterBar from "./FilterBar";
import OffersGrid from "./OffersGrid";
import TopHeader from "./TopHeader";
import EnquiryPopup from "./EnquiryPopup";
import SecondaryNav from "./SecondaryNav";
import FeaturedCard from "./FeaturedCard";
import PopularBrands from "./PopularBrands";
import SaveFoodPopup from "./SaveFoodPopup";

// Hooks / Context
import { useFavoritesContext } from "../contexts/FavoritesContext";

// Services & Config
import { getAllOffers, searchOffersByCuisine, getOffersByRestaurantId } from "../services/offerService";
import { getAllRestaurants } from "../services/restaurantService";
import {
  countryMap,
  DEFAULT_COUNTRY,
  DEFAULT_CATEGORY,
  SHOW_CUISINE_NAV,
  SHOW_OFFER_DETAIL,
} from "../config/appConfig";

// Types
interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  rating: number;
  cuisine: string[];
  logoUrl: string;
  country: string;
}
interface Offer {
  id: number;
  title: string;
  description: string;
  restaurantId: number;
  cuisine: string;
  originalPrice: number;
  discountedPrice: number;
  offerType: string;
  validFrom: string;
  validTo: string;
  imageUrl: string;
  location: string;
  country: string;
  category: string;
}

function Home() {
  // --- Favorites Context ---
  const { favorites, toggleFavorite } = useFavoritesContext();

  // --- UI State ---
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [showFloatBtn, setShowFloatBtn] = useState(false); // Toggle float button visibility

  // --- Data State ---
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Filter State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [filters, setFilters] = useState({
    cuisines: [] as string[],
    locations: [] as string[],
    offerTypes: [] as string[],
  });
  // ✅ New State for the Popup
  const [isSaveFoodOpen, setSaveFoodOpen] = useState(false);
  const [sortOption, setSortOption] = useState("");

  // Refs for scrolling
  const categoriesRef = useRef<HTMLDivElement>(null);
  const offersSectionRef = useRef<HTMLElement | null>(null);

  // 1. Initial Load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [offersResult, restaurantsResult] = await Promise.all([
          getAllOffers(),
          getAllRestaurants(),
        ]);
        setOffers(offersResult);
        setRestaurants(restaurantsResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Track Scrolling to show/hide Floating Button
  useEffect(() => {
    const handleScroll = () => {
      // Show button if scrolled down more than 300px
      if (window.scrollY > 300) {
        setShowFloatBtn(true);
      } else {
        setShowFloatBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Filtering Logic (Memoized)
  const restaurantLookup = useMemo(() => {
    const lookup = new Map();
    restaurants.forEach((r) => lookup.set(r.id, r.name.toLowerCase()));
    return lookup;
  }, [restaurants]);

  useEffect(() => {
    let result = [...offers];
    if (selectedCountry && countryMap[selectedCountry]) {
      result = result.filter((offer) => offer.country === countryMap[selectedCountry]);
    }
    if (selectedCategory !== "All Offers") {
      result = result.filter((offer) => offer.category === selectedCategory);
    }
    if (filters.cuisines?.length > 0) {
      result = result.filter((offer) => filters.cuisines.includes(offer.cuisine));
    }
    if (filters.locations?.length > 0) {
      result = result.filter((offer) =>
        filters.locations.some((loc) => offer.location.includes(loc))
      );
    }
    if (filters.offerTypes?.length > 0) {
      result = result.filter((offer) => filters.offerTypes.includes(offer.offerType));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((offer) => {
        // Fast lookup using the Map we created earlier
        const restaurantName = restaurantLookup.get(offer.restaurantId) || "";
        return (
          (offer.title && offer.title.toLowerCase().includes(query)) ||
          (offer.description && offer.description.toLowerCase().includes(query)) ||
          restaurantName.includes(query)
        );
      });
    }

    setFilteredOffers(result);
  }, [offers, filters, searchQuery, restaurantLookup, restaurants, selectedCountry, selectedCategory]);

  const sortedOffers = useMemo(() => {
    let sortable = [...filteredOffers];
    const option = sortOption || "best-value"; // Default to best-value if empty

    sortable.sort((a, b) => {
      if (option === "price-asc") {
        return a.discountedPrice - b.discountedPrice;
      } else if (option === "price-desc") {
        return b.discountedPrice - a.discountedPrice;
      } else if (option === "best-value") {
        // Sort by discount percentage descending
        const discountA = (a.originalPrice - a.discountedPrice) / a.originalPrice;
        const discountB = (b.originalPrice - b.discountedPrice) / b.originalPrice;
        return discountB - discountA;
      }
      return 0;
    });
    return sortable;
  }, [filteredOffers, sortOption]);

  // 1. Calculate if Super Saver exists
  // We use useMemo so it doesn't recalculate on every scroll, only when 'offers' changes.
  const hasSuperSaverOffers = useMemo(() => {
    return offers.some((offer) => offer.cuisine === "Super Saver");
  }, [offers]);
  // --- Handlers ---

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (payload: any) => {
    setFilters({
      cuisines: payload.cuisines || [],
      locations: payload.locations || [],
      offerTypes: payload.offerTypes || [],
    });
  };

  const handleCuisineSelect = async (cuisine: string | null, isSearch: boolean | false) => {
    setLoading(true);
    try {
      if (!cuisine) {
        // All Offers clicked → reset to all
        const all = await getAllOffers();
        setFilteredOffers(all);
      } else {
        const result = await searchOffersByCuisine(cuisine);
        setFilteredOffers(result);
      }
      if (!isSearch) setSearchQuery("");
      scrollToOffers();
    } catch (error) {
      console.error("Error fetching cuisine offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRestaurant = async (id: String | null) => {
    setLoading(true);
    try {
      const result = await getOffersByRestaurantId(id);
      setFilteredOffers(result);
      setSearchQuery("");
    } catch (error) {
      console.error("Error fetching cuisine offers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll Helpers
  const scrollToOffers = () => {
    setTimeout(() => {
      // 80px offset for the sticky header
      const yOffset = -80;
      const element = offersSectionRef.current;
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  };

  const scrollToCategories = () => {
    // Scroll back up to the SecondaryNav
    if (categoriesRef.current) {
      // 90px offset so the Sticky TopHeader doesn't cover the categories
      const yOffset = -90;
      const y = categoriesRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // ✅ New Handler: Filter for super saver/50% Savings
  const handleFindBigSavings = () => {

    setSaveFoodOpen(false);
    // 3. Update UI Text/Selection to show user what happened
    //setSearchQuery(""); 
    handleCuisineSelect("Super Saver", false); // seaech for super savers

  };

  return (
    <div className="min-h-screen bg-background relative">

      {/* 
         ✅ STICKY TOP HEADER ONLY 
         This stays fixed at the top. z-50 ensures it's above everything.
      */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <TopHeader
          onSearch={handleSearch}
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          onAddBusiness={() => setEnquiryOpen(true)}
          onSearchClick={handleCuisineSelect}
          searchQuery={searchQuery}
        />
      </div>

      {/* 
         ✅ CATEGORIES (SecondaryNav) 
         This scrolls naturally with the page, but we attach a ref to scroll back to it.
      */}
      <div ref={categoriesRef} className="bg-white">
        <SecondaryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddBusiness={() => setEnquiryOpen(true)}
          onCuisineSelect={handleCuisineSelect}
        />
      </div>
      {/* 🔍 SEO Marquee Strip */}
      <div className="overflow-hidden bg-green-50 border-green-200">
        <div className="whitespace-nowrap animate-marquee py-1 text-sm font-medium text-green-900">
          <span className="mx-6">
            Best food offers in Qatar today • Family dinner buffet offers •
            Top food offers in Qatar • Budget-friendly options (QAR 5–20) • Best restaurants in Qatar •
            Affordable restaurants in Doha • Discover the best dining deals in Qatar on BrowseQatar
          </span>
        </div>
      </div>
      <main className="container mx-auto px-2 py-1">
        <div className="mt-0">
          <FeaturedCard
            onTextClick={() => setSaveFoodOpen(true)}
            onSuperSaverClick={() => handleCuisineSelect("Super Saver", false)}
            // 2. Pass the calculated boolean
            showSuperSaverButton={hasSuperSaverOffers}
          />
        </div>

        <PopularBrands
          onSelectRestaurant={handleSelectRestaurant}
        />

        {!SHOW_CUISINE_NAV && (
          <section className="mb-2">
            <FilterBar onFilterChange={handleFilterChange} />
          </section>
        )}

        <section ref={offersSectionRef} className="mb-12">
          <div className="flex flex-row justify-between items-center mb-1 gap-4">
            <h2 className="brand-gradient-bg text-white px-3 py-1 rounded-md text-sm font-semibold">
              Enjoy your offers...
            </h2>

            <div className="flex items-center gap-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="brand-gradient-bg text-white border-none rounded-md text-sm focus:ring-2 focus:ring-white/20 outline-none cursor-pointer py-1 px-2"
              >
                <option value="" disabled className="text-gray-500 bg-white">Sort By</option>
                <option value="price-asc" className="text-gray-700 bg-white">Low to High</option>
                <option value="best-value" className="text-gray-700 bg-white">Best Value</option>
                <option value="price-desc" className="text-gray-700 bg-white">High to Low</option>
              </select>
            </div>
          </div>
          <OffersGrid
            offers={sortedOffers}
            restaurants={restaurants}
            isLoading={loading}
            showOfferDetail={SHOW_OFFER_DETAIL}
            favorites={favorites.map((f) => f.id)}
            onToggleFavorite={toggleFavorite}
          />
        </section>
      </main>

      {/* 
        ✅ FLOATING CATEGORIES BUTTON
        Appears only when user scrolls down.
      */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${showFloatBtn ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <button
          onClick={scrollToCategories}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full px-2 py-1 flex items-center gap-2 font-semibold transition-transform hover:scale-105 active:scale-95"
        >
          <LayoutGrid size={15} />
          <span className="text-sm">Categories</span>
        </button>
      </div>

      <footer className="bg-muted py-6 px-4 mt-12 pb-20"> {/* pb-20 adds space for float button */}
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3">
            <p className="m-0">© {new Date().getFullYear()} BrowseQatar Offers Platform. All rights reserved.</p>
            <span className="text-muted-foreground mr-2">|</span>
            <a href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors mr-3 underline">
              Terms & Conditions
            </a>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <img src={'/meraki.webp'} alt="Meraki AI" className="w-6 h-6 object-contain" />
              <span>Powered by MerakiAi</span>
            </div>
          </div>
        </div>
      </footer>
      {/* ✅ Add the Popup Component */}
      <SaveFoodPopup
        isOpen={isSaveFoodOpen}
        onClose={() => setSaveFoodOpen(false)}
        onFindDeals={handleFindBigSavings}
      />
      <EnquiryPopup open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </div>
  );
}

export default Home;