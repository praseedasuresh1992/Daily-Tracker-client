import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import {
  getTasks,
  updateTask,
  deleteTask,
} from "../services/taskService";



const Expenses = ({ status }) => {
  console.log (`status is ${status}`)
  const [expenses, setExpenses] = useState([]);

  // Fetch
  const fetchExpenses = async () => {
    try {
      const data = await getTasks(status);
      setExpenses(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [status]);

  // Update
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

  // Delete
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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {status === "pending"
          ? "Pending Expenses"
          : status === "done"
          ? "Expense History"
          : "All Expenses"}
      </h2>

      {expenses.length === 0 ? (
        <p>No data</p>
      ) : (
        <div className="space-y-2 pt-4">
          {expenses.map((expense) => (
            <TaskCard
              key={expense._id}
              task={expense}
              onToggleStatus={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;