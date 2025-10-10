// Service for restaurants. Mirrors the offers service API style.

import { RESTAURANTS_URL } from '../config/apiConfig';

async function fetchJsonWithFallback(url, importPath) {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (err) {
    // fall through
  }

  try {
    const module = await import(/* @vite-ignore */ importPath);
    return module.default || module;
  } catch (err) {
    return [];
  }
}

async function loadRestaurants() {
  return await fetchJsonWithFallback(RESTAURANTS_URL, '../data/restaurants.json');
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

export default {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantsByCountry,
};
