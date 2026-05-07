import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import {
  getTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";
import { getCategories } from "../services/categoryServices";

const Expenses = ({ status }) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
const [sortOption, setSortOption] = useState("");
const [showSortOptions, setShowSortOptions] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  // 🔥 Highlight text
  const highlightText = (text, search) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // 🔥 Fetch tasks
  const fetchExpenses = async () => {
    try {
      const data = await getTasks(status);
      setExpenses(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [status]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔥 Update
  const handleUpdate = async (id) => {
    try {
      const updated = await updateTask(id);

      setExpenses((prev) =>
        prev.map((item) =>
          item._id === id ? updated : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 Delete
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setExpenses((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 FILTER LOGIC
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    const matchesDate = dateFilter
      ? new Date(item.taskDate).toISOString().split("T")[0] === dateFilter
      : true;

    const matchesCategory = categoryFilter
      ? item.category === categoryFilter
      : true;

    return matchesSearch && matchesDate && matchesCategory;
  });
// -------sorting------------------- 
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
  if (sortOption === "newest") {
    return new Date(b.taskDate) - new Date(a.taskDate);
  }

  if (sortOption === "oldest") {
    return new Date(a.taskDate) - new Date(b.taskDate);
  }

  if (sortOption === "az") {
    return a.title.localeCompare(b.title);
  }

  return 0;
});
  return (
    <div>
      {/* 🔥 Title */}
      <h2 className="text-xl font-bold mb-4">
        {status === "pending"
          ? "Pending Expenses"
          : status === "done"
          ? "Expense History"
          : "All Expenses"}
      </h2>

      {/* 🔥 FILTER BOX */}
      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-3">

        {/* Search */}
        <input
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded"
        />

        {/* Date */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Clear */}
        {(search || dateFilter || categoryFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setDateFilter("");
              setCategoryFilter("");
            }}
            className="bg-gray-200 px-3 rounded"
          >
            Clear
          </button>
        )}
      </div>
      <div className="relative">
  <button
    onClick={() => setShowSortOptions(!showSortOptions)}
    className="bg-gray-200 px-3 py-2 rounded"
  >
    Sort
  </button>
{/* Sorting  */}
  {showSortOptions && (
    <div className="absolute right-0 mt-2 bg-white border rounded shadow w-40 z-10">
      <button
        onClick={() => {
          setSortOption("newest");
          setShowSortOptions(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Newest Firstm 
      </button>

      <button
        onClick={() => {
          setSortOption("oldest");
          setShowSortOptions(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Oldest First
      </button>

      <button
        onClick={() => {
          setSortOption("az");
          setShowSortOptions(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        A → Z
      </button>
    </div>
  )}
</div>

      {/* 🔥 LIST */}
      {filteredExpenses.length === 0 ? (
        <p>No matching expenses</p>
      ) : (
        <div className="space-y-3 mt-5 pt-5">
          {sortedExpenses.map((expense) => (
            <div key={expense._id}>

              {/* Full Card */}
              {selectedId === expense._id ? (
                <TaskCard
                  task={expense}
                  onToggleStatus={handleUpdate}
                  onDelete={handleDelete}
                />
              ) : (
                // Summary View
                <div
                  onClick={() =>
                    setSelectedId(
                      selectedId === expense._id ? null : expense._id
                    )
                  }
                  className="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-100"
                >
                  <h3 className="font-semibold">
                    {highlightText(expense.title, search)}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {highlightText(expense.description || "", search)}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    📅 {new Date(expense.taskDate).toLocaleDateString()}
                  </p>

                  <p className="text-xs text-gray-500">
                    📂 {expense.category || "No category"}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default Expenses;