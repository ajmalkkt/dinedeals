import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import OffersGrid from "./OffersGrid";
import TopHeader from "./TopHeader";
import EnquiryPopup from "./EnquiryPopup";
import SecondaryNav from "./SecondaryNav";
import FeaturedCard from "./FeaturedCard";
import PopularBrands from "./PopularBrands";
import { getAllOffers, searchOffersByCuisine, getOffersByRestaurantId } from "../services/offerService"; // 👈 add search API
import { getAllRestaurants } from "../services/restaurantService";
import {
  cuisineOptions,
  locationOptions,
  offerTypeOptions,
  countryMap,
  DEFAULT_COUNTRY,
  DEFAULT_CATEGORY,
  SHOW_CUISINE_NAV,
  SHOW_OFFER_DETAIL,
} from "../config/appConfig";

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

// Available filter options are imported from ../config/appConfig


function Home() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [filters, setFilters] = useState({
    cuisines: [] as string[],
    locations: [] as string[],
    offerTypes: [] as string[],
  });

  // initial load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const offersResult = await getAllOffers();
        const restaurantsResult = await getAllRestaurants();
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

  // filter locally
  useEffect(() => {
    let result = [...offers];
    if (selectedCountry && countryMap[selectedCountry]) {
      result = result.filter((offer) => offer.country === countryMap[selectedCountry]);
    }
    if (selectedCategory !== "All Offers") {
      result = result.filter((offer) => offer.category === selectedCategory);
    }
    if (filters.cuisines && filters.cuisines.length > 0) {
      result = result.filter((offer) => filters.cuisines.includes(offer.cuisine));
    }
    if (filters.locations && filters.locations.length > 0) {
      result = result.filter((offer) =>
        filters.locations.some((loc) => offer.location.includes(loc))
      );
    }
    if (filters.offerTypes && filters.offerTypes.length > 0) {
      result = result.filter((offer) => filters.offerTypes.includes(offer.offerType));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((offer) => {
        const restaurant = restaurants.find((r) => r.id === offer.restaurantId);
        return (
          offer.title.toLowerCase().includes(query) ||
          offer.description.toLowerCase().includes(query) ||
          (restaurant && restaurant.name.toLowerCase().includes(query))
        );
      });
    }
    setFilteredOffers(result);
  }, [offers, filters, searchQuery, restaurants, selectedCountry, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    //scrollToOffers();  // 🍽 scroll to offers on typing..
  };

  const handleFilterChange = (payload: {
    cuisines: string[];
    locations: string[];
    offerTypes: string[];
  }) => {
    setFilters({
      cuisines: payload.cuisines || [],
      locations: payload.locations || [],
      offerTypes: payload.offerTypes || [],
    });
  };

  // 🍽 handle cuisine click
 
  const handleCuisineSelect = async (cuisine: string | null, 
    isSearch:boolean | false) => {
    setLoading(true);
    try {
      if (!cuisine) {
        // 👈 All Offers clicked → reset to all
        const all = await getAllOffers();
        setFilteredOffers(all);
      } else {
        const result = await searchOffersByCuisine(cuisine);
        setFilteredOffers(result);
      }
      //Clear the search box once a cuisine is selected
      handleClearSearch(isSearch);
      scrollToOffers();
    } catch (error) {
      console.error("Error fetching cuisine offers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Inside Home component
  //This funnction clears the search box when a cuisine is selected
  // to avoid confusion between search and cuisine selection
  const handleClearSearch = (isSeach : boolean | false) => {
    if (isSeach) return; // do not clear if it is a search action
    setSearchQuery(""); // clears text in TopHeader
  };

  // Handle restaurant selection from PopularBrands
  const handleSelectRestaurant = async (id : String | null) => {
    setLoading(true);
    try {
      const result = await getOffersByRestaurantId(id);
      //console.log("Offers for restaurant id ", id, ": ", result);
      setFilteredOffers(result);
      //Clear the search box once a restaurant is selected
      handleClearSearch(false);
    } catch (error) {
      console.error("Error fetching cuisine offers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to offers section when a cuisine or restaurant is selected
  const offersSectionRef = React.useRef<HTMLElement | null>(null);
  const scrollToOffers = () => {
    setTimeout(() => {
      offersSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200); // small delay to let DOM update
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader
        onSearch={handleSearch}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        onAddBusiness={() => setEnquiryOpen(true)}
        onSearchClick={handleCuisineSelect}
        searchQuery={searchQuery}
      />

      <SecondaryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddBusiness={() => setEnquiryOpen(true)}
        onCuisineSelect={handleCuisineSelect} 
      />

      <main className="container mx-auto px-4 py-3">
        <FeaturedCard />
        <PopularBrands 
          onSelectRestaurant={handleSelectRestaurant}
        />
        {!SHOW_CUISINE_NAV && (
          <section className="mb-2">
            <FilterBar onFilterChange={handleFilterChange} />
          </section>
        )}

        <section ref={offersSectionRef} className="mb-12">
          <h2 className="font-bold brand-gradient-bg text-white px-3 py-1 rounded-md text-sm font-semibold mb-1">Hey, Enjoy your offers here...</h2>
          <OffersGrid
            offers={filteredOffers}
            restaurants={restaurants}
            isLoading={loading}
            showOfferDetail={SHOW_OFFER_DETAIL}
          />
        </section>
      </main>

      <footer className="bg-muted py-6 px-4 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3">
            <p className="m-0">© 2025 Restaurant Offers Platform. All rights reserved.</p>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <img src={'/meraki.webp'} alt="Meraki AI" className="w-6 h-6 object-contain" />
              <span>Powered by MerakiAi</span>
            </div>
          </div>
        </div>
      </footer>

      <EnquiryPopup open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </div>
  );
}

export default Home;
