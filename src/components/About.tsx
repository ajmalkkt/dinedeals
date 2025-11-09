import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
        {/* Back button */}
        <div className="flex items-center justify-between mb-2">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft size={20} /> <span className="font-semibold">Back to Home</span>
        </button>
        </div>

        <h1 className="text-2xl font-bold text-purple-700 mb-4">About Us</h1>

        <p className="text-gray-700 leading-relaxed mb-3">
          Welcome to <strong>DineDeals</strong> — your go-to destination for the best dining offers and restaurant deals across the region.
        </p>

        <p className="text-gray-700 leading-relaxed mb-3">
          We connect food lovers with exclusive promotions, helping you discover great places to dine while enjoying amazing discounts.
        </p>

        <p className="text-gray-700 leading-relaxed">
          Our mission is to make dining out rewarding — whether you're celebrating a special occasion, grabbing a quick meal, or exploring new cuisines.
        </p>
      </div>
    </div>
  );
}
