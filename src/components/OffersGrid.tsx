import React, { useState, useEffect } from "react";
import { ZoomInIcon, ZoomOutIcon } from "@radix-ui/react-icons";
import { Skeleton } from "./ui/skeleton";
import { Calendar, MapPin } from "lucide-react";
import { SHOW_OFFER_AVATAR, SHOW_DISCOUNTED_PRICE } from "../config/appConfig";

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
  restaurantAddress?: string;
  restaurantLogo: string;
  showOfferDetail?: boolean;
  showOfferAvatar?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  restaurantName,
  restaurantAddress,
  restaurantLogo,
  showOfferDetail = true,
  showOfferAvatar = true,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  // For navigation, get all offers from context/prop (lifted up in OffersGrid)
  const [modalIndex, setModalIndex] = React.useState(0);
  // We'll pass offers and index as props for navigation
  // But for now, just single image per card
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative">
          <img
            src={
              offer.imageUrl ||
              "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80"
            }
            alt={offer.title}
            className="h-40 w-full object-cover cursor-pointer"
            onClick={() => setShowModal(true)}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80";
            }}
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
            {SHOW_DISCOUNTED_PRICE
              ? <span className="text-lg font-bold text-white">QR-{offer.discountedPrice}</span>
              : <span className="text-lg font-bold text-white">{((1 - offer.discountedPrice / offer.originalPrice) * 100).toFixed(0)}% OFF</span>}
          </div>
          {showOfferAvatar && (
            <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded-full p-1">
              <img
                src={
                  restaurantLogo ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${restaurantName}`
                }
                alt={restaurantName}
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${restaurantName}`;
                }}
              />
            </div>
          )}
        </div>
        {showOfferDetail && (
          <div className="p-3">
            <h3 className="font-semibold text-base line-clamp-1">{offer.title}</h3>
            {/* Description removed as per requirements */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">
                {restaurantName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm line-through text-muted-foreground">
                  QR-{offer.originalPrice}
                </span>
                <span className="font-semibold text-sm">
                  QR-{offer.discountedPrice}
                </span>
              </div>
            </div>
            <div className="mb-1">
              {restaurantAddress && (
                  <>
                    <MapPin className="inline h-4 w-4 text-muted-foreground" />
                    <span>{restaurantAddress}</span>
                  </>
                )}
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-2 max-w-lg w-full relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 z-20 text-gray-600 hover:text-black text-xl font-bold bg-white/80 rounded-full w-8 h-8 flex items-center justify-center"
              style={{boxShadow: '0 1px 4px rgba(0,0,0,0.08)'}}
              onClick={e => { e.stopPropagation(); setShowModal(false); }}
              tabIndex={0}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center w-full relative justify-center">
              <button className="text-2xl px-2 text-gray-400 hover:text-black" style={{visibility:'hidden'}} disabled>&lt;</button>
              <div className="relative w-full flex justify-center">
                <img
                  src={offer.imageUrl || "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80"}
                  alt={offer.title}
                  className="w-full h-auto max-h-[70vh] object-contain rounded"
                  style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
                />
                <div className="absolute top-2 right-2 flex gap-2 bg-white/60 rounded-lg p-1 hover:bg-white/90 transition-colors" style={{backdropFilter:'blur(2px)'}}>
                  <button className="p-1 rounded hover:bg-gray-300 text-gray-700" onClick={handleZoomOut} title="Zoom Out">
                    <ZoomOutIcon className="w-5 h-5" />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-300 text-gray-700" onClick={handleZoomIn} title="Zoom In">
                    <ZoomInIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button className="text-2xl px-2 text-gray-400 hover:text-black" style={{visibility:'hidden'}} disabled>&gt;</button>
            </div>
            {showOfferDetail && (
              <div className="mt-2 text-center">
                <h3 className="font-semibold text-lg">{offer.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">{offer.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
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

  const getRestaurantAddress = (id: number): string => {
    const restaurant = restaurants.find((r) => r.id === id);
    return restaurant ? restaurant.address : "Unknown Restaurant";
  };

  const getRestaurantLogo = (id: number): string => {
    const restaurant = restaurants.find((r) => r.id === id);
    return (
      restaurant?.logoUrl ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=restaurant"
    );
  };


  if (isLoading) {
    return (
      <div className="bg-background w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-0">
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
      <div className="bg-background w-full flex flex-col items-center justify-center py-8 px-0">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-1">No offers found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query to find more restaurant offers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-0">
        {filteredOffers.map((offer) => {
          const restaurant = restaurants.find((r) => r.id === offer.restaurantId);
          return (
            <OfferCard
              key={offer.id}
              offer={offer}
              restaurantName={restaurant ? restaurant.name : getRestaurantName(offer.restaurantId)}
              restaurantAddress={restaurant ? restaurant.address : getRestaurantAddress(offer.restaurantId)}
              restaurantLogo={getRestaurantLogo(offer.restaurantId)}
              showOfferDetail={showOfferDetail}
              showOfferAvatar={SHOW_OFFER_AVATAR}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OffersGrid;
