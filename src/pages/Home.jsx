import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">


      {/* Hero Section */}
      <section className="text-center bg-white py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Organize Your Day with{" "}
          <span className="text-green-800">DailyTracker</span>
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Track your daily tasks, stay productive, and never miss anything important.
          Simple, fast, and built for efficiency.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-green-700 border border-green-500 rounded-lg hover:bg-green-50"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Features
        </h2>

        <div className="grid gap-8 md:grid-cols-3">

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-gray-600 text-sm">
              Easily create, update, and track your daily tasks.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-semibold mb-2">Status Tracking</h3>
            <p className="text-gray-600 text-sm">
              Mark tasks as pending or completed with a single click.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
            <p className="text-gray-600 text-sm">
              Your data is protected with authentication and secure APIs.
            </p>
          </div>

        </div>
      </section>



    </div>
  );
};

export default Home;