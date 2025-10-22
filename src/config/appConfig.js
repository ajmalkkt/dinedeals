
  const SHOW_DISCOUNTED_PRICE = import.meta.env.VITE_SHOW_DISCOUNTED_PRICE === "true";
  const SHOW_CUISINE_NAV = import.meta.env.VITE_SHOW_CUISINE_NAV === "true";

  const ENQUIRY_EMAIL = import.meta.env.VITE_ENQUIRY_EMAIL || "info@dinedeals.com";
  const ENQUIRY_PHONE = import.meta.env.VITE_ENQUIRY_PHONE || "+974 1234 5678";

  const SHOW_OFFER_TYPE_FILTER = import.meta.env.VITE_SHOW_OFFER_TYPE_FILTER === "true";
  const SHOW_OFFER_DETAIL = import.meta.env.VITE_SHOW_OFFER_DETAIL === "true";
  const SHOW_OFFER_AVATAR = import.meta.env.VITE_SHOW_OFFER_AVATAR === "true";
  const LOG_API_RESPONSE = import.meta.env.VITE_LOG_API_RESPONSE === "true";

  const DEFAULT_COUNTRY = import.meta.env.VITE_DEFAULT_COUNTRY || "Qatar";
  const DEFAULT_CATEGORY = import.meta.env.VITE_DEFAULT_CATEGORY || "All Offers";

  const SHOW_OFFERS = import.meta.env.VITE_SHOW_OFFERS === "true";
  const SHOW_PRODUCTS = import.meta.env.VITE_SHOW_PRODUCTS === "true";
  const SHOW_COUPONS = import.meta.env.VITE_SHOW_COUPONS === "true";
  const SHOW_ENTERTAINMENT = import.meta.env.VITE_SHOW_ENTERTAINMENT === "true";
  const SHOW_FINANCIAL_SERVICE = import.meta.env.VITE_SHOW_FINANCIAL_SERVICE === "true";


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
  'Saudi Arabia': "Saudi Arabia",
};

export default { 
  cuisineOptions,
  locationOptions,
  offerTypeOptions,
  countryMap,
};

export {
  DEFAULT_COUNTRY,
  DEFAULT_CATEGORY,
  SHOW_PRODUCTS,
  SHOW_COUPONS,
  SHOW_ENTERTAINMENT,
  SHOW_FINANCIAL_SERVICE,
  SHOW_OFFERS,
  SHOW_OFFER_TYPE_FILTER,
  SHOW_OFFER_DETAIL,  
  SHOW_OFFER_AVATAR,
  ENQUIRY_EMAIL,
  ENQUIRY_PHONE,
  SHOW_CUISINE_NAV,
  SHOW_DISCOUNTED_PRICE,
  LOG_API_RESPONSE,
};
