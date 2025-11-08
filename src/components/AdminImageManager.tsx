import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getAllRestaurants,
  uploadRestaurant,
  uploadBulkData,
} from "../services/restaurantService";
import {
  getOffersByRestaurantId,
  uploadOffer,
  deleteOffer,
} from "../services/offerService";

export default function AdminPanel() {
  const navigate = useNavigate();
  const offerInputRef = useRef(null);

  // ===== States =====
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [offers, setOffers] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [brandPreview, setBrandPreview] = useState(null);

  const [mode, setMode] = useState("manual"); // 'manual' or 'bulk'
  const [apiKey, setApiKey] = useState("");

  const [form, setForm] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    rating: "",
    cuisine: "",
    logo: null,
    brand: null,
    country: "Qatar",
  });

  const [offerForm, setOfferForm] = useState({
    title: "",
    description: "",
    cuisine: "",
    originalPrice: "",
    discountedPrice: "",
    offerType: "",
    validFrom: "",
    validTo: "",
    location: "",
    country: "Qatar",
    category: "",
    image: null,
  });

  // ===== Helpers =====
  const getAuthHeaders = () => ({
    "x-api-token": apiKey || "",
  });

  // ===== Fetch initial data =====
  useEffect(() => {
    getAllRestaurants().then(setRestaurants).catch(console.error);
  }, []);

  // ===== Handlers =====
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      if (name === "logo") setLogoPreview(URL.createObjectURL(files[0]));
      if (name === "brand") setBrandPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOfferFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setOfferForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setOfferForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey) return alert("Please enter Your Key to proceed. As part of registration, you would have received a key via email.");
    if (!form.name || !form.address || !form.logo || !form.country) {
      return alert("Please fill in all required fields (Name, Address, Country, Logo).");
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

    try {
      await uploadRestaurant(formData, { headers: getAuthHeaders() });
      alert("Restaurant saved successfully!");
      setRestaurants(await getAllRestaurants());
      setForm({ id: "", name: "", address: "", phone: "", rating: "", cuisine: "", logo: null, brand: null, country: "Qatar" });
      setLogoPreview(null);
      setBrandPreview(null);
      if (offerInputRef.current) offerInputRef.current.value = "";
      document.querySelectorAll('input[type="file"]').forEach((input) => {
        if (input instanceof HTMLInputElement) {
          input.value = "";
        }
      });

    } catch (err) {
      console.error(err);
      alert("Error saving restaurant");
    }
  };

  const handleSelectRestaurant = async (e) => {
    const id = e.target.value;
    setSelectedRestaurant(id);
    if (id) {
      const data = await getOffersByRestaurantId(id);
      setOffers(data);
    } else {
      setOffers([]);
    }
  };

  const handleOfferUpload = async (e) => {
    e.preventDefault();
    if (!apiKey) return alert("Please enter Your Key to proceed.");
    if (!selectedRestaurant) return alert("Select a restaurant first.");

    const formData = new FormData();
    formData.append("restaurantId", selectedRestaurant);
    Object.entries(offerForm).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

    try {
      await uploadOffer(formData, { headers: getAuthHeaders() });
      alert("Offer uploaded successfully!");
      setOffers(await getOffersByRestaurantId(selectedRestaurant));
      setOfferForm({ title: "", description: "", cuisine: "", originalPrice: "", discountedPrice: "", offerType: "", validFrom: "", validTo: "", location: "", country: "Qatar", category: "", image: null });
      if (offerInputRef.current) offerInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Error uploading offer");
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!apiKey) return alert("Please enter Your Key to proceed.");
    try {
      await deleteOffer(id, { headers: getAuthHeaders() });
      alert("Offer deleted.");
      setOffers(await getOffersByRestaurantId(selectedRestaurant));
    } catch (err) {
      console.error(err);
      alert("Error deleting offer");
    }
  };

  const handleBulkProcessing = async () => {
    if (!apiKey) return alert("Please enter Your Key for bulk processing.");
    try {
      await uploadBulkData({ headers: getAuthHeaders() });
      alert("Bulk processing completed!");
    } catch (err) {
      console.error(err);
      alert("Error in bulk processing");
    }
  };

  // ===== JSX =====
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft size={20} /> <span className="font-semibold">Back to Home</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-700">Admin Panel</h1>
      </div>

      {/* ===== Mode Selection & API Key ===== */}
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-1">
          <input type="radio" name="mode" value="manual" checked={mode === "manual"} onChange={() => setMode("manual")} /> Manual Entry
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="mode" value="bulk" checked={mode === "bulk"} onChange={() => setMode("bulk")} /> Bulk Loading
        </label>
        <input type="text" placeholder="Your Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="border p-1 rounded ml-4 flex-1" />
      </div>

      {/* ===== Manual Mode Sections ===== */}
      {mode === "manual" && (
        <>
        {/* ===== Restaurant Setup Section ===== */}
        <section className="border rounded p-4 shadow">
          <h2 className="text-lg font-bold mb-4">Restaurant Setup</h2>
          <form onSubmit={handleRestaurantSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Name *</label>
              <input name="name" value={form.name} onChange={handleFormChange} className="border p-1 rounded" required />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Address *</label>
              <input name="address" value={form.address} onChange={handleFormChange} className="border p-1 rounded" required />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Phone</label>
              <input name="phone" value={form.phone} onChange={handleFormChange} className="border p-1 rounded" />
            </div>

            {/* Rating */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Rating</label>
              <input name="rating" value={form.rating} onChange={handleFormChange} type="number" step="0.1" className="border p-1 rounded" />
            </div>

            {/* Cuisine */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Cuisine (comma-separated)</label>
              <input name="cuisine" value={form.cuisine} onChange={handleFormChange} className="border p-1 rounded" />
            </div>

            {/* Country */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Country</label>
              <input name="country" value={form.country} onChange={handleFormChange} className="border p-1 rounded" />
            </div>

            {/* Logo */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Logo Image *</label>
              <input name="logo" type="file" accept="image/*" onChange={handleFormChange} className="border p-1 rounded" required />
              {logoPreview && <img src={logoPreview} alt="Logo Preview" className="w-20 h-20 object-cover mt-2 border rounded" />}
            </div>

            {/* Brand */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Brand Image</label>
              <input name="brand" type="file" accept="image/*" onChange={handleFormChange} className="border p-1 rounded" />
              {brandPreview && <img src={brandPreview} alt="Brand Preview" className="w-20 h-20 object-cover mt-2 border rounded" />}
            </div>

            {/* Manual submit button only */}
            <div className="col-span-full mt-3">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Restaurant</button>
            </div>
          </form>
        </section>

        {/* ===== Offer Management Section ===== */}
        <section className="border rounded p-4 shadow">
          <h2 className="text-lg font-bold mb-4">Manage Offers</h2>

          {/* Restaurant select */}
          <label className="block text-sm font-semibold mb-1">Select Restaurant</label>
          <select value={selectedRestaurant} onChange={handleSelectRestaurant} className="border p-1 rounded w-full mb-4">
            <option value="">Select</option>
            {restaurants.map((r) => <option key={r.id} value={r.id}>{r.id} - {r.name}</option>)}
          </select>

          {/* Offer form */}
          <form onSubmit={handleOfferUpload} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Title */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Title</label>
              <input name="title" value={offerForm.title} onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Cuisine */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Cuisine</label>
              <input name="cuisine" value={offerForm.cuisine} onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Original Price */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Original Price</label>
              <input name="originalPrice" type="number" value={offerForm.originalPrice} onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Discounted Price */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Discounted Price</label>
              <input name="discountedPrice" type="number" value={offerForm.discountedPrice} onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Offer Type */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Offer Type</label>
              <input name="offerType" value={offerForm.offerType} onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Valid From */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Valid From</label>
              <input name="validFrom" type="date" value={offerForm.validFrom} onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Valid To */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Valid To</label>
              <input name="validTo" type="date" value={offerForm.validTo} onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Location</label>
              <input name="location" value={offerForm.location} onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Category</label>
              <input name="category" value={offerForm.category} onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Description */}
            <div className="flex flex-col col-span-full">
              <label className="text-sm font-semibold">Description</label>
              <textarea name="description" value={offerForm.description} onChange={handleOfferFormChange} rows={2} className="border p-1 rounded w-full" />
            </div>

            {/* Offer Image */}
            <div className="flex flex-col col-span-full">
              <label className="text-sm font-semibold">Offer Image</label>
              <input type="file" ref={offerInputRef} name="image" onChange={handleOfferFormChange} className="border p-1 rounded" />
            </div>

            {/* Manual submit button only */}
            <div className="col-span-full">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Upload Offer</button>
            </div>
          </form>

          {/* Display existing offers */}
          <div className="flex flex-wrap gap-3">
            {offers.map((o) => (
              <div key={o.id} className="border p-2 rounded relative w-28 md:w-32">
                <img src={`/api/offers/${o.id}/image`} alt={o.title} className="w-full h-20 object-cover rounded" />
                <p className="text-xs mt-1 truncate">{o.title}</p>
                <button onClick={() => handleDeleteOffer(o.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded px-1 text-xs">×</button>
              </div>
            ))}
          </div>
        </section>
        </>
      )}    
      {/* ===== Bulk Processing Section ===== */}
      {mode === "bulk" && (
        <section className="border rounded p-4 shadow">
          <h2 className="text-lg font-bold mb-4">Bulk Loading</h2>
          <button onClick={handleBulkProcessing} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Start Bulk Loading
          </button>
        </section>
      )}
    </div>
  );
}
