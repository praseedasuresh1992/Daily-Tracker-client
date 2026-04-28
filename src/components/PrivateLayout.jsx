import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WelcomeModal from "./WelcomeModal";

const PrivateLayout = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [showModal, setShowModal] = useState(false);

  // 🔥 Show modal once per user (with delay)
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      const seen = localStorage.getItem(`welcomeShown_${user._id}`);

      if (!seen) {
        setShowModal(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  // 🔥 Close modal
  const handleClose = () => {
    setShowModal(false);

    if (user) {
      localStorage.setItem(`welcomeShown_${user._id}`, "true");
    }
  };

  // 🔥 Logout
  const handleLogout = () => {
    if (user) {
      localStorage.removeItem(`welcomeShown_${user._id}`);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div>

      {/* Header */}
      <Navbar />

      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-orange-100 min-h-screen">

          {/* 🔥 Global Welcome Modal */}
          {showModal && user && (
            <WelcomeModal user={user} onClose={handleClose} />
          )}

          {/* User Info */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">
              Hello, {user?.name}
            </p>

            <button
              onClick={handleLogout}
              className="text-red-500"
            >
              Logout
            </button>
          </div>

          {/* Page Content */}
          <Outlet />
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivateLayout;