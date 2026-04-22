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

    if (!title) return;

    setBtnLoading(true);

    try {
      const newTask = await createTask({ title, description });
      setTasks([newTask, ...tasks]);
      setTitle("");
      setDescription("")

    } catch (err) {
      console.log(err);
    } finally {
      setBtnLoading(false);
    }
  };

  // Update task status

  const handleUpdate = async (id) => {
    try {
      const res = await API.put(`tasks/${id}`);

      // backend returns updated task
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
  // delete task 
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

  // Loader (page load)
  if (loading) return <Loader />;



  const handleLogout = () => {
    localStorage.removeItem("user");   // remove user
    localStorage.removeItem("token");  // (if you stored separately)

    navigate("/login"); // redirect
  };

  return (
    <div className="bg-orange-100 m-8 ml-5">
      <div className="p-6 max-w-2xl mx-auto ">
        {showModal && (
          <WelcomeModal
            user={user}
            onClose={() => setShowModal(false)}
          />
        )}

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Daily Tracker</h1>

          <button
            onClick={handleLogout}
            className="text-red-500 px-4 py-2 hover:text-red-600"
          >
            Logout
          </button>
        </div>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Description.."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
            disabled={btnLoading}
          >
            {btnLoading ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p>No tasks found</p>
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
        </div>

      </div>
    </div>
  );
};

export default Dashboard;