import { useState } from "react";
import axios from "axios";
import API from "../utils/api";
import { useNavigate } from "react-router";


export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      alert("Registered Successfully");
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);

      alert("Registered Successfully");
      navigate("/login");
    }
  };
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
        <button type="button" className="w-full text-green-500 bg-white mt-5 py-3  underline  hover:text-green-600" onClick={handleLogin}>
          Have an account?
        </button>
      </form>
    </div>
  );
}