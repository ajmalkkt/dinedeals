
const SHOW_DISCOUNTED_PRICE = import.meta.env.VITE_SHOW_DISCOUNTED_PRICE === "true";
const SHOW_CUISINE_NAV = import.meta.env.VITE_SHOW_CUISINE_NAV === "true";

const ENQUIRY_EMAIL = import.meta.env.VITE_ENQUIRY_EMAIL || "info@dinedeals.com";
const ENQUIRY_PHONE = import.meta.env.VITE_ENQUIRY_PHONE || "+974 1234 5678";

const SHOW_OFFER_TYPE_FILTER = import.meta.env.VITE_SHOW_OFFER_TYPE_FILTER === "true";
const SHOW_OFFER_DETAIL = import.meta.env.VITE_SHOW_OFFER_DETAIL === "true";
const SHOW_OFFER_AVATAR = import.meta.env.VITE_SHOW_OFFER_AVATAR === "true";
const LOG_API_RESPONSE = import.meta.env.VITE_LOG_API_RESPONSE === "true";
const ENABLE_RANDOM_SORT = import.meta.env.VITE_ENABLE_RANDOM_SORT === "true";

// Restaurant sorting configuration
// Options: 'ID' (latest first), 'RATING' (highest first), 'LATEST' (updatedAt), 'NONE'
const RESTAURANT_SORT_CONFIG = import.meta.env.VITE_RESTAURANT_SORT_CONFIG || 'ID';

// Auth provider: KEYCLOAK or FIREBASE
const AUTH_PROVIDER = (import.meta.env.VITE_AUTH_PROVIDER || "KEYCLOAK").toUpperCase();

// Feature flags for signup (disabled by default, set VITE_ENABLE_SIGNUP=true to enable)
const ENABLE_SIGNUP = import.meta.env.VITE_ENABLE_SIGNUP === "true";

const DEFAULT_COUNTRY = import.meta.env.VITE_DEFAULT_COUNTRY || "Qatar";
const DEFAULT_CATEGORY = import.meta.env.VITE_DEFAULT_CATEGORY || "All Offers";

const SHOW_OFFERS = import.meta.env.VITE_SHOW_OFFERS === "true";
const SHOW_PRODUCTS = import.meta.env.VITE_SHOW_PRODUCTS === "true";
const SHOW_COUPONS = import.meta.env.VITE_SHOW_COUPONS === "true";
const SHOW_ENTERTAINMENT = import.meta.env.VITE_SHOW_ENTERTAINMENT === "true";
const SHOW_FINANCIAL_SERVICE = import.meta.env.VITE_SHOW_FINANCIAL_SERVICE === "true";


export const cuisineOptions = [
  "Super Saver",
  "Qatari Dine",
  "Arabic Dishes",
  "Mandi",
  "Fried Chicken",
  "Grill",
  "Shawaya",
  "Shawarma",
  "Pizza",
  "Burger",
  "Sandwich",
  "Bakes",
  "Juice",
  "Falooda",
  "Ice Cream",
  "Dessert",
  "Coffee",
  "Tea",
  "Healthy",
  "Philipino Cuisine",
  "Chinese",
  "Italian",
  "Thailand Cuisine",
  "Pakistani Food",
  "South Indian",
  "North Indian",
  "Sadya",
];

export const cuisineLists = [
  { name: "Qatari Dine", img: "/images/cuisines/QatariDine.png" },
  { name: "Arabic Dishes", img: "/images/cuisines/ArabicDishes.png" },
  { name: "Mandi", img: "/images/cuisines/Mandi.png" },
  { name: "Fried Chicken", img: "/images/cuisines/FriedChicken.png" },
  { name: "Grill", img: "/images/cuisines/Grill.png" },
  { name: "Shawaya", img: "/images/cuisines/Shawaya.png" },
  { name: "Shawarma", img: "/images/cuisines/Shawarma.png" },
  { name: "Pizza", img: "/images/cuisines/Pizza.png" },
  { name: "Burger", img: "/images/cuisines/Burger.png" },
  { name: "Sandwich", img: "/images/cuisines/Sandwich.png" },
  { name: "Bakes", img: "/images/cuisines/Bakes.png" },
  { name: "Juice", img: "/images/cuisines/Juice.png" },
  { name: "Falooda", img: "/images/cuisines/Falooda.png" },
  { name: "Ice Cream", img: "/images/cuisines/Ice Cream.png" },
  { name: "Dessert", img: "/images/cuisines/Desserts.png" },
  { name: "Coffee", img: "/images/cuisines/Coffee.png" },
  { name: "Tea", img: "/images/cuisines/Tea.png" },
  { name: "Healthy", img: "/images/cuisines/Healthy.png" },
  { name: "Philipino", img: "/images/cuisines/Philipino.png" },
  { name: "Chinese", img: "/images/cuisines/Chinese.png" },
  { name: "Italian", img: "/images/cuisines/Pasta.png" },
  { name: "Thai", img: "/images/cuisines/Thai.png" },
  { name: "Pakistani", img: "/images/cuisines/PakFood.png" },
  { name: "South Indian", img: "/images/cuisines/South Indian.png" },
  { name: "North Indian", img: "/images/cuisines/North Indian.png" },
  { name: "Sadya", img: "/images/cuisines/Sadya.png" },
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
  cuisineLists,
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
  AUTH_PROVIDER,
  ENABLE_SIGNUP,
  ENABLE_RANDOM_SORT,
  RESTAURANT_SORT_CONFIG,
};

