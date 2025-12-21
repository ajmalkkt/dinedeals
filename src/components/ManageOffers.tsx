import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Tag,
  UploadCloud,
  LogOut,
  Plus,
  Trash2,
  Search,
  User,
  Menu,
  X,
  ChevronRight,
  Save,
  Image as ImageIcon,
  Paperclip,
  ArrowLeft,
  Loader2,
} from "lucide-react";

// Mock Services (Keep your existing imports here)
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

// Auth Hook
import useAuth from "../auth/useAuth";
import { getAuthToken } from '../auth/firebaseClient'; 

// App Config
import { cuisineLists, countryMap } from "../config/appConfig";

export default function ManageOffers() {
  const navigate = useNavigate();
  const offerInputRef = useRef(null);
  const { user, initialized } = useAuth();

  // Fallback user display if not logged in
  const displayUser = user ? {
    name: user.displayName || user.email || "User",
    email: user.email || "",
    role: user.role || "user" // Accessed directly
  } : {
    name: "Guest",
    email: "",
    role: "user"
  };

  // ===== Navigation State =====
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, restaurants, offers, bulk
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showAddRestaurantForm, setShowAddRestaurantForm] = useState(false);
  const [showAddOfferForm, setShowAddOfferForm] = useState(false);

  // ===== Data States =====
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [offers, setOffers] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [brandPreview, setBrandPreview] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [offerPreview, setOfferPreview] = useState(null);

  // Add this near your other useState definitions
  const [isUploading, setIsUploading] = useState(false);

  // ===== Forms =====
  // Helper to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [form, setForm] = useState({
    id: "", name: "", address: "", phone: "", rating: "", cuisine: "",
    logo: null, brand: null, country: "Qatar",
  });

  const [offerForm, setOfferForm] = useState({
    title: "", description: "", cuisine: "", originalPrice: "", discountedPrice: "",
    offerType: "Discount", validFrom: getTodayDate(), validTo: getTomorrowDate(), location: "", country: "Qatar",
    category: "", image: null,
  });

  // ===== Helpers =====
  const getAuthHeaders = () => ({ "x-api-token": apiKey || "" });

  // Filter restaurants based on user role and ownership
  const getFilteredRestaurants = (allRestaurants) => {
    if (!user) return [];
    
    // Direct synchronous check
    if (user.role === "admin") {
      return allRestaurants;
    }
    
    return allRestaurants.filter((r) => r.ownerLogin === user.email);
  };

  // Filter offers based on user role and ownership
  const getFilteredOffers = (allOffers) => {
    if (!user) return [];
    if (user.role === "admin") {
      return allOffers;
    }
   
    return allOffers.filter((o) => o.ownerLogin === user.email);
  };

  // ===== Effects =====
  useEffect(() => {
    getAllRestaurants().then(setRestaurants).catch(console.error);
  }, []);

  useEffect(() => {
    // When switching to offers tab, if no restaurant selected, select first one
    if (activeTab === 'offers' && !selectedRestaurant && restaurants.length > 0) {
      handleSelectRestaurant({ target: { value: restaurants[0].id } });
    }
  }, [activeTab, restaurants]);

  // ===== Handlers (Preserved Logic) =====
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
      if (name === "offerImg") setOfferPreview(URL.createObjectURL(files[0]));
    } else {
      setOfferForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey) return alert("Please enter your API Key in the top bar.");
    if (!form.name || !form.address || !form.logo || !form.country) return alert("Missing required fields.");

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => { if (val) formData.append(key, val); });

    setIsUploading(true); // <--- START LOADING

    try {
      await uploadRestaurant(formData, { headers: getAuthHeaders() });
      alert("Restaurant saved!");
      setRestaurants(await getAllRestaurants());
      setForm({ id: "", name: "", address: "", phone: "", rating: "", cuisine: "", logo: null, brand: null, country: "Qatar" });
      setLogoPreview(null);
      setBrandPreview(null);
      setShowAddRestaurantForm(false);
    } catch (err) { console.error(err); alert("Error saving restaurant"); }
    finally {
      setIsUploading(false); // <--- STOP LOADING
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
    if (!apiKey) return alert("Please enter your API Key.");
    if (!selectedRestaurant) return alert("Select a restaurant first.");

    const formData = new FormData();
    formData.append("restaurantId", selectedRestaurant);
    
    // Populate cuisine with category value
    const offerData = { ...offerForm, cuisine: offerForm.category };
    Object.entries(offerData).forEach(([key, val]) => { if (val) formData.append(key, val); });

    setIsUploading(true); // <--- START LOADING

    try {
      await uploadOffer(formData, { headers: getAuthHeaders() });
      alert("Offer uploaded!");
      setOffers(await getOffersByRestaurantId(selectedRestaurant));
      setOfferForm({ title: "", description: "", cuisine: "", originalPrice: "", discountedPrice: "", offerType: "Discount", validFrom: getTodayDate(), validTo: getTomorrowDate(), location: "", country: "Qatar", category: "", image: null }); // Reset all fields with fresh dates
      if (offerInputRef.current) offerInputRef.current.value = "";
      setShowAddOfferForm(false);
    } catch (err) { console.error(err); alert("Error uploading offer: " + err.message); }
    finally {
      setIsUploading(false); // <--- STOP LOADING
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!apiKey) return alert("Please enter your Key.");
    if(!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await deleteOffer(id, { headers: getAuthHeaders() });
      setOffers(await getOffersByRestaurantId(selectedRestaurant));
    } catch (err) { console.error(err); alert("Error deleting offer:" + err.message); }
  };

  const handleBulkProcessing = async () => {
    if (!apiKey) return alert("Please enter your Key.");
    setIsUploading(true); // <--- START LOADING
    try {
      await uploadBulkData({ headers: getAuthHeaders() });
      alert("Bulk processing completed!");
    } catch (err) { console.error(err); alert("Error in bulk processing"); }
    finally {
      setIsUploading(false); // <--- STOP LOADING
    }
  };

  // ===== Render Helpers =====
  const renderSidebarItem = (id, icon, label) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        activeTab === id
          ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      {isSidebarOpen && <span>{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* ===== Sidebar ===== */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? "w-64" : "w-20"}`}>
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
           {isSidebarOpen ? <span className="text-xl font-bold text-blue-600 tracking-tight">Browse<span className="text-slate-800">Qatar</span></span> : <span className="text-xl font-bold text-blue-600">M</span>}
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          {renderSidebarItem("dashboard", <LayoutDashboard size={20} />, "Dashboard")}
          {renderSidebarItem("restaurants", <Store size={20} />, "Restaurants")}
          {renderSidebarItem("offers", <Tag size={20} />, "Offers")}
          {user?.role === "admin" && renderSidebarItem("bulk", <UploadCloud size={20} />, "Bulk Import")}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 text-gray-500 hover:text-red-600 transition-colors w-full p-2 rounded-md hover:bg-red-50">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Exit Admin</span>}
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ===== Top Header ===== */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-700 capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* API Key Input (Styled as session context) */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="text-xs font-bold text-red-400 mr-2">Your Key</span>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter session key..." 
                className="bg-transparent border-none outline-none text-sm w-32 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-none">{displayUser.name}</p>
                <button onClick={() => navigate("/")} className="flex items-center gap-2 text-blue-500 hover:text-blue-800">
                  <ArrowLeft size={20} /> <span className="font-semibold">Back to Home</span>
                </button>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                {displayUser.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* ===== Scrollable Content Area ===== */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {/* --- DASHBOARD TAB --- */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Store size={24} /></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Restaurants</p>
                      <h3 className="text-2xl font-bold text-gray-800">{getFilteredRestaurants(restaurants).length}</h3>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Tag size={24} /></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Offers Managed</p>
                      <h3 className="text-2xl font-bold text-gray-800">{offers.length > 0 ? offers.length : 0}</h3>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><User size={24} /></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Session</p>
                      <h3 className="text-lg font-bold text-gray-800">{apiKey ? "Active" : "No Key"}</h3>
                    </div>
                 </div>
               </div>

               {/* Quick Actions */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-2">Manage Restaurants</h3>
                    <p className="text-blue-100 mb-4 text-sm">Add, edit, or update branding for your partner restaurants.</p>
                    <button onClick={() => setActiveTab('restaurants')} className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">Go to Restaurants</button>
                 </div>
                 <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-2">Offer Management</h3>
                    <p className="text-slate-300 mb-4 text-sm">Create seasonal offers and manage pricing strategies.</p>
                    <button onClick={() => setActiveTab('offers')} className="bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition">Manage Offers</button>
                 </div>
               </div>
            </div>
          )}

          {/* --- RESTAURANTS TAB --- */}
          {activeTab === "restaurants" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">All Restaurants</h3>
                <button 
                  onClick={() => setShowAddRestaurantForm(!showAddRestaurantForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition shadow-sm"
                >
                  {showAddRestaurantForm ? <X size={18} /> : <Plus size={18} />}
                  {showAddRestaurantForm ? "Cancel" : "Add New Restaurant"}
                </button>
              </div>

              {/* Add Restaurant Form (Collapsible) */}
              {showAddRestaurantForm && (
                <div className="bg-white p-6 rounded-xl shadow border border-blue-100 animate-in fade-in slide-in-from-top-4">
                  <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">New Restaurant Details</h4>
                  <form onSubmit={handleRestaurantSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                       <label className="text-xs font-semibold uppercase text-gray-500">Restaurant Name *</label>
                       <input name="name" value={form.name} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Burger King" required />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-semibold uppercase text-gray-500">Address *</label>
                       <input name="address" value={form.address} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Doha, West Bay" required />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-semibold uppercase text-gray-500">Phone</label>
                       <input name="phone" type="tel" value={form.phone} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+974 1234 5678" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-semibold uppercase text-gray-500">Cuisine(comma separated)</label>
                       <select name="cuisine" value={form.cuisine} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                         <option value="">Select Cuisine</option>
                         {cuisineLists.map((c) => (
                           <option key={c.name} value={c.name}>{c.name}</option>
                         ))}
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-gray-500">Rating</label>
                        <input name="rating" type="number" step="1" value={form.rating} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="4" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-gray-500">Country</label>
                        <select name="country" value={form.country} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                          {Object.values(countryMap).map((country) => (
                            <option key={country as string} value={country as string}>{country as string}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* File Inputs Styled */}
                    <div className="space-y-1">
                       <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                         <Paperclip size={14} /> Logo *
                       </label>
                       <input name="logo" type="file" accept="image/*" onChange={handleFormChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                       {logoPreview && <img src={logoPreview} alt="Preview" className="h-10 w-10 rounded-full object-cover border mt-2" />}
                    </div>

                    <div className="col-span-full pt-4">
                      <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2">
                        <Save size={18} /> Save Restaurant
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Restaurant List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredRestaurants(restaurants).map((r) => (
                  <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                    <div className="h-24 bg-gray-100 flex items-center justify-center relative">
                      {/* Placeholder for Brand Image if available, else pattern */}
                      <div className="absolute inset-0 opacity-10 bg-blue-600 pattern-grid-lg"></div> 
                    </div>
                    <div className="px-5 pb-5 -mt-10 relative z-10">
                      <img src={r.logoUrl || "https://via.placeholder.com/150"} alt={r.name} className="h-20 w-20 rounded-lg border-4 border-white shadow bg-white object-contain" />
                      <div className="mt-3">
                        <h4 className="font-bold text-lg text-gray-800">{r.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Store size={14} /> {r.address}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                           <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">{r.cuisine || "General"}</span>
                           <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-100">★ {r.rating || "N/A"}</span>
                        </div>
                      </div>
                      <button onClick={() => { setSelectedRestaurant(r.id); setActiveTab("offers"); }} className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg border border-gray-200 text-sm font-medium transition">
                        Manage Offers <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- OFFERS TAB --- */}
          {activeTab === "offers" && (
            <div className="space-y-6">
               {/* Filter Bar */}
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Store size={20} /></div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 font-semibold block mb-1">SELECT RESTAURANT</label>
                      <select 
                        value={selectedRestaurant} 
                        onChange={handleSelectRestaurant} 
                        className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      >
                        <option value="">-- Choose a Restaurant --</option>
                        {getFilteredRestaurants(restaurants).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  {selectedRestaurant && (
                    <button 
                      onClick={() => setShowAddOfferForm(!showAddOfferForm)}
                      className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition shadow-sm"
                    >
                      {showAddOfferForm ? <X size={18} /> : <Plus size={18} />}
                      {showAddOfferForm ? "Cancel" : "Add New Offer"}
                    </button>
                  )}
               </div>

               {/* Add Offer Form */}
               {showAddOfferForm && selectedRestaurant && (
                 <div className="bg-white p-6 rounded-xl shadow border border-green-100">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Create New Offer</h4>
                    <form onSubmit={handleOfferUpload} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                       {/* Fields reused from logic, styled better */}
                       <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Offer Title</label>
                          <input name="title" value={offerForm.title} onChange={handleOfferFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Arabic Mandi" required  />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Category/Cuisine</label>
                          <select name="category" value={offerForm.category} onChange={handleOfferFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="">Select Cuisine</option>
                            {cuisineLists.map((c) => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Offer Type</label>
                          <select name="offerType" value={offerForm.offerType} onChange={handleOfferFormChange} className="w-full border p-2 rounded-lg">
                             <option value="All">All</option>
                             <option value="Buffet">Buffet</option>
                             <option value="Combo">Combo</option>
                             <option value="Happy Hour">Happy Hour</option>
                             <option value="Special">Special</option>
                             <option value="Catering">Catering</option>
                             <option value="Discount">Discount</option>
                          </select>
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Original Price</label>
                          <input name="originalPrice" type="number" value={offerForm.originalPrice} onChange={handleOfferFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required  />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Discounted Price</label>
                          <input name="discountedPrice" type="number" value={offerForm.discountedPrice} onChange={handleOfferFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required  />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                             <Paperclip size={14} />
                             Offer *
                          </label>
                          <input name="offerImg" type="file" accept="image/*" onChange={handleOfferFormChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" required/>
                          {offerPreview && <img src={offerPreview} alt="Preview" className="h-10 w-10 rounded-full object-cover border mt-2" />}
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Valid From</label>
                          <input name="validFrom" type="date" value={offerForm.validFrom} onChange={handleOfferFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Valid To</label>
                          <input name="validTo" type="date" value={offerForm.validTo} onChange={handleOfferFormChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
                       </div>
                       <div className="md:col-span-3 space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Description</label>
                          <textarea name="description" rows={2} value={offerForm.description} onChange={handleOfferFormChange} className="w-full border p-2 rounded-lg" />
                       </div>
                       <div className="md:col-span-3">
                          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full md:w-auto">Upload Offer</button>
                       </div>
                    </form>
                 </div>
               )}

               {/* Offers Display */}
               {!selectedRestaurant ? (
                 <div className="text-center py-20 text-gray-400">
                   <Store size={48} className="mx-auto mb-4 opacity-20" />
                   <p>Please select a restaurant to view or manage offers.</p>
                 </div>
               ) : offers.length === 0 ? (
                 <div className="text-center py-20 text-gray-400">
                   <Tag size={48} className="mx-auto mb-4 opacity-20" />
                   <p>No offers found. Create one above!</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                   {getFilteredOffers(offers).map((o) => (
                     <div key={o.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group">
                        <div className="relative h-40">
                          <img src={o.imageUrl} alt={o.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 flex gap-1">
                             <button onClick={() => handleDeleteOffer(o.id)} className="bg-white/90 text-red-600 p-1.5 rounded-full hover:bg-red-600 hover:text-white transition shadow">
                               <Trash2 size={14} />
                             </button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {o.offerType || "Discount"}
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-bold text-gray-800 line-clamp-1" title={o.title}>{o.title}</h5>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{o.description}</p>
                          <div className="mt-3 flex items-end gap-2">
                             <span className="text-lg font-bold text-green-600">{o.discountedPrice} QAR</span>
                             {o.originalPrice && <span className="text-xs text-gray-400 line-through mb-1">{o.originalPrice} QAR</span>}
                          </div>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

          {/* --- BULK TAB --- */}
          {activeTab === "bulk" && (
            <div className="max-w-xl mx-auto mt-10">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                   <UploadCloud size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Bulk Data Import</h3>
                <p className="text-gray-500 mb-8">Process large datasets directly from your source. Ensure your API Key is set.</p>
                <button onClick={handleBulkProcessing} className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-200">
                  Start Bulk Processing
                </button>
              </div>
            </div>
          )}

        </main>

        {/* ===== Footer ===== */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
           <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <p>© 2025 Restaurant Offers Platform. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <img src={'/meraki.webp'} alt="Meraki AI" className="w-3 h-3 object-contain" />
                <span>Powered by</span>
                <span className="font-bold text-slate-700">MerakiAi</span>
              </div>
           </div>
        </footer>
      </div>
      {/* ===== FULL SCREEN SPINNER OVERLAY ===== */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Processing...</h3>
            <p className="text-sm text-gray-500">Please wait while we upload your data.</p>
          </div>
        </div>
      )}
    </div>
  );
}