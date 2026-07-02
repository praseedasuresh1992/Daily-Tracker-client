import { useState, useEffect } from "react";
import { createTask } from "../services/taskService";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/categoryServices";
import { X } from "lucide-react";

const AddTask = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    amount: "",
    taskDate: ""
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [attachments, setAttachments] = useState([]);

  // set default date = today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, taskDate: today }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
  const newFiles = Array.from(e.target.files);

  setAttachments((prev) => [
    ...prev,
    ...newFiles
  ]);
};
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, taskDate: today }));

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);
  const removeAttachment = (indexToRemove) => {
  setAttachments((prev) =>
    prev.filter((_, index) => index !== indexToRemove)
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.taskDate) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

formData.append("title", form.title);
formData.append("description", form.description);
formData.append("category", form.category);
formData.append("amount", Number(form.amount));
formData.append("taskDate", form.taskDate);

attachments.forEach((file) => {
  formData.append("attachments", file);
});

await createTask(formData);

      alert("✅ Task added successfully");
      navigate("/dashboard", { state: { refresh: true } });
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-500 transition-colors">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">

      <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        Add Expense
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
        />

        {/* Category */}
       

        <div>
          <p className="mb-1 font-medium text-gray-800 dark:text-gray-200">
            Select Category
          </p>

          <div className="flex flex-wrap gap-4">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">
                No categories found
              </p> 
            ) : (
              categories.map((cat) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-1 cursor-pointer text-gray-800 dark:text-gray-200"
                > 
                  <input
                    type="radio"
                    name="category"
                    value={cat._id}
                    checked={form.category === cat._id}
                    onChange={handleChange}
                  />
                  {cat.name}
                </label>
              ))
            )}
          </div>
        </div>

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
        />

        {/* Date */}
        <input
          type="date"
          name="taskDate"
          value={form.taskDate}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
        />
   <div>
  <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">
    Attach Files
  </label>

  <input
    type="file"
    multiple
    accept="image/*,.pdf"
    onChange={handleFileChange}
    className="
      w-full
      text-sm
      text-gray-700
      dark:text-gray-200
      file:mr-4
      file:px-4
      file:py-2
      file:border-0
      file:rounded-lg
      file:bg-blue-600
      file:text-white
      file:cursor-pointer
      hover:file:bg-blue-700
      cursor-pointer
    "
  />

  {/* Selected Files */}

  {attachments.length > 0 && (
  <div className="mt-3 space-y-2">
    {attachments.map((file, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
      >
        <a
          href={URL.createObjectURL(file)}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline truncate"
        >
          📎 {file.name}
        </a>

        <button
          type="button"
          onClick={() => removeAttachment(index)}
          className="text-red-500 hover:text-red-700"
        >
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
)}
</div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black dark:bg-orange-500 hover:bg-gray-800 dark:hover:bg-orange-600 text-white py-2 rounded transition"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>

      </form>
    </div>
  </div>
);
};

export default AddTask;