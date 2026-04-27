import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PrivateLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>

      {/* Header (same for all) */}
       <Navbar />
      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-orange-100 min-h-screen">

          {/* User Info (ONLY here) */}
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

          <Outlet />
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivateLayout;