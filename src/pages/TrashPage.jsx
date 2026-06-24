import { useEffect, useState } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import API from "../utils/api";

const TrashPage = () => {
  const [trashTasks, setTrashTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrashTasks = async () => {
    try {
      const { data } = await API.get("/tasks/trash");
      setTrashTasks(data);
    } catch (error) {
      console.error("Error fetching trash tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashTasks();
  }, []);

  const handleRestore = async (id) => {
    try {
      await API.put(`/tasks/restore/${id}`);

      setTrashTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handlePermanentDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this task permanently?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/tasks/permanentDelete/${id}`);

      setTrashTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getDaysLeft = (deletedAt) => {
    const daysPassed = Math.floor(
      (Date.now() - new Date(deletedAt)) /
        (1000 * 60 * 60 * 24)
    );

    return Math.max(30 - daysPassed, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        Loading trash...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 transition-colors">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Trash
      </h1>

      {trashTasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
          Trash is empty
        </div>
      ) : (
        <div className="space-y-4">
          {trashTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {task.title}
                </h2>

                {task.description && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {task.description}
                  </p>
                )}

                <p className="text-sm text-red-500 mt-1">
                  Permanently deleted in{" "}
                  {getDaysLeft(task.deletedAt)} days
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleRestore(task._id)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  <RotateCcw size={16} />
                  Restore
                </button>

                <button
                  onClick={() =>
                    handlePermanentDelete(task._id)
                  }
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;