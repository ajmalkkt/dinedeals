import React, { useState, useRef } from "react";

// Utility to read/write JSON files (simulate API for demo)
const readJson = async (file) => {
  const res = await fetch(file + `?t=${Date.now()}`);
  return res.json();
};
const writeJson = async (file, data) => {
  // In real app, this would be an API call. Here, just log for demo.
  console.log("Write to", file, data);
};

export default function AdminImageManager() {
  // State for restaurant form
  const [restaurants, setRestaurants] = useState([]);
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    address: "",
    logo: null,
    country: "Qatar",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [offerImages, setOfferImages] = useState([]);
  const offerInputRef = useRef<HTMLInputElement>(null);

  // Load data on mount
  React.useEffect(() => {
    readJson("/src/data/restaurants.json").then(setRestaurants);
    readJson("/src/data/offers.json").then(setOffers);
  }, []);

  // Handle restaurant form change
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setForm((f) => ({ ...f, logo: files[0] }));
      setLogoPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Handle restaurant submit
  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.address || !form.logo) {
      alert("ID, Name, Address, and Logo are required.");
      return;
    }
    // Save logo image
    const logoPath = `/images/restaurants/${form.id}.jpg`;
    // In real app, upload file here
    // Update or add restaurant
    let updated = false;
    const newData = restaurants.map((r) => {
      if (r.id === Number(form.id)) {
        updated = true;
        return { ...r, name: form.name, address: form.address, logoUrl: logoPath, country: form.country };
      }
      return r;
    });
    if (!updated) {
      newData.push({ id: Number(form.id), name: form.name, address: form.address, logoUrl: logoPath, country: form.country });
    }
    setRestaurants(newData);
    await writeJson("/src/data/restaurants.json", newData);
    alert(updated ? "Restaurant updated" : "Restaurant added");
  };

  // Handle restaurant select for offers
  const handleSelectRestaurant = (e) => {
    setSelectedRestaurant(e.target.value);
    // Load offer images for this restaurant
    const restOffers = offers.filter((o) => o.restaurantId === Number(e.target.value));
    setOfferImages(restOffers.map((o) => o.imageUrl));
  };

  // Handle offer image upload
  const handleOfferUpload = async (e) => {
    const files = e.target.files;
    if (!selectedRestaurant || !files.length) return;
    const restId = selectedRestaurant;
    const newImages = [];
    for (let file of files) {
      const imgPath = `/images/offers/${restId}/${file.name}`;
      // In real app, upload file here
      newImages.push(imgPath);
      // Add to offers.json
      offers.push({ id: Date.now(), restaurantId: Number(restId), imageUrl: imgPath });
    }
    setOfferImages((imgs) => [...imgs, ...newImages]);
  await writeJson("/src/data/offers.json", offers);
  alert("Offer images uploaded");
  if (offerInputRef.current) offerInputRef.current.value = "";
  };

  // Handle offer image delete
  const handleDeleteOffer = async (img) => {
    const filtered = offers.filter((o) => o.imageUrl !== img);
    setOfferImages((imgs) => imgs.filter((i) => i !== img));
    await writeJson("/src/data/offers.json", filtered);
    alert("Offer image deleted");
  };

  return (
  <div className="max-w-2xl mx-auto p-2 space-y-6 md:p-4 md:space-y-8">
      {/* Restaurant Setup */}
  <section className="border rounded p-2 md:p-4">
        <h2 className="font-bold mb-2">Restaurant Setup</h2>
        <form onSubmit={handleRestaurantSubmit} className="space-y-2">
          <div className="flex flex-col gap-2 md:flex-row md:gap-2">
            <input name="id" placeholder="Restaurant ID" value={form.id} onChange={handleFormChange} className="border p-1 flex-1" required />
            <input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} className="border p-1 flex-1" required />
          </div>
          <input name="address" placeholder="Address" value={form.address} onChange={handleFormChange} className="border p-1 w-full" required />
          <input name="country" placeholder="Country" value={form.country} onChange={handleFormChange} className="border p-1 w-full" />
          <input name="logo" type="file" accept="image/*" onChange={handleFormChange} className="border p-1 w-full" required />
          {logoPreview && <img src={logoPreview} alt="Logo Preview" className="w-20 h-20 object-cover mt-1 mx-auto md:mx-0" />}
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded w-full md:w-auto">Save Restaurant</button>
        </form>
      </section>

      {/* Offer Images Section */}
  <section className="border rounded p-2 md:p-4">
        <h2 className="font-bold mb-2">Manage Offer Images</h2>
  <select value={selectedRestaurant} onChange={handleSelectRestaurant} className="border p-1 w-full mb-2 text-sm">
          <option value="">Select Restaurant</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>{r.id} - {r.name}</option>
          ))}
        </select>
        {selectedRestaurant && (
          <>
            <div className="flex flex-wrap gap-2 mb-2 justify-center md:justify-start">
              {offerImages.map((img) => (
                <div key={img} className="relative">
                  <img src={img} alt="Offer" className="w-20 h-20 md:w-24 md:h-24 object-cover rounded" />
                  <button onClick={() => handleDeleteOffer(img)} className="absolute top-1 right-1 bg-red-600 text-white rounded px-1 text-xs">Delete</button>
                </div>
              ))}
            </div>
            <input type="file" multiple accept="image/*" ref={offerInputRef} onChange={handleOfferUpload} className="border p-1 w-full text-sm" />
          </>
        )}
      </section>
    </div>
  );
}
