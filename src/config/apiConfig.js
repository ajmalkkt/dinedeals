// Centralized API/static asset URLs. Update here to change endpoints globally.

// Optional base API — if you switch to a backend, set this and compose paths
export const BASE_API = 'http://localhost:5000/api';
export const OFFERS_URL = `${BASE_API}/offers`;
export const RESTAURANTS_URL = `${BASE_API}/restaurants`;

export const ENQUIRY_API_URL = `${BASE_API}/send-enquiry`;

export default {
  OFFERS_URL,
  RESTAURANTS_URL,
  BASE_API,
  ENQUIRY_API_URL,
};
