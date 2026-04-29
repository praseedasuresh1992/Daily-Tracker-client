import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();


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
    <div className="w-64 bg-red-200 shadow-md p-5 min-h-screen">
      <h2 className="text-xl font-bold mb-6">Menu</h2>

      <ul className="space-y-4">
     <li>
  <Link
    to="/profile"
    className="flex justify-between items-center cursor-pointer font-semibold hover:text-blue-500"
  >
    👤 Profile
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