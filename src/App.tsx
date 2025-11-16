import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AdminImageManager from "./components/AdminImageManager";
import About from "./components/About";
import MakeOffer from "./components/MakeOffer";
import LoginPage from "./components/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ProtectedRoute";
            

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="max-w-screen-lg w-full mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-xl border border-gray-200">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<ProtectedRoute><AdminImageManager /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/make-offer" element={<ProtectedRoute><MakeOffer /></ProtectedRoute>} />
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
