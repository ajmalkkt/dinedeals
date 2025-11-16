import React from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, Apple, LogOut } from "lucide-react";
import useAuth from "../auth/useAuth";

interface MenuOptionsProps {
  onAddBusiness: () => void;
  setMenuOpen: (open: boolean) => void;
}

export default function MenuOptions({ onAddBusiness, setMenuOpen }: MenuOptionsProps) {
  const navigate = useNavigate();
  const auth = useAuth();

  // ✅ Helper to navigate safely after menu closes
  const safeNavigate = (path: string) => {
    setMenuOpen(false);
    // Small timeout ensures DOM unmount before route change (important for mobile)
    setTimeout(() => {
      navigate(path);
    }, 120);
  };

  return (
    <div
      className="absolute right-0 top-10 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-30 overflow-hidden"
      onClick={(e) => e.stopPropagation()} // ✅ Prevent parent close trigger
    >
      {/* --- About Us --- */}
      <button
        onClick={() => safeNavigate("/about")}
        className="block w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-200 text-gray-700 font-medium"
      >
        About Us
      </button>
      
      {/* --- Register Business --- */}
      <button
        onClick={() => {
          setMenuOpen(false);
          setTimeout(() => onAddBusiness(), 120);
        }}
        className="block w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-200 text-gray-700 font-medium"
      >
        Register Your Business
      </button>

      {/* --- Admin --- */}
      <button
        onClick={() => safeNavigate("/admin")}
        className="block w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-200 text-gray-700 font-medium"
      >
        Add Your Offers
      </button>

      {/* --- Make Offer --- */}
      <button
        onClick={() => safeNavigate("/make-offer")}
        className="block w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-200 text-gray-700 font-medium"
      >
        Make Your Offer Online
      </button>

      {/* --- Contact Us --- */}
      <button
        onClick={() => {
          setMenuOpen(false);
          setTimeout(() => onAddBusiness(), 120);
        }}
        className="block w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-200 text-gray-700 font-medium"
      >
        Contact Us
      </button>

      {/* --- Login --- */}
      {!auth.initialized || !auth.user ? (
        <button
          onClick={() => {
            if (auth.provider === "FIREBASE") {
              // route to custom login page for Firebase (email/password)
              setMenuOpen(false);
              navigate("/login");
              return;
            }
            // Keycloak: trigger its login flow
            auth.login();
          }}
          className="block w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-200 text-gray-700 font-medium"
        >
          Login
        </button>
      ) : (
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">
            {auth.user?.email || auth.user?.preferred_username}
          </span>
          <button
            onClick={() => auth.logout({ redirectUri: window.location.origin } as any)}
            aria-label="Logout"
            title="Logout"
            className="ml-3 text-gray-700 hover:text-black hover:bg-gray-50 p-2 rounded"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}


      {/* --- Mobile App Section --- */}
      <div className="flex justify-around items-center py-4 bg-gray-50">
        <div
          className="flex flex-col items-center text-gray-600 cursor-pointer hover:text-black"
          onClick={() => alert("Coming soon!")}
        >
          <Smartphone className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Android</span>
        </div>
        <div
          className="flex flex-col items-center text-gray-600 cursor-pointer hover:text-black"
          onClick={() => alert("Coming soon!")}
        >
          <Apple className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">iOS</span>
        </div>
      </div>
    </div>
  );
}
