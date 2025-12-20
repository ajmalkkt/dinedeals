import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AdminImageManager from "./components/AdminImageManager";
import About from "./components/About";
import MakeOffer from "./components/MakeOffer";
import Favourites from "./components/Favourites";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ProtectedRoute";
import LoginModal from "./components/LoginModal";
import ManageOffers from "./components/ManageOffers";
            

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="max-w-screen-lg w-full mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-xl border border-gray-200">
          <LoginModal /> {/* Add this here, outside Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<ProtectedRoute><AdminImageManager /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            {/*<Route path="/login" element={<LoginPage />} /> */}
            <Route path="/make-offer" element={<ProtectedRoute><MakeOffer /></ProtectedRoute>} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/manage-offers" element={<ProtectedRoute><ManageOffers /></ProtectedRoute>} />
          </Routes>
          {/* Toast container must be here */}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </div>
      </div>
    </Suspense>
  );
}

export default App;
