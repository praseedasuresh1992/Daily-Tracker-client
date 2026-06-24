import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      console.log(`res.data `, res.data)

      // Save token
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("showWelcomeModal", "true");

      alert("Login successful");
      navigate("/dashboard");
      console.log("navigate to dash");
      
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.message || "Error");
    }

  };

  const handleRegister = () => {
    navigate("/register")
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md dark:bg-gray-500"
      >
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email" 
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"          
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600"          
          onChange={handleChange}
          required
        />

        <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-blue-600 dark:bg-green-800 font-bold">
          Login
        </button>
        <button type="button" className="w-full underline text-blue-500 bg-white dark:bg-gray-500 text-blue-800  mt-5 py-3 rounded-lg " onClick={handleRegister}>
          NewUser?
        </button>
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="text-red-500 text-sm mb-4 hover:underline"
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

