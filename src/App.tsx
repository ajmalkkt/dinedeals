import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AdminImageManager from "./components/AdminImageManager";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="max-w-screen-lg w-full mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-xl border border-gray-200">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminImageManager />} />
          </Routes>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
