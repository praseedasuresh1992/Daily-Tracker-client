import React from "react";
import welcomeImg from "../assets/welcomeimage.jpg"// 👈 your local image

const WelcomeModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-orange-100 bg-opacity-50 flex justify-center items-center z-50">
      
      <div className="bg-red-50 rounded-full shadow-lg p-6 w-150 h-100 flex items-center gap-6 animate-scaleIn">

        {/* LEFT - Image */}
        <div className="w-1/2 flex justify-center">
          <img
            src={welcomeImg}
            alt="welcome"
            className="w-80 h-80 object-contain"
          />
        </div>

        {/* RIGHT - Content */}
        <div className="w-1/2 text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome,    {user?.name} 
          </h2>

          <p className="text-gray-600 mt-2 pt-4 pl-2">
            The best way to get something done is to begin
          </p>

          {/* Arrow Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-teal-300 text-white p-3 rounded-full hover:bg-teal-600 transition"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeModal;