import { useEffect, useState } from "react";
import { getTasks, createTask } from "../services/taskService";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
  import API from "../utils/api";


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description,setDescription]=useState("");
  const [btnLoading, setBtnLoading] = useState(false);

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
      const newTask = await createTask({ title,description });
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

  // Loader (page load)
  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Daily Tracker</h1>

      {/* Add Task */}
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
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
            />
          ))
        )}
      </div>

    </div>
  );
};

export default Dashboard;