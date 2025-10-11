import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import OffersGrid from "./OffersGrid";
import TopHeader from "./TopHeader";
import EnquiryPopup from "./EnquiryPopup";
import SecondaryNav from "./SecondaryNav";
import FeaturedCard from "./FeaturedCard";
import PopularBrands from "./PopularBrands";
import { getAllOffers } from "../services/offerService";
import { getAllRestaurants } from "../services/restaurantService";
import {
  cuisineOptions,
  locationOptions,
  offerTypeOptions,
  countryMap,
  DEFAULT_COUNTRY,
  DEFAULT_CATEGORY,
  SHOW_OFFER_DETAIL,
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
        filters.locations.some((loc) => offer.location.includes(loc)),
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
  }, [
    offers,
    filters,
    searchQuery,
    restaurants,
    selectedCountry,
    selectedCategory,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (payload: { cuisines: string[]; locations: string[]; offerTypes: string[] }) => {
    setFilters({
      cuisines: payload.cuisines || [],
      locations: payload.locations || [],
      offerTypes: payload.offerTypes || [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader
        onSearch={handleSearch}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        onAddBusiness={() => setEnquiryOpen(true)}
      />
      <SecondaryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddBusiness={() => setEnquiryOpen(true)}
      />
      <main className="container mx-auto px-4 py-3">
        <FeaturedCard />
        <PopularBrands />
        <section className="mb-2">
          <FilterBar onFilterChange={handleFilterChange} />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-1.5">Hey, Enjoy your offers here...</h2>
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
          <p>© 2025 Restaurant Offers Platform. All rights reserved.</p>
        </div>
      </footer>
      <EnquiryPopup open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </div>
  );
}

export default Home;
