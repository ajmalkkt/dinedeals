
// Application-level constants and options derived from the mock data so
// components can import a single source of truth that stays in sync with
// `src/data/offers.json` and `src/data/restaurants.json`.

// Lists populated directly from `src/data/offers.json` and `src/data/restaurants.json`.
// These are explicit values (no runtime iteration).

export const cuisineOptions = [
  "All",
  "Asian",
  "Catering",
  "Chinese",
  "Continental",
  "Fast Food",
  "Fusion",
  "Indian",
  "Italian",
  "Japanese",
  "Multi-cuisine",
  "Snacks",
];

export const locationOptions = [
  "All",
  "Doha, West Bay",
  "Dubai Mall, Dubai",
  "Doha, Pearl Qatar",
  "City Centre Doha",
  "Doha, Business District",
  "Marina Walk, Dubai",
  "Villaggio Mall, Doha",
  "Dubai, Al Barsha",
];

export const offerTypeOptions = [
  "All",
  "Buffet",
  "Combo",
  "Happy Hour",
  "Special",
  "Catering",
  "Discount",
];

export const countryMap = {
  Qatar: "Qatar",
  UAE: "UAE",
  Bahrain: "Bahrain",
  Kuwait: "Kuwait",
  "Saudi Arabia": "Saudi Arabia",
};

export const DEFAULT_COUNTRY = "All";
export const DEFAULT_CATEGORY = "All Offers";

// Feature flags for showing/hiding buttons/links
export const SHOW_OFFERS = false;
export const SHOW_PRODUCTS = false;
export const SHOW_COUPONS = false;
export const SHOW_ENTERTAINMENT = false;
export const SHOW_FINANCIAL_SERVICE = false;

export default {
  cuisineOptions,
  locationOptions,
  offerTypeOptions,
  countryMap,
  DEFAULT_COUNTRY,
  DEFAULT_CATEGORY,
  SHOW_PRODUCTS,
  SHOW_COUPONS,
  SHOW_ENTERTAINMENT,
  SHOW_FINANCIAL_SERVICE,
  SHOW_OFFERS,
};
