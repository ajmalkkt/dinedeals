// Service for restaurants. Mirrors the offers service API style.

import { RESTAURANTS_URL } from '../config/apiConfig';
import { LOG_API_RESPONSE } from '../config/appConfig';

async function fetchJsonWithFallback(url, fallbackUrl) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (LOG_API_RESPONSE && typeof window !== 'undefined') {
        window.__restaurantDataSource = 'API';
        console.log('[RestaurantService] Data fetched from API:', url, data);
      }
      return data;
    }
  } catch (err) {
    // fall through
  }
  try {
    const res = await fetch(fallbackUrl);
    if (res.ok) {
      const data = await res.json();
      if (LOG_API_RESPONSE && typeof window !== 'undefined') {
        window.__restaurantDataSource = 'LOCAL_JSON';
        console.log('[RestaurantService] Data fetched from local JSON:', fallbackUrl, data);
      }
      return data;
    }
  } catch (err) {
    // fall through
  }
  if (LOG_API_RESPONSE && typeof window !== 'undefined') {
    window.__restaurantDataSource = 'NONE';
    console.log('[RestaurantService] No restaurant data found.');
  }
  return [];
}

async function loadRestaurants() {
  // Use public/data/restaurants.json as fallback for production
  return await fetchJsonWithFallback(RESTAURANTS_URL, '/data/restaurants.json');
}

export async function getAllRestaurants() {
  return await loadRestaurants();
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
export async function uploadRestaurant(formData) {
  try {
    const res = await fetch(`${RESTAURANTS_URL}`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload restaurant');
    return await res.json();
  } catch (err) {
    console.error('[RestaurantService] uploadRestaurant error:', err);
    throw err;
  }
}

// Get logo or brand image URL for restaurant
export function getRestaurantImageUrl(id, type = 'logo') {
  return `${RESTAURANTS_URL}/${id}/image/${type}`;
}

export default {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantsByCountry,
  uploadRestaurant,
  getRestaurantImageUrl,
};
