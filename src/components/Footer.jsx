import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-5">
      
        {/* Bottom Section */}
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} DailyTracker. All rights reserved.
        </p>

    </footer>
  );
};

export default Footer;