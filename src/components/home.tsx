import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import OffersGrid from "./OffersGrid";
import TopHeader from "./TopHeader";
import SecondaryNav from "./SecondaryNav";
import FeaturedCard from "./FeaturedCard";
import PopularBrands from "./PopularBrands";
import offersData from "../data/offers.json";
import restaurantsData from "../data/restaurants.json";
import {
  cuisineOptions,
  locationOptions,
  offerTypeOptions,
  countryMap,
  DEFAULT_COUNTRY,
  DEFAULT_CATEGORY,
} from "../config/appConfig";

// Types for our data
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

export default function Home() {
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

  // (PopularBrands scrolling logic moved into its own component)

  // Fetch data (simulated)
  useEffect(() => {
    // Simulate API call delay
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOffers(offersData as Offer[]);
        setRestaurants(restaurantsData as Restaurant[]);
        setFilteredOffers(offersData as Offer[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...offers];

    // Apply country filter using centralized countryMap
    if (selectedCountry && countryMap[selectedCountry]) {
      result = result.filter((offer) => offer.country === countryMap[selectedCountry]);
    }

    // Apply category filter
    if (selectedCategory !== "All Offers") {
      result = result.filter((offer) => offer.category === selectedCategory);
    }

    // Apply cuisine filter (support multiple selections)
    if (filters.cuisines && filters.cuisines.length > 0) {
      result = result.filter((offer) => filters.cuisines.includes(offer.cuisine));
    }

    // Apply location filter (match any selected location substring)
    if (filters.locations && filters.locations.length > 0) {
      result = result.filter((offer) =>
        filters.locations.some((loc) => offer.location.includes(loc)),
      );
    }

    // Apply offer type filter (support multiple selections)
    if (filters.offerTypes && filters.offerTypes.length > 0) {
      result = result.filter((offer) => filters.offerTypes.includes(offer.offerType));
    }

    // Apply search query
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
  }, [
    offers,
    filters,
    searchQuery,
    restaurants,
    selectedCountry,
    selectedCategory,
  ]);

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filter changes from FilterBar which supplies arrays
  const handleFilterChange = (payload: { cuisines: string[]; locations: string[]; offerTypes: string[] }) => {
    setFilters({
      cuisines: payload.cuisines || [],
      locations: payload.locations || [],
      offerTypes: payload.offerTypes || [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader onSearch={handleSearch} selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
      <SecondaryNav selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
  {/* Main content */}
  <main className="container mx-auto px-4 py-3">
    <FeaturedCard />
    <PopularBrands />

  {/* Filters */}
  <section className="mb-2">
          <FilterBar onFilterChange={handleFilterChange} />
        </section>

        {/* Offers grid */}
        <section>
          <h2 className="text-2xl font-semibold mb-1.5">Available Offers</h2>
          <OffersGrid
            offers={filteredOffers}
            restaurants={restaurants}
            isLoading={loading}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6 px-4 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Restaurant Offers Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
