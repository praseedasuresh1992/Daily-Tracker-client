import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import API from "../utils/api";

const Sidebar = () => {
  const navigate = useNavigate();

  // Get user
  const user = JSON.parse(localStorage.getItem("user"));

  //  Build image URL using axios baseURL
  const baseURL = API.defaults.baseURL.replace("/api", "");

  const profileUrl = user?.profile
    ? `${baseURL}/uploads/${user.profile}`
    : null;
  console.log(`Image ${profileUrl}`);
  const [open, setOpen] = useState({
    category: false,
    expense: false,
  });

  const toggle = (key) => {
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuItem = (label, path) => (
    <li
      onClick={() => navigate(path)}
      className="cursor-pointer hover:text-blue-500"
    >
      {label}
    </li>
  );

  return (
    <div className="w-64 bg-white shadow-md p-5 min-h-screen border-r">

      {/* 🔥 PROFILE SECTION */}
      <div className="flex flex-col items-center mb-6">

        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-xl">
              👤
            </div>
          )}
        </div>


      </div>

      {/* 🔥 MENU */}
      <ul className="space-y-4">

        <li>
          <Link
            to="/profile"
            className="flex justify-between items-center cursor-pointer font-semibold hover:text-blue-500"
          >
            👤 Profile
          </Link>
        </li>
         <li>
          <Link
            to="/create-workspace"
            className="flex justify-between items-center cursor-pointer font-semibold hover:text-blue-500"
          >
            Create a Workspace
          </Link>
        </li>

        {/* CATEGORY */}
        <li>
          <div
            className="flex justify-between items-center cursor-pointer font-semibold"
            onClick={() => toggle("category")}
          >
            📁 Category
            {open.category ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          {open.category && (
            <ul className="ml-4 mt-2 space-y-2 text-gray-600">
              {menuItem("➕ Add Category", "/add-category")}
              {menuItem("📄 View Categories", "/categories")}
            </ul>
          )}
        </li>

        {/* EXPENSE */}
        <li>
          <div
            className="flex justify-between items-center cursor-pointer font-semibold"
            onClick={() => toggle("expense")}
          >
            💰 Expenses
            {open.expense ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          {open.expense && (
            <ul className="ml-4 mt-2 space-y-2 text-gray-600">
              {menuItem("➕ Add Expense", "/add-task")}
              {menuItem("📄 All Expenses", "/expenses")}
              {menuItem("🕘 History", "/expenses/history")}
              {menuItem("⏳ Pending", "/expenses/pending")}
            </ul>
          )}
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;