import React, { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { SHOW_OFFER_AVATAR } from "../config/appConfig";

interface Offer {
  id: number;
  title: string;
  description: string;
  restaurantId: number;
  cuisine: string;
  originalPrice: number;
  discountedPrice: number;
  offerType: string;
  validFrom: string;
  validTo: string;
  imageUrl: string;
  location: string;
}

interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  rating: number;
  cuisine: string[];
  logoUrl: string;
}


interface OfferCardProps {
  offer: Offer;
  restaurantName: string;
  restaurantLogo: string;
  showOfferDetail?: boolean;
  showOfferAvatar?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  restaurantName,
  restaurantLogo,
  showOfferDetail = true,
  showOfferAvatar = true,
}) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img
          src={
            offer.imageUrl ||
            "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80"
          }
          alt={offer.title}
          className="h-40 w-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
          {((1 - offer.discountedPrice / offer.originalPrice) * 100).toFixed(0)}% OFF
        </div>
        {showOfferAvatar && (
          <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded-full p-1">
            <img
              src={
                restaurantLogo ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                  restaurantName
              }
              alt={restaurantName}
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
        )}
      </div>
      {showOfferDetail && (
        <div className="p-3">
          <h3 className="font-semibold text-base line-clamp-1">{offer.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-1">
            {offer.description}
          </p>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">
              {restaurantName}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-muted-foreground">
                ₹{offer.originalPrice}
              </span>
              <span className="font-semibold text-sm">
                ₹{offer.discountedPrice}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              Valid till: {new Date(offer.validTo).toLocaleDateString()}
            </span>
            <span className="bg-muted text-xs px-2 py-1 rounded-full">
              {offer.offerType}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

interface OffersGridProps {
  offers?: Offer[];
  restaurants?: Restaurant[];
  isLoading?: boolean;
  showOfferDetail?: boolean;
}

const OffersGrid = ({
  offers = [],
  restaurants = [],
  isLoading = false,
  showOfferDetail = true,
}: OffersGridProps) => {
  // `home.tsx` performs filtering (including multi-select). This component
  // simply renders the offers list it receives to avoid duplicate/conflicting
  // filter logic.
  const filteredOffers = offers;

  const getRestaurantName = (id: number): string => {
    const restaurant = restaurants.find((r) => r.id === id);
    return restaurant ? restaurant.name : "Unknown Restaurant";
  };

  const getRestaurantLogo = (id: number): string => {
    const restaurant = restaurants.find((r) => r.id === id);
    return restaurant ? restaurant.logoUrl : "https://api.dicebear.com/7.x/avataaars/svg?seed=restaurant";
  };

  if (isLoading) {
    return (
      <div className="bg-background w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Skeleton className="h-[160px] w-full rounded-lg" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredOffers.length === 0) {
    return (
      <div className="bg-background w-full flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-1">No offers found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query to find more restaurant offers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
        {filteredOffers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            restaurantName={getRestaurantName(offer.restaurantId)}
            restaurantLogo={getRestaurantLogo(offer.restaurantId)}
            showOfferDetail={showOfferDetail}
            showOfferAvatar={SHOW_OFFER_AVATAR}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersGrid;
