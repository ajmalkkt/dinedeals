import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOfferById } from "../services/offerService";
import { getAllRestaurants } from "../services/restaurantService";
import { Skeleton } from "./ui/skeleton";
import { MapPin, Calendar, Phone, ArrowLeft, Share2 } from "lucide-react";
import { SHOW_DISCOUNTED_PRICE } from "../config/appConfig";
import { toast } from "react-toastify";

// Reusing interfaces (or import if centralized)
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

const OfferDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [offer, setOffer] = useState<Offer | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (id) {
                    const offerData = await getOfferById(id);
                    setOffer(offerData);

                    if (offerData) {
                        const allRestaurants = await getAllRestaurants();
                        const restaurantData = allRestaurants.find((r: Restaurant) => r.id === offerData.restaurantId);
                        setRestaurant(restaurantData || null);
                    }
                }
            } catch (error) {
                console.error("Failed to load offer details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast.success("Link copied to clipboard!");
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-64 w-full rounded-xl mb-4" />
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Offer Not Found</h2>
                <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Nav */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back</span>
                    </Link>
                    <img src="/bqLogo.jpg" alt="Browse Qatar" className="h-10 object-contain" />
                    <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-2xl">

                {/* Intro Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Discover the best dining deals in Qatar with <span className="font-semibold text-blue-600">Browse Qatar</span>.
                        We bring you exclusive offers from top restaurants, cafes, and eateries.
                        Enjoy great food at unbeatable prices!
                    </p>
                </div>

                {/* Offer & Restaurant Content */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Image */}
                    <div className="relative h-64 sm:h-80 w-full bg-gray-100">
                        <img
                            src={offer.imageUrl}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm text-blue-600">
                            {offer.offerType}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Title & Price */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{offer.title}</h1>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={16} />
                                    <span>Valid until {new Date(offer.validTo).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-gray-400 line-through text-sm">QR {offer.originalPrice}</span>
                                <span className="text-3xl font-bold text-blue-600">QR {offer.discountedPrice}</span>
                                {!SHOW_DISCOUNTED_PRICE && (
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded mt-1">
                                        {((1 - offer.discountedPrice / offer.originalPrice) * 100).toFixed(0)}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-6" />

                        {/* Restaurant Info */}
                        {restaurant && (
                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center gap-4 mb-3">
                                    <img
                                        src={restaurant.logoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${restaurant.name}`}
                                        alt={restaurant.name}
                                        className="w-12 h-12 rounded-full bg-white shadow-sm object-cover"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
                                        <p className="text-xs text-gray-500">{restaurant.cuisine.join(", ")}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    {restaurant.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                                            <span>{restaurant.address}</span>
                                        </div>
                                    )}
                                    {restaurant.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone size={18} className="text-blue-500 shrink-0" />
                                            <a href={`tel:${restaurant.phone}`} className="hover:text-blue-600 underline-offset-4 hover:underline">
                                                {restaurant.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-6">
                            <button onClick={handleShare} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2">
                                <Share2 size={20} />
                                Share this Offer
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-3">
                                Share this link with friends to let them know about this deal!
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferDetails;
