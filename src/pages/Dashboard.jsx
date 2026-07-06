import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import Loader from "../components/Loader";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryPieChart from "../components/CategoryPieChart";
import SummaryCard from "../components/summaryCard";
import API from "../utils/api";
import WelcomeModal from "../components/WelcomeModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = () => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);


  const [showExportOptions, setShowExportOptions] = useState(false); // ✅ NEW

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Fetch tasks
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    }
    catch (error) {
      console.log(error.response);
      console.log(error.response.data);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const shouldShow = localStorage.getItem("showWelcomeModal");

    if (shouldShow === "true") {
      setShowWelcomeModal(true);
      localStorage.removeItem("showWelcomeModal");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [location.state]);

  // 🔹 Default date
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    setFromDate(firstDay.toISOString().split("T")[0]);
    setToDate(now.toISOString().split("T")[0]);
  }, []);

  // 🔥 Filtering
  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.taskDate);

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      if (taskDate < start || taskDate > end) return false;
    }

    if (filterStatus !== "all" && task.status !== filterStatus) {
      return false;
    }

    return true;
  });

  // 🔹 Category aggregation
  const categoryData = filteredTasks.reduce((acc, task) => {
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

  if (showWelcomeModal) {
    return (
      <WelcomeModal
        user={user}
        onClose={() => setShowWelcomeModal(false)}
      />
    );
  }

  if (loading) return <Loader />;

  // ------------ CSV ------------
  const downloadCSV = () => {
    if (filteredTasks.length === 0) {
      alert("No data in selected range");
      return;
    }

    const headers = ["Title", "Category", "Amount", "Status", "Date"];

    const rows = filteredTasks.map((task) => [
      task.title,
      task.category,
      task.amount,
      task.status,
      new Date(task.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "filtered_task_report.csv";
    link.click();
  };

  // ------------ PDF ------------
  const downloadPDF = () => {
    if (filteredTasks.length === 0) {
      alert("No data in selected range");
      return;
    }

    const doc = new jsPDF();

    doc.text("Filtered Task Report", 14, 10);

    const tableData = filteredTasks.map((task) => [
      task.title,
      task.category,
      task.amount,
      task.status,
      new Date(task.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["Title", "Category", "Amount", "Status", "Date"]],
      body: tableData,
    });

    doc.save("filtered_task_report.pdf");
  };

  // ------------ Email ------------
  const sendEmail = async () => {
    try {
      if (filteredTasks.length === 0) {
        alert("No data to send");
        return;
      }

      const res = await API.post("/send-report", {
        tasks: filteredTasks,
        email: user.email,
      });

      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Failed to send email");
    }
  };
  const getLast7DaysData = (tasks) => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      days.push({
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        fullDate: date.toDateString(),
        completed: 0,
      });
    }

    tasks.forEach((task) => {
      if (task.status !== "completed") return;

      const taskDate = new Date(
        task.updatedAt
      ).toDateString();

      const dayObj = days.find(
        (d) => d.fullDate === taskDate
      );

      if (dayObj) {
        dayObj.completed += 1;
      }
    });


    return days;
  };
  const chartData = getLast7DaysData(tasks);
  return (
    <>
      {showWelcomeModal && (
        <WelcomeModal
          user={user}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}

      <div className="space-y-6 text-gray-900 dark:text-gray-100">

        {tasks.length === 0 ? (
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-3xl p-10 text-center max-w-md w-full">

              <div className="text-6xl mb-4">📝</div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                No Tasks Yet
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You haven't added any tasks yet.
                Start by creating your first task.
              </p>

              <button
                onClick={() => navigate("/add-task")}
                className="bg-black dark:bg-blue-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
              >
                + Add Task
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Section */}
            <div className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 pb-2">

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-sm flex flex-col gap-4">

                <div className="flex flex-col sm:flex-row gap-3">

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="
                  border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-white
                  px-3 py-2 rounded-lg w-full
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                  />

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="
                  border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-white
                  px-3 py-2 rounded-lg w-full
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                  />
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                  {["all", "done", "pending"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-full text-sm border transition ${filterStatus === status
                          ? "bg-black dark:bg-blue-600 text-white border-transparent"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                      {status.toUpperCase()}
                    </button>
                  ))}
                </div>


                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">

                  <div className="relative w-full sm:w-auto">
                    <button
                      onClick={() =>
                        setShowExportOptions(!showExportOptions)
                      }
                      className="w-full sm:w-auto font-bold text-green-700 dark:text-green-400 px-5 py-2 rounded-lg hover:opacity-90 transition"
                    >
                      ⬇ Download Report
                    </button>

                    {showExportOptions && (
                      <div className="absolute mt-2 w-full sm:w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">

                        <button
                          onClick={() => {
                            downloadCSV();
                            setShowExportOptions(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          📄 CSV
                        </button>

                        <button
                          onClick={() => {
                            downloadPDF();
                            setShowExportOptions(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          📊 PDF
                        </button>

                        <button
                          onClick={() => {
                            sendEmail();
                            setShowExportOptions(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          ✉ Email
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate("/add-task")}
                    className="w-full sm:w-auto bg-gradient-to-r from-black to-gray-700 dark:from-blue-600 dark:to-blue-800 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Tasks
                </p>

                <h2 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {filteredTasks.length}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Amount
                </p>

                <h2 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  ₹
                  {filteredTasks.reduce(
                    (a, t) => a + Number(t.amount || 0),
                    0
                  )}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Categories
                </p>

                <h2 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {categoryData.length}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Tasks Completed in Last 7 Days
                </h3>

                <ResponsiveContainer
                  width="50%"
                  height={200}
                >
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#22c55e"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-sm">

                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white p-8">
                  Category Breakdown
                </h3>

                <div className="w-full h-[350px] flex items-center justify-center">
                  <CategoryPieChart data={categoryData} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </>
  );
};

export default Dashboard;