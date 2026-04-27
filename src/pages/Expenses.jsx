import { useEffect, useState } from "react";
import API from "../utils/api";

const Expenses = ({ status }) => {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      let url = "/tasks";

      // filter based on status
      if (status === "pending") {
        url += "?status=pending";
      } else if (status === "done") {
        url += "?status=done";
      }

      const res = await API.get(url);
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [status]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {status === "pending"
          ? "Pending Expenses"
          : status === "done"
          ? "Expense History"
          : "All Expenses"}
      </h2>

      {expenses.length === 0 ? (
        <p>No data</p>
      ) : (
        expenses.map((item) => (
          <div key={item._id} className="bg-white p-3 mb-2 shadow rounded">
            <p>{item.title}</p>
            <p>₹ {item.amount}</p>
            <p className="text-sm text-gray-500">{item.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Expenses;