// Service for offers. Returns Promises so UI components can consume the same API
// whether data comes from local JSON or a backend endpoint later.

import { OFFERS_URL } from '../config/apiConfig';
import { LOG_API_RESPONSE } from '../config/appConfig';

async function fetchJsonWithFallback(url, fallbackUrl) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      if (LOG_API_RESPONSE && typeof window !== 'undefined') {
        window.__offerDataSource = 'API';
        console.log('[OfferService] Data fetched from API:', url);
      }
      return await res.json();
    }
  } catch (err) {
    // fall through to fallback fetch
  }
  try {
    const res = await fetch(fallbackUrl);
    if (res.ok) {
      if (LOG_API_RESPONSE && typeof window !== 'undefined') {
        window.__offerDataSource = 'LOCAL_JSON';
        console.log('[OfferService] Data fetched from local JSON:', fallbackUrl);
      }
      return await res.json();
    }
  } catch (err) {
    // return empty array on failure
  }
  if (LOG_API_RESPONSE && typeof window !== 'undefined') {
    window.__offerDataSource = 'NONE';
    console.log('[OfferService] No offer data found.');
  }
  return [];
}

async function loadOffers() {
  // Use public/data/offers.json as fallback for production
  return await fetchJsonWithFallback(OFFERS_URL, '/data/offers.json');
}

// Public methods to get offers
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

export async function searchOffersByCuisine(cuisine) {
  const res = await fetch(`${OFFERS_URL}/search/${encodeURIComponent(cuisine)}`);
  if (!res.ok) throw new Error("Failed to search offers");
  return await res.json();
}

// === ADMIN METHODS ===

// Upload or update an offer with image
export async function uploadOffer(formData, options = {}) {
  try {
    const res = await fetch(`${OFFERS_URL}`, {
      method: 'POST',
      body: formData,
      headers: options.headers || {},
    });
    if (!res.ok) throw new Error('Failed to upload offer');
    return await res.json();
  } catch (err) {
    console.error('[OfferService] uploadOffer error:', err);
    throw err;
  }
}

// Delete offer by ID
export async function deleteOffer(id, options = {}) {
  try {
    const res = await fetch(`${OFFERS_URL}/${id}`, {
      method: 'DELETE',
      headers: options.headers || {},
    });
    if (!res.ok) throw new Error('Failed to delete offer');
    return await res.json();
  } catch (err) {
    console.error('[OfferService] deleteOffer error:', err);
    throw err;
  }
}

// Get offer image URL
export function getOfferImageUrl(id) {
  return `${OFFERS_URL}/${id}/image`;
}
// --- offerService.js ---
//export const getOfferImageUrl = (offerId) =>
//  `${import.meta.env.VITE_API_BASE_URL}/api/offers/${offerId}/image`;


export default {
  getAllOffers,
  getOfferById,
  getOffersByRestaurantId,
  uploadOffer,
  deleteOffer,
  getOfferImageUrl,
};
