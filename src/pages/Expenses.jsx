import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import {
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  deleteAttachment,
  addAttachment,
} from "../services/taskService";
const Expenses = ({ status }) => {
  const [expenses, setExpenses] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const expensesPerPage = 5;

  const selectionMode = selectedTasks.length > 0;
useEffect(() => {
  setCurrentPage(1);
}, [status]);

  useEffect(() => {
    fetchExpenses();
  }, [status]);

  useEffect(() => {
  const totalPages = Math.ceil(
    expenses.length / expensesPerPage
  );

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
}, [expenses, currentPage]);

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

  const handleUpdate = async (id, data) => {
  try {
    const updatedTask = await updateTask(id, data);
    setExpenses((prev) =>
      prev.map((task) =>
        task._id === id ? updatedTask : task
      )
    );
  } catch (err) {
    console.log(err);
  }
};

  const handleUpdateStatus= async (id) => {
    try {
      await updateTaskStatus(id);
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
const indexOfLastExpense =
  currentPage * expensesPerPage;

const indexOfFirstExpense =
  indexOfLastExpense - expensesPerPage;

const currentExpenses = expenses.slice(
  indexOfFirstExpense,
  indexOfLastExpense
);

const totalPages = Math.ceil(
  expenses.length / expensesPerPage
);
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
            {/* <a
              href={`http://localhost:5000/uploads/${file.filePath}`}
              download={file.fileName}
              className="text-green-600"
            >
              Download
            </a> */}
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <p>No Expenses Found</p>
      ) : (
        <>
        <div className="space-y-3">
          
{currentExpenses.map((expense) => (         
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
              onToggleStatus={handleUpdateStatus}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              deleteAttachment={deleteAttachment}
              onAttachmentDeleted={fetchExpenses}
              addAttachment={addAttachment}
            />
          ))}
        </div>
        {expenses.length > expensesPerPage && (
  <div className="flex justify-center items-center gap-4 mt-6">
    <button
      onClick={() =>
        setCurrentPage((prev) => prev - 1)
      }
      disabled={currentPage === 1}
      className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
    >
      Previous Page
    </button>

    <span className="font-medium">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() =>
        setCurrentPage((prev) => prev + 1)
      }
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
    >
       Next Page
        </button>
      </div>
    )}
  </>
)}
</div>
);
};


export default Expenses;