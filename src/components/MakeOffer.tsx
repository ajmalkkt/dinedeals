import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ Add this
import { getInactiveOffers, activateOffers } from "../services/offerService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

interface Offer {
  id: number;
  title: string;
  restaurantId: number;
  cuisine?: string;
  validTo: string;
  active?: boolean;
  ownerLogin?: string;
}

export default function MakeOfferOnline() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const [validTo, setValidTo] = useState<Date | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Add navigate hook

  useEffect(() => {
    fetchInactiveOffers();
  }, []);

  const fetchInactiveOffers = async () => {
    try {
      const result = await getInactiveOffers();
      setOffers(result);
    } catch (err) {
      console.error("Error loading inactive offers:", err);
      toast.error("Failed to load offers");
    }
  };

  const handleSelectOffer = (id: number) => {
    setSelectedOffers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      toast.warning("Please enter your key before submitting.");
      return;
    }
    if (selectedOffers.length === 0) {
      toast.warning("Please select at least one offer to activate.");
      return;
    }

    setLoading(true);
    try {
      await activateOffers({
        offerIds: selectedOffers,
        validTill: validTo ? validTo.toISOString().split("T")[0] : undefined,
        apiKey,
      });
      toast.success("Offers activated successfully!");
      setSelectedOffers([]);
      setValidTo(null);
      setApiKey("");
      fetchInactiveOffers();
    } catch (err) {
      console.error("Error activating offers:", err);
      toast.error("Failed to activate offers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
        
        {/* ✅ Back Button */}
        {/* Back button */}
        <div className="flex items-center justify-between mb-2">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft size={20} /> <span className="font-semibold">Back to Home</span>
        </button>
        </div>

        <h1 className="text-2xl font-bold text-purple-700 mb-4">
          Make Your Offer Online
        </h1>
        <p className="text-gray-600 mb-6">
          Select inactive or expired offers, set a new expiry date, and activate them instantly.
        </p>

        <form
        onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
        }}
        >
        {/* Offer Multi-Select */}
        <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
            Select Offers
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto">
            {offers.length === 0 && (
                <p className="text-gray-500 text-sm">No inactive offers found.</p>
            )}
            {offers.map((offer) => (
                <label
                key={offer.id}
                className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-none"
                >
                <input
                    type="checkbox"
                    checked={selectedOffers.includes(offer.id)}
                    onChange={() => handleSelectOffer(offer.id)}
                />
                <span className="text-sm text-gray-700">
                    #{offer.id} — {offer.title} from Restaurant {offer.restaurantId} Owner: {offer.ownerLogin}{" "}
                    <span className="text-gray-500 text-xs">
                    (Valid till: {offer.validTo ? offer.validTo.split("T")[0] : "N/A"})
                    </span>
                </span>
                </label>
            ))}
            </div>
        </div>

        {/* ValidTo */}
        <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
            New Expiry Date
            </label>
            <DatePicker
            selected={validTo}
            onChange={(date: Date | null) => setValidTo(date ?? new Date())}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholderText="Select date"
            dateFormat="yyyy-MM-dd"
            />
        </div>

        {/* API Key */}
        <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-1">
            Your Key (required)
            </label>
            <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter your key"
            />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
            <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
            ← Back to Home
            </button>

            <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-md text-white font-semibold ${
                loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
            }`}
            >
            {loading ? "Activating..." : "Activate Selected Offers"}
            </button>
        </div>
        </form>
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
