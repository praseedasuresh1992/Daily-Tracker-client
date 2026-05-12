import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import Loader from "../components/Loader";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryPieChart from "../components/CategoryPieChart";
import SummaryCard from "../components/summaryCard";
import API from "../utils/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showExportOptions, setShowExportOptions] = useState(false); // ✅ NEW

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Fetch tasks
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

 return (
  <div className="space-y-6">

    {/* 🔥 EMPTY STATE */}
    {tasks.length === 0 ? (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white border shadow-sm rounded-3xl p-10 text-center max-w-md w-full">

          <div className="text-6xl mb-4">📝</div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Tasks Yet
          </h2>

          <p className="text-gray-500 mb-6">
            You haven't added any tasks yet.
            Start by creating your first task.
          </p>

          <button
            onClick={() => navigate("/add-task")}
            className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
          >
            + Add Task
          </button>
        </div>
      </div>
    ) : (

      <>
        {/* 🔥 FILTER BAR */}
        <div className="sticky top-0 z-20 bg-gray-50 pb-2">

          <div className="bg-white p-4 rounded-2xl shadow-sm border flex flex-col gap-4">

            {/* 🔹 Row 1: Date */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black/20"
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* 🔹 Row 2: Status */}
            <div className="flex flex-wrap gap-2">
              {["all", "done", "pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    filterStatus === status
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>

            {/* 🔹 Row 3: Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">

              {/* Export */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="w-full sm:w-auto font-bold text-green-900 px-5 py-2 rounded-lg hover:opacity-90 transition"
                >
                  ⬇ Download Report
                </button>

                {showExportOptions && (
                  <div className="absolute mt-2 w-full sm:w-44 bg-white border rounded-xl shadow-lg overflow-hidden">

                    <button
                      onClick={() => {
                        downloadCSV();
                        setShowExportOptions(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      📄 CSV
                    </button>

                    <button
                      onClick={() => {
                        downloadPDF();
                        setShowExportOptions(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      📊 PDF
                    </button>

                    <button
                      onClick={() => {
                        sendEmail();
                        setShowExportOptions(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      ✉ Email
                    </button>
                  </div>
                )}
              </div>

              {/* Add Task */}
              <button
                onClick={() => navigate("/add-task")}
                className="w-full sm:w-auto bg-gradient-to-r from-black to-gray-700 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                + Add Task
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <h2 className="text-2xl font-bold mt-1">
              {filteredTasks.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Total Amount</p>
            <h2 className="text-2xl font-bold mt-1">
              ₹{filteredTasks.reduce(
                (a, t) => a + Number(t.amount || 0),
                0
              )}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-gray-500 text-sm">Categories</p>
            <h2 className="text-2xl font-bold mt-1">
              {categoryData.length}
            </h2>
          </div>
        </div>

        {/* 🔥 CHART */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border">

          <h3 className="text-lg font-semibold mb-4">
            Category Breakdown
          </h3>

          <div className="w-full h-[300px] flex items-center justify-center">
            <CategoryPieChart data={categoryData} />
          </div>
        </div>
      </>
    )}
  </div>
);
};

export default Dashboard;