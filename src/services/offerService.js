// Service for offers. Returns Promises so UI components can consume the same API
// whether data comes from local JSON or a backend endpoint later.

import { OFFERS_URL } from '../config/apiConfig';

async function fetchJsonWithFallback(url, importPath) {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (err) {
    // fall through to dynamic import
  }

  // dynamic import fallback (works when bundler includes the JSON)
  try {
    const module = await import(importPath);
    return module.default || module;
  } catch (err) {
    // return empty array on failure to avoid throwing in UI
    return [];
  }
}

async function loadOffers() {
  return await fetchJsonWithFallback(OFFERS_URL, '../data/offers.json');
}

export async function getAllOffers() {
  return await loadOffers();
}

export async function getOfferById(id) {
  const offers = await loadOffers();
  const nid = typeof id === 'string' ? Number(id) : id;
  return offers.find((o) => o.id === nid) || null;
}

export async function getOffersByRestaurantId(restaurantId) {
  const offers = await loadOffers();
  const rid = typeof restaurantId === 'string' ? Number(restaurantId) : restaurantId;
  return offers.filter((o) => o.restaurantId === rid);
}

export default {
  getAllOffers,
  getOfferById,
  getOffersByRestaurantId,
};
