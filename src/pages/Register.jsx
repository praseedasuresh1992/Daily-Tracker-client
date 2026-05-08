import { useState } from "react";
import axios from "axios";
import API from "../utils/api";
import { useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };
  // Handle uploading image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      setError("Password must be 6+ chars, include uppercase, lowercase and number");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);

      if (profileImage) {
        formData.append("profile", profileImage); // 🔥 backend field name
      }

      await API.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registered Successfully");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");


    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Registration failed");
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

        <div className="flex flex-col items-center mb-5">

          <label className="relative cursor-pointer">

            {/* Profile Preview */}
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border">
              {preview ? (
                <img src={preview} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-sm">Add Photo</span>
              )}
            </div>

            {/* Upload Icon */}
            <div className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow">
              +
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

        </div>

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
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}
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