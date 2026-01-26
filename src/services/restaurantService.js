// Service for restaurants. Mirrors the offers service API style.

import { RESTAURANTS_URL, BULK_API_URL } from '../config/apiConfig';
import { LOG_API_RESPONSE } from '../config/appConfig';
import { getAuthToken } from '../auth/firebaseClient';

async function fetchJsonWithFallback(url, fallbackUrl) {
  // Prevent continuous retries when the backend returns no data/errors.
  // Simple per-URL in-memory attempt counter + cooldown.
  const MAX_ATTEMPTS = 100; // stop after this many consecutive failures
  const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes cooldown
  if (!globalThis.__restaurantFetchState) globalThis.__restaurantFetchState = {};
  const state = globalThis.__restaurantFetchState[url] || { attempts: 0, lastAttempt: 0 };
  const now = Date.now();
  // If exceeded attempts and still in cooldown window, skip network call
  if (state.attempts >= MAX_ATTEMPTS && now - state.lastAttempt < COOLDOWN_MS) {
    if (LOG_API_RESPONSE && typeof window !== 'undefined') {
      console.log('[RestaurantService] Skipping fetch (cooldown):', url, state);
    }
    return [];
  }

  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (LOG_API_RESPONSE && typeof window !== 'undefined') {
        window.__restaurantDataSource = 'API';
        console.log('[RestaurantService] Data fetched from API:', url, data);
      }
      // success => reset state
      globalThis.__restaurantFetchState[url] = { attempts: 0, lastAttempt: Date.now() };
      return data;
    }
  } catch (err) {
    // fall through
  }

  // mark failed attempt
  state.attempts = (state.attempts || 0) + 1;
  state.lastAttempt = Date.now();
  globalThis.__restaurantFetchState[url] = state;
  if (LOG_API_RESPONSE && typeof window !== 'undefined') {
    window.__restaurantDataSource = 'NONE';
    console.log('[RestaurantService] No restaurant data found.', state);
  }
  console.log('[RestaurantService] No restaurant data found. Attempt:', state.attempts);
  return [];
}

async function loadRestaurants() {
  // Simple in-memory cache to prevent multiple components from triggering
  // repeated network requests. TTL of 5 minutes.
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
  if (!globalThis.__restaurantCache) globalThis.__restaurantCache = { data: null, ts: 0 };
  const cache = globalThis.__restaurantCache;
  const now = Date.now();
  if (cache.data && now - cache.ts < CACHE_TTL_MS) {
    if (LOG_API_RESPONSE && typeof window !== 'undefined') {
      console.log('[RestaurantService] Returning cached restaurants');
    }
    return cache.data;
  }
  // Fetch fresh data and populate cache
  const data = await fetchJsonWithFallback(RESTAURANTS_URL, '/data/restaurants.json');
  cache.data = data;
  cache.ts = Date.now();
  return data;
}

export async function getAllRestaurants() {
  return await loadRestaurants();
}
//getAllOwnerRestaurants
export async function getAllOwnerRestaurants() {
  const res = await fetch(`${RESTAURANTS_URL}/all/active`);
  if (!res.ok) throw new Error("Failed to fetch active offers");
  return res.json();
}

export async function getRestaurantById(id) {
  const restaurants = await loadRestaurants();
  const nid = typeof id === 'string' ? Number(id) : id;
  return restaurants.find((r) => r.id === nid) || null;
}

export async function getRestaurantsByCountry(country) {
  const restaurants = await loadRestaurants();
  if (!country) return restaurants;
  return restaurants.filter((r) => String(r.country).toLowerCase() === String(country).toLowerCase());
}
// === ADMIN METHODS ===

// Upload or update a restaurant with images
export async function uploadRestaurant(formData, options = {}) {
  try {
    // ✅ FIX: Await the token here first
    const token = await getAdminAuthToken();
    const res = await fetch(`${RESTAURANTS_URL}`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(options.headers || {}), // pass x-api-token here
        'Authorization': `Bearer ${token}`,
        // Note: If sending JSON, ensure 'Content-Type': 'application/json' is in options.headers
        // If sending FormData, do NOT set Content-Type manually.
      },
    });
    if (!res.ok) throw new Error('Failed to upload restaurant');
    return await res.json();
  } catch (err) {
    console.error('[RestaurantService] uploadRestaurant error:', err);
    throw err;
  }
}

export async function uploadBulkData(options = {}) {
  try {
    // 1. Merge the token into the headers
    const token = await getAdminAuthToken();
    const res = await fetch(`${BULK_API_URL}`, {
      method: "POST",
      headers: {
        ...(options.headers || {}), // pass x-api-token here
        'Authorization': `Bearer ${token}`,
        // Note: If sending JSON, ensure 'Content-Type': 'application/json' is in options.headers
        // If sending FormData, do NOT set Content-Type manually.
      },
      // assuming backend accepts no body, or you can add formData/json if needed
    });
    if (!res.ok) throw new Error("Failed to perform bulk upload");
    return await res.json();
  } catch (err) {
    console.error("[RestaurantService] uploadBulkData error:", err);
    throw err;
  }
}
//deleteRestaurant  
export async function deleteRestaurant(id, options = {}) {
  try {
    // 1. Merge the token into the headers
    const token = await getAdminAuthToken();
    const res = await fetch(`${RESTAURANTS_URL}/${id}`, {
      method: "DELETE",
      headers: {
        ...(options.headers || {}), // pass x-api-token here
        'Authorization': `Bearer ${token}`,
        // Note: If sending JSON, ensure 'Content-Type': 'application/json' is in options.headers
        // If sending FormData, do NOT set Content-Type manually.
      },
    });
    if (!res.ok) throw new Error("Failed to delete restaurant");
    return await res.json();
  } catch (err) {
    console.error("[RestaurantService] deleteRestaurant error:", err);
    throw err;
  }
}

//Get the auth token for admin operations
export async function getAdminAuthToken() {
  // 1. Get the Firebase Token automatically
  const token = await getAuthToken();

  if (!token) {
    console.warn("User is not authenticated. Please login...");
    // You could also throw an error here to stop the request immediately
    throw new Error("Authentication required");
  }
  return token;
}

// Get logo or brand image URL for restaurant
export function getRestaurantImageUrl(id, type = 'logo') {
  return `${RESTAURANTS_URL}/${id}/image/${type}`;
}
// --- restaurantService.js ---
//export const getRestaurantImageUrl = (restaurantId, type = "logo") =>
//  `${import.meta.env.VITE_API_BASE_URL}/api/restaurants/${restaurantId}/image/${type}`;


export default {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantsByCountry,
  uploadRestaurant,
  getRestaurantImageUrl,
};
