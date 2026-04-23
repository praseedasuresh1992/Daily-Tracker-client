import { useEffect, useState } from "react";
import { getTasks, createTask } from "../services/taskService";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import API from "../utils/api";
import WelcomeModal from "../components/WelcomeModal";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [btnLoading, setBtnLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);



  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    setBtnLoading(true);

    try {
      const newTask = await createTask({ title, description });
      setTasks([newTask, ...tasks]);

      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      console.log(err);
    } finally {
      setBtnLoading(false);
    }
  };

  // Update task
  const handleUpdate = async (id) => {
    try {
      const res = await API.put(`tasks/${id}`);
      const updatedTask = res.data;

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? updatedTask : task
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await API.delete(`tasks/${id}`);
      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-orange-100 min-h-screen">
      <div className="p-6 max-w-2xl mx-auto">

        {/* Welcome Modal */}
        {showModal && (
          <WelcomeModal
            user={user}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold italic">
            Hello, {user?.name}{" "}
            <span className="text-sm font-normal">
              {user?.email}
            </span>
          </p>

          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>
{/* Task List */}
        <div className="space-y-2  pt-4">
          {tasks.length === 0 ? (
            <p className="text-gray-600 text-center">
              No tasks yet! Start by adding one 
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          )}
       

        {/* Add Task Section */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2 rounded-full  mb-4"
          >
            + Add Task
          </button>
        ) : (
          <form
            onSubmit={handleAddTask}
            className="flex flex-col gap-2 mb-4 bg-white p-4 rounded shadow"
          >
            <input
              type="text"
              placeholder="Enter task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded"
                disabled={btnLoading}
              >
                {btnLoading ? "Adding..." : "Add"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

         </div>
      </div>
    </div>
  );
};

export default Dashboard;