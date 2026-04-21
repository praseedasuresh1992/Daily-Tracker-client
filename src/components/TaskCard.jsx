import React, { useState } from "react";

const TaskCard = ({ task, onToggleStatus, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await onToggleStatus(task._id);
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    setLoading(true);
    await onDelete(task._id);
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition duration-300">

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          {task.title}
        </h2>

        {/* Status Badge */}
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            task.status === "done"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {task.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">
        {task.description || "No description provided"}
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center">

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
            task.status === "done"
              ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } ${loading && "opacity-50 cursor-not-allowed"}`}
        >
          {loading
            ? "Updating..."
            : task.status === "done"
            ? "Mark as Pending"
            : "Mark as Done"}
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          {loading ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;