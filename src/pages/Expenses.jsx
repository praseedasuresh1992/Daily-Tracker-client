import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import {
  getTasks,
  updateTask,
  deleteTask,
  deleteAttachment,
  addAttachment,
} from "../services/taskService";
const Expenses = ({ status }) => {
  const [expenses, setExpenses] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const selectionMode = selectedTasks.length > 0;

  useEffect(() => {
    fetchExpenses();
  }, [status]);

  const fetchExpenses = async () => {
    try {
      const data = await getTasks(status);
      setExpenses(data);
    } catch (err) {
      console.log(err);
    }
  };


  // ======================
  // Selection
  // ======================

  const toggleSelectTask = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id)
        ? prev.filter((taskId) => taskId !== id)
        : [...prev, id]
    );
  };

  const enterSelectionMode = (id) => {
    toggleSelectTask(id);
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const handleSelectAll = () => {
    if (
      selectedTasks.length === expenses.length
    ) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(
        expenses.map((item) => item._id)
      );
    }
  };

  // ======================
  // Single Update
  // ======================

  const handleUpdate = async (id) => {
    try {
      await updateTask(id);
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // Single Delete
  // ======================

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setExpenses((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // Bulk Status Change
  // ======================

  const handleBulkStatusChange =
    async () => {
      try {
        await Promise.all(
          selectedTasks.map((id) =>
            updateTask(id)
          )
        );

        clearSelection();
        fetchExpenses();
      } catch (err) {
        console.log(err);
      }
    };

  // ======================
  // Bulk Delete
  // ======================

  const handleBulkDelete = async () => {
    const confirmDelete =
      window.confirm(
        `Delete ${selectedTasks.length} expenses?`
      );

    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedTasks.map((id) =>
          deleteTask(id)
        )
      );

      clearSelection();
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {status === "pending"
          ? "Pending Expenses"
          : status === "done"
            ? "Expense History"
            : "All Expenses"}
      </h2>

      {/* Bulk Toolbar */}

      {selectionMode && (
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border shadow rounded-xl p-3 mb-4 flex items-center justify-between">
          <div className="font-semibold dark:text-white">
            {selectedTasks.length} Selected
          </div>

          <div className="flex gap-2">

            <button
              onClick={handleSelectAll}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-white"
            >
              {selectedTasks.length ===
                expenses.length
                ? "Unselect All"
                : "Select All"}
            </button>

            {status === "pending" && (
              <button
                onClick={
                  handleBulkStatusChange
                }
                className="px-3 py-2 rounded-lg bg-green-500 text-white"
              >
                Mark Done
              </button>
            )}

            {status === "done" && (
              <button
                onClick={
                  handleBulkStatusChange
                }
                className="px-3 py-2 rounded-lg bg-yellow-500 text-white"
              >
                Mark Pending
              </button>
            )}

            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 rounded-lg bg-red-500 text-white"
            >
              Delete
            </button>

            <button
              onClick={clearSelection}
              className="px-3 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-white"
            >
              Cancel
            </button>
            <a
              href={`http://localhost:5000/uploads/${file.filePath}`}
              download={file.fileName}
              className="text-green-600"
            >
              Download
            </a>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <p>No Expenses Found</p>
      ) : (
        <div className="space-y-3">
          console.log("Expenses.jsx rendering tasks:", expenses);
          
          {expenses.map((expense) => (
            <TaskCard
              key={expense._id}
              task={expense}
              selected={selectedTasks.includes(
                expense._id
              )}
              selectionMode={selectionMode}
              onSelect={() =>
                toggleSelectTask(expense._id)
              }
              onDoubleSelect={() =>
                enterSelectionMode(expense._id)
              }
              onToggleStatus={handleUpdate}
              onDelete={handleDelete}
              deleteAttachment={deleteAttachment}
              onAttachmentDeleted={fetchExpenses}
              addAttachment={addAttachment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;