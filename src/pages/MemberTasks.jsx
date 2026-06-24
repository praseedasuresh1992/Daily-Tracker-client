import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import TaskCard from "../components/TaskCard";
import { useLocation } from "react-router-dom";

export default function MemberTasks() {
  const { workspaceId, memberId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const location = useLocation();

  useEffect(() => {
    getTasks();
  }, []);

  const memberName =
    location.state?.memberName || "Member";
  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token");


      const res = await API.get(
        `/workspace/${workspaceId}/member/${memberId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  const handleUpdate = async (id) => {
    try {
      await updateTask(id);
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      const task = tasks.find((t) => t._id === taskId);

      const newStatus =
        task.status === "completed"
          ? "pending"
          : "completed";

      await API.put(
        `/tasks/${taskId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getTasks();

      setSelectedTask((prev) =>
        prev
          ? { ...prev, status: newStatus }
          : prev
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (
    taskId
  ) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedTask(null);
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const addAttachment = async (
    taskId,
    formData
  ) => {
    const token = localStorage.getItem("token");

    await API.patch(
      `/tasks/${taskId}/attachments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "multipart/form-data",
        },
      }
    );
  };

  const deleteAttachment = async (
    taskId,
    attachmentId
  ) => {
    const token = localStorage.getItem("token");

    await API.delete(
      `/tasks/${taskId}/attachment/${attachmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const fetchTasks = () => {
    getTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">

      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Tasks assigned to {memberName}
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Pending */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">

          <h2 className="text-xl font-bold text-yellow-600 mb-4">
            Pending Tasks
          </h2>

          {pendingTasks.map((task) => (

            <div
              key={task._id}
              className="border-b py-3"
            >
              <button
                onClick={() => setSelectedTask(task)}
                className="font-semibold text-blue-600 hover:underline block"
              >
                {task.title}
              </button>

              <p className="text-gray-500">
                ₹{task.amount}
              </p>
            </div>
          ))}
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">

          <h2 className="text-xl font-bold text-green-600 mb-4">
            Completed Tasks
          </h2>

          {completedTasks.map((task) => (
            <div
              key={task._id}
              className="border-b py-3"
            >
              <button
                onClick={() => setSelectedTask(task)}
                className="font-semibold text-blue-600 hover:underline block"
              >
                {task.title}
              </button>

              <p className="text-gray-500">
                ₹{task.amount}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Task Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <TaskCard
              task={selectedTask}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTask}
              selected={false}
              selectionMode={false}
              onSelect={() => { }}
              onDoubleSelect={() => { }}
              deleteAttachment={deleteAttachment}
              addAttachment={addAttachment}
              onAttachmentDeleted={fetchTasks}
            />
          </div>
        </div>
      )}

    </div>
  );
}