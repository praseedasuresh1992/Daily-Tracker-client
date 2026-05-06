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

      {/* 🔹 Filters */}
      <div className="flex flex-wrap gap-3 items-center relative">

        {/* Date */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

    

        {/* Status */}
        <div className="flex gap-2">
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
            {/* ✅ EXPORT BUTTON */}
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Export
          </button>

          {showExportOptions && (
            <div className="absolute top-12 left-0 bg-white border rounded shadow-md w-40 z-10">
              <button
                onClick={() => {
                  downloadCSV();
                  setShowExportOptions(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Download CSV
              </button>

              <button
                onClick={() => {
                  downloadPDF();
                  setShowExportOptions(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Download PDF
              </button>

              <button
                onClick={() => {
                  sendEmail();
                  setShowExportOptions(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Send Email
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/add-task")}
          className="bg-black text-white px-6 py-3 rounded-full h-fit ml-auto"
        >
          + Add Task
        </button>
      </div>

      {/* 🔹 Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Total Tasks" value={filteredTasks.length} />

        <SummaryCard
          title="Total Amount"
          value={`₹${filteredTasks.reduce(
            (a, t) => a + Number(t.amount || 0),
            0
          )}`}
        />

        <SummaryCard title="Categories" value={categoryData.length} />
      </div>

      {/* 🔹 Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <CategoryPieChart data={categoryData} />
      </div>
    </div>
  );
};

export default Dashboard;