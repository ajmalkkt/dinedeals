import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavoritesContext } from "../contexts/FavoritesContext";
import OffersGrid from "./OffersGrid";
import TopHeader from "./TopHeader";
import { getAllRestaurants } from "../services/restaurantService";
import { useEffect, useState } from "react";

export default function Favourites() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, refreshFavorites, isLoading } = useFavoritesContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Qatar");
  const [restaurants, setRestaurants] = useState([] as any[]);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Filter favorites by search query if needed
  const filteredFavorites = favorites.filter((offer) => {
    const query = searchQuery.toLowerCase();
    return (
      offer.title.toLowerCase().includes(query) ||
      offer.description.toLowerCase().includes(query)
    );
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleFavorite = (offer: any) => {
    toggleFavorite(offer);
  };

  // Load restaurant list so OffersGrid can resolve restaurant names
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await getAllRestaurants();
        if (mounted) setRestaurants(res || []);
      } catch (err) {
        console.error('Error loading restaurants for favourites:', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Refresh favourite offers with latest data on mount (and when favorites change)
  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      try {
        // call refreshFavorites if available
        if (refreshFavorites) await refreshFavorites();
        if (mounted) setLastRefreshed(new Date());
      } catch (err) {
        console.error('Error refreshing favourites:', err);
      }
    };
    if (mounted) refresh();
    return () => { mounted = false; };
  }, []);

  const handleManualRefresh = async () => {
    try {
      if (refreshFavorites) await refreshFavorites();
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Manual refresh failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader
        onSearch={handleSearch}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        onAddBusiness={() => {}}
        onSearchClick={() => {}}
        searchQuery={searchQuery}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">My Favorite Offers</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh
            </button>
            {lastRefreshed && (
              <div className="text-xs text-muted-foreground">Last refreshed: {lastRefreshed.toLocaleTimeString()}</div>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                Start adding offers to your favorites by clicking the heart icon on any offer.
                This will Browser storage to save your offers. If you clear your browser data, your favorites will be lost and you'll need to add them again.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Browse Offers
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredFavorites.length} favorite offer{filteredFavorites.length !== 1 ? "s" : ""}
            </p>
            <OffersGrid
              offers={filteredFavorites}
              restaurants={restaurants}
              isLoading={false}
              showOfferDetail={true}
              favorites={favorites.map((f) => f.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        )}
      </main>

      <footer className="bg-muted py-6 px-4 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-3">
            <p className="m-0">© 2025 Restaurant Offers Platform. All rights reserved.</p>
            <span className="text-muted-foreground">|</span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <img src={"/meraki.webp"} alt="Meraki AI" className="w-6 h-6 object-contain" />
              <span>Powered by MerakiAi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
