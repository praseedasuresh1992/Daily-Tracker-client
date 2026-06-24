import { useEffect, useState } from "react";
import {
  getCategories,
  deleteCategory,
  updateCategory,
} from "../services/categoryServices";

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);

      setCategories((prev) =>
        prev.filter((c) => c._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  // START EDIT
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name);
  };

  // UPDATE
  const handleUpdate = async (id) => {
    try {
      const updated = await updateCategory(id, {
        name: editName,
      });

      setCategories((prev) =>
        prev.map((c) =>
          c._id === id ? updated : c
        )
      );

      setEditId(null);
      setEditName("");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 p-6 transition-colors duration-300">

      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Categories
      </h2>

      {categories.length === 0 ? (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8 text-center">

          <p className="text-gray-600 dark:text-gray-400">
            No categories found
          </p>

        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-4">

          {categories.map((cat) => (
            <div
              key={cat._id}
              className="
                bg-white
                dark:bg-gray-800
                border
                border-gray-200
                dark:border-gray-700
                p-4
                rounded-xl
                shadow-sm
                hover:shadow-md
                transition
                flex
                justify-between
                items-center
              "
            >
              {/* EDIT MODE */}
              {editId === cat._id ? (
                <input
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                  className="
                    w-1/2
                    px-3
                    py-2
                    rounded-lg
                    border
                    border-gray-300
                    dark:border-gray-600
                    bg-white
                    dark:bg-gray-700
                    text-gray-900
                    dark:text-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  autoFocus
                />
              ) : (
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {cat.name}
                </span>
              )}

              <div className="flex gap-4">

                {/* DELETE */}
                <button
                  onClick={() =>
                    handleDelete(cat._id)
                  }
                  className="
                    text-red-500
                    hover:text-red-600
                    dark:text-red-400
                    dark:hover:text-red-300
                    font-medium
                  "
                >
                  Delete
                </button>

                {/* UPDATE / SAVE */}
                {editId === cat._id ? (
                  <button
                    onClick={() =>
                      handleUpdate(cat._id)
                    }
                    className="
                      text-green-500
                      hover:text-green-600
                      dark:text-green-400
                      dark:hover:text-green-300
                      font-medium
                    "
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleEdit(cat)
                    }
                    className="
                      text-blue-500
                      hover:text-blue-600
                      dark:text-blue-400
                      dark:hover:text-blue-300
                      font-medium
                    "
                  >
                    Update
                  </button>
                )}

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default ViewCategory;