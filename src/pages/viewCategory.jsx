import { useEffect, useState } from "react";
import { getCategories, deleteCategory, updateCategory } from "../services/categoryServices";

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
      setCategories((prev) => prev.filter((c) => c._id !== id));
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
      const updated = await updateCategory(id, { name: editName });

      setCategories((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      );

      setEditId(null);
      setEditName("");
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

              {/* EDIT MODE */}
              {editId === cat._id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border p-1 rounded w-1/2"
                  autoFocus
                />
              ) : (
                <span className="font-medium">{cat.name}</span>
              )}

              <div className="flex gap-3">

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>

                {/* UPDATE / SAVE */}
                {editId === cat._id ? (
                  <button
                    onClick={() => handleUpdate(cat._id)}
                    className="text-green-500 hover:text-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-500 hover:text-blue-600"
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