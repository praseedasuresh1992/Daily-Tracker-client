import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, Link } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative">

      {/* Home Button (Top Right) */}
      <div className="absolute top-4 right-6 z-50">
        <Link
          to="/"
          className="text-green-800 font-bold  px-4 py-2 rounded-lg  hover:text-green-600 transition"
        >
          Home
        </Link>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;