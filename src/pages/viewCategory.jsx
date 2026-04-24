import { useEffect, useState } from "react";
import { getCategories,deleteCategory } from "../services/categoryServices";

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-orange-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Categories
      </h2>

      {categories.length === 0 ? (
        <p className="text-center text-gray-600">
          No categories found
        </p>
      ) : (
        <div className="max-w-xl mx-auto space-y-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <span className="font-medium">{cat.name}</span>

              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCategory;