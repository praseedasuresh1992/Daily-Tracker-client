import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { createCategory } from "../services/categoryServices";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return setMessage("Please enter a category name");
    }

    setLoading(true);

    try {
      await createCategory({ name });

      setMessage("Category added successfully");
      setName("");
    } catch (err) {
      setMessage("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-500 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <FolderPlus
              size={30}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add Category
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Organize your tasks with custom categories
          </p>
        </div>

        {/* Alert Message */}
        {message && (
          <div
            className={`mb-5 p-3 rounded-xl text-sm text-center font-medium ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name
            </label>

            <input
              type="text"
              placeholder="e.g. Personal, Work, Study"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder:text-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              font-semibold
              transition-all
            "
          >
            {loading ? "Adding Category..." : "Add Category"}
          </button>
        </form>

      </div>

    </div>
  );
};

export default AddCategory;