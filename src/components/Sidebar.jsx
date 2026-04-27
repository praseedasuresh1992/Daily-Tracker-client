import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);

  return (
   
    <div className="w-64 bg-red-200 shadow-md p-5 min-h-screen">

      <h2 className="text-xl font-bold mb-6">Menu</h2>

      <ul className="space-y-3">

        {/* CATEGORY DROPDOWN */}
        <li>
          <div
            className="flex justify-between items-center cursor-pointer font-semibold"
            onClick={() => setOpenCategory(!openCategory)}
          >
            📁 Category
            {openCategory ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          {openCategory && (
            <ul className="ml-4 mt-2 space-y-2 text-gray-600">
              <li className="cursor-pointer hover:text-blue-500"
                onClick={() => navigate("/add-category")}>
                ➕ Add Category
              </li>
              <li className="cursor-pointer hover:text-blue-500"
                onClick={() => navigate("/categories")}
              >
                📄 View Categories
              </li>
            </ul>
          )}
        </li>

        {/* EXPENSE DROPDOWN */}
        <li>
          <div
            className="flex justify-between items-center cursor-pointer font-semibold mt-4"
            onClick={() => setOpenExpense(!openExpense)}
          >
            💰 Expenses
            {openExpense ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          {openExpense && (
            <ul className="ml-4 mt-2 space-y-2 text-gray-600">
              <li
              onClick={() => navigate("/add-task")}
              className="cursor-pointer hover:text-blue-500">
                ➕ Add Expense
              </li>
              <li
                onClick={() => navigate("/expenses")}
                className="cursor-pointer hover:text-blue-500"
              >
                📄 All Expenses
              </li>

              <li
                onClick={() => navigate("/expenses/history")}
                className="cursor-pointer hover:text-blue-500"
              >
                🕘 History
              </li>

              <li
                onClick={() => navigate("/expenses/pending")}
                className="cursor-pointer hover:text-blue-500"
              >
                ⏳ Pending
              </li>
            </ul>
          )}
        </li>

      </ul>
    </div>
  
  );
};

export default Sidebar;