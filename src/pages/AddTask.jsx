import { useState, useEffect } from "react";
import { createTask } from "../services/taskService";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/categoryServices";

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

  // set default date = today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, taskDate: today }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.taskDate) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);

    try {
      await createTask({
        ...form,
        amount: Number(form.amount)
      });

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
    <div className="min-h-screen flex justify-center items-center bg-orange-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">

        <h2 className="text-xl font-bold mb-4 text-center">
          Add  Expense
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* Description */}
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* Category */}
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <div>
  <p className="mb-1 font-medium">Select Category</p>

  <div className="flex flex-wrap gap-4">
    {categories.length === 0 ? (
      <p className="text-sm text-gray-500">No categories found</p>
    ) : (
      categories.map((cat) => (
        <label key={cat._id} className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="category"
            value={cat.name}
            checked={form.category === cat.name}
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
            className="border p-2 rounded"
          />

          {/* Date (Calendar) */}
          <input
            type="date"
            name="taskDate"
            value={form.taskDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-black text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Task"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddTask;