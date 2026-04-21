import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          DailyTracker
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-500">
            Home
          </Link>

          <Link to="/about" className="text-gray-700 hover:text-blue-500">
            About
          </Link>

          {/* Auth Buttons */}
          <Link
            to="/login"
            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mt-4 flex flex-col gap-4 md:hidden">
          <Link to="/" className="text-gray-700">
            Home
          </Link>

          <Link to="/about" className="text-gray-700">
            About
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg text-center"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-center"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;