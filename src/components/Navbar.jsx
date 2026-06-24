import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-700 shadow-md px-6 py-4">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link className="text-2xl font-bold text-green-900 dark:text-lime-400">
          DailyTracker
        </Link>
        
        <ThemeToggle />

      </div>

    </nav>
  );
};

export default Navbar;