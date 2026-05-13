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
      const res = await API.post("auth/login", form);
      console.log(`res.data `, res.data)

      // Save token
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.message || "Error");
    }

  };

  const handleRegister = () => {
    navigate("/register")
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-blue-600">
          Login
        </button>
        <button type="button" className="w-full underline text-blue-500 bg-white mt-5 py-3 rounded-lg hover:bg-blue-600" onClick={handleRegister}>
          NewUser?
        </button>
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="text-blue-500 text-sm mb-4 hover:underline"
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

