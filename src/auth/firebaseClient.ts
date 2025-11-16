import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword } from 'firebase/auth';

// Minimal firebase client — expects env var prefixed with VITE_FIREBASE_*
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let auth: ReturnType<typeof getAuth> | null = null;
let provider: GoogleAuthProvider | null = null;

if (isConfigured) {
  try {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    auth = getAuth();
    provider = new GoogleAuthProvider();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Firebase:', err);
    auth = null;
    provider = null;
  }
} else {
  // eslint-disable-next-line no-console
  console.warn(
    'Firebase not configured. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID in your .env to enable Firebase auth.'
  );
}

export async function firebaseLogin() {
  if (!auth || !provider) {
    throw new Error('Firebase is not configured. Login is disabled.');
  }
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function firebaseLoginWithEmail(email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function firebaseLogout() {
  if (!auth) throw new Error('Firebase is not configured.');
  await signOut(auth);
}

export function getFirebaseAuth() {
  if (!auth) throw new Error('Firebase is not configured.');
  return auth;
}
