import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cusineLists } from "../config/appConfig";

export default function AboutUs() {
  const navigate = useNavigate();

  // Cuisine images to rotate in the banner
  const cuisineImages = [
    { name: "Pizza", img: "/images/cuisines/Pizza.png" },
    { name: "Burger", img: "/images/cuisines/Burger.png" },
    { name: "Arabic", img: "/images/cuisines/ArabicDishes.png" },
    { name: "Ice Cream", img: "/images/cuisines/Ice Cream.png" },
    { name: "Chinese", img: "/images/cuisines/Chinese.png" },
    { name: "Dessert", img: "/images/cuisines/Desserts.png" },
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % cuisineImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-100 py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 relative">

        {/* Animated Top Banner */}
        <div className="relative h-56 w-full overflow-hidden">
          {cuisineImages.map((c, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? "opacity-100" : "opacity-0"
                }`}
              style={{
                backgroundImage: `url(${c.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          ))}
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
              <ArrowLeft size={20} />
              <span className="font-semibold">Back to Home</span>
            </button>
            <img src="/bqLogo.jpg" alt="Browse Qatar" className="h-6 w-auto" />
          </div>


          <h1 className="text-lg md:text-2xl font-serif font-black text-green-900 leading-tight mb-2 text-center">
            No Waste... More Tasty!!!
          </h1>

          {/* Core About Text */}
          <p className="text-gray-700 leading-relaxed mb-4 text-center">
            Welcome to <strong>BQ&apos;s Dine Offers</strong>, part of
            <strong> BrowseQatar.com</strong> — your trusted platform to discover
            the best food offers in Qatar.
            <span className="font-semibold text-green-600">
              {" "}Our primary motto is to reduce food wastage while helping you save money.
            </span>
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            We connect food lovers with top food offers in Qatar,
            making it easy to explore the best dining deals in Qatar
            across Doha and beyond. From premium restaurants to
            affordable restaurants in Doha, BrowseQatar helps you
            enjoy great food without overspending.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Whether you are searching for cheap food offers in Qatar,
            planning a night out with loved ones, or looking for
            family dinner buffet offers, our platform brings everything
            together in one place. You can easily find
            the best food offers in Qatar today, updated regularly for your convenience.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            BrowseQatar also highlights budget-friendly options (QAR 5–20),
            helping students, families, and professionals enjoy quality dining experiences.
            From casual cafés to the best restaurants in Qatar,
            you can find all dining offers here — simple, transparent, and value-driven.
          </p>

          <h2 className="text-md md:text-lg font-semibold text-green-900 mt-6 mb-3 text-center">
            What We Offer at BrowseQatar
          </h2>
          <h3 className="text-sm md:text-base font-semibold text-green-800 mt-5 mb-2">
            Discover the Best Food Offers in Qatar
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            BrowseQatar helps food lovers discover the best food offers in Qatar today by
            bringing together dining deals from restaurants, cafés, and hotels across Doha
            and other locations.
          </p>

          <h3 className="text-sm md:text-base font-semibold text-green-800 mt-5 mb-2">
            Affordable Dining Deals for Every Budget
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We feature low price food offers in Qatar along with budget-friendly options from
            QAR 5 to 20, making it easy to enjoy affordable restaurants in Doha.
          </p>

          <h3 className="text-sm md:text-base font-semibold text-green-800 mt-5 mb-2">
            Family Dinner Buffet Offers & Group Dining
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            BrowseQatar highlights family dinner buffet offers and group dining deals that
            are perfect for weekends, celebrations, and special occasions.
          </p>

          <h3 className="text-sm md:text-base font-semibold text-green-800 mt-5 mb-2">
            Explore the Best Restaurants in Qatar & Doha
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            From popular brands to local favorites, BrowseQatar showcases some of the best
            restaurants in Qatar and affordable restaurants in Doha.
          </p>

          {/* Cuisine Icons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-6">
            {cuisineImages.map((e) => (
              <div key={e.name} className="flex flex-col items-center justify-center">
                <img
                  src={e.img}
                  alt={e.name}
                  className="w-16 h-16 object-contain hover:scale-110 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-6 px-4 mt-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3">
            <p className="m-0 text-gray-900">
              © {new Date().getFullYear()} BrowseQatar Offers Platform. All rights reserved.
            </p>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <img src="/meraki.webp" alt="Meraki AI" className="w-5 h-5 object-contain" />
              <span>Powered by MerakiAi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
