import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);


  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();


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
}, [location.state]);

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-red-100">

      <div className="flex-1 p-6">

        

        {/* Add Task Button */}
        <div className="mt-4">
          <button
            onClick={() => navigate("/add-task")}
            className="bg-black block mx-auto text-white px-4 py-2 rounded-full"
          >
            + Add Task
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;