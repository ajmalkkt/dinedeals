import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {cusineLists} from "../config/appConfig";

export default function AboutUs() {
  const navigate = useNavigate();

  // Cuisine images to rotate in the banner
  const cuisineImages = [
    "/images/cuisines/Pizza.png" ,
    "/images/cuisines/Burger.png" ,
    "/images/cuisines/Biryani.png" ,
    "/images/cuisines/Shawarma.png",
    "/images/cuisines/Chinese.png",
    "/images/cuisines/Desserts.png",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % cuisineImages.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-100 py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 relative">
        {/* Animated Top Banner */}
        <div className="relative h-56 w-full overflow-hidden">
          {cuisineImages.map((url, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          ))}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/70"></div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10">
          {/* Back button */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={20} />{" "}
              <span className="font-semibold">Back to Home</span>
            </button>
          </div>

          <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">
            About Us
          </h1>

          <p className="text-gray-700 leading-relaxed mb-3 text-center">
            Welcome to <strong>DineDeals</strong> — your go-to destination for
            the best dining offers and restaurant deals across the region.
          
            We connect food lovers with exclusive promotions, helping you
            discover great places to dine while enjoying amazing discounts.
          
            Our mission is to make dining out rewarding — whether you're
            celebrating a special occasion, grabbing a quick meal, or exploring
            new cuisines.
          </p>

          {/* Cuisine Icons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-6">
            {[ 
            { name: "Pizza", img: "/images/cuisines/Pizza.png" },
            { name: "Burger", img: "/images/cuisines/Burger.png" },
            { name: "Biryani", img: "/images/cuisines/Biryani.png" },
            { name: "Ice Cream", img: "/images/cuisines/Ice Cream.png" },
            { name: "Chinese", img: "/images/cuisines/Chinese.png" },
            { name: "Dessert", img: "/images/cuisines/Desserts.png" }].map(
            (e) => (
                <div
                  key={e.name}
                  className="flex flex-col items-center justify-center"
                >
                  <img
                    src={e.img}
                    alt={e.name}
                    className="w-16 h-16 object-contain hover:scale-110 transition-transform"
                  />
                  <span className="text-xs mt-1 text-gray-600">{e.name}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <footer className="bg-muted py-6 px-4 mt-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3">
            <p className="m-0">© 2025 BrowseQatar Offers Platform. All rights reserved.</p>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <img src={'/meraki.webp'} alt="Meraki AI" className="w-6 h-6 object-contain" />
              <span>Powered by MerakiAi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
