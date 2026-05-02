import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import CategoryPieChart from "../components/CategoryPieChart";
import SummaryCard from "../components/summaryCard";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  

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
  // Filter current month tasks
const currentMonthTasks = tasks.filter((task) => {
  const date = new Date(task.createdAt);
  const now = new Date();

  const isCurrentMonth =
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isStatusMatch =
    filterStatus === "all" || task.status === filterStatus;

  return isCurrentMonth && isStatusMatch;
});

// Convert to category-wise data
const categoryData = currentMonthTasks.reduce((acc, task) => {
  const category = task.category || "Other";
  const amount = Number(task.amount) || 0;

  const existing = acc.find((item) => item.name === category);

  if (existing) {
    existing.value += amount;
  } else {
    acc.push({ name: category, value: amount });
  }

  return acc;
}, []);

  return (
<div className="space-y-6">
<div className="flex gap-3">
  {["all", "done", "pending"].map((status) => (
    <button
      key={status}
      onClick={() => setFilterStatus(status)}
      className={`px-4 py-2 rounded-full border ${
        filterStatus === status
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >
      {status.toUpperCase()}
    </button>
  ))}
</div>
  {/* Cards */}
  <div className="grid grid-cols-3 gap-4">
    <SummaryCard title="Total Tasks" value={tasks.length} />
    <SummaryCard
      title="Total Amount"
      value={`₹${tasks.reduce((a, t) => a + Number(t.amount || 0), 0)}`}
    />
    <SummaryCard title="Categories" value={categoryData.length} />
  </div>

  {/* Chart */}
  <div className="grid grid-cols-2 gap-6">
    <CategoryPieChart data={categoryData} />

    <button
      onClick={() => navigate("/add-task")}
      className="bg-black text-white px-6 py-3 rounded-full h-fit m-auto"
    >
      + Add Task
    </button>
  </div>

</div>
  );
};

export default Dashboard;