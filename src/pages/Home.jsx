import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="bg-gray-500 min-h-screen">


      {/* Hero Section */}
      <section className="text-center bg-white dark:bg-gray-600 py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800  dark:text-gray-300 mb-6">
          Organize Your Day with{" "}
          <span className="text-green-800 dark:text-gray-900">DailyTracker</span>
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Track your daily tasks, stay productive, and never miss anything important.
          Simple, fast, and built for efficiency.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-green-700 border border-green-500 dark:border-white dark:text-white rounded-lg hover:bg-green-50"
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
      <section className="py-16 px-6 bg-white dark:bg-gray-600">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Features
        </h2>

        <div className="grid gap-8 md:grid-cols-3">

          <div className=" bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-semibold dark:text-white mb-2">Task Management</h3>
            <p className="text-gray-600 dark:text-white text-sm">
              Easily create, update, and track your daily tasks.
            </p>
          </div>

          <div className="dark:bg-gray-700  p-6 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Status Tracking</h3>
            <p className="text-gray-600 text-sm dark:text-white">
              Mark tasks as pending or completed with a single click.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700  p-6 rounded-xl shadow-sm text-center">
            <h3 className="text-xl font-semibold dark:text-white mb-2">Secure Access</h3>
            <p className="text-gray-600 text-sm dark:text-white">
              Your data is protected with authentication and secure APIs.
            </p>
          </div>

        </div>
      </section>



    </div>
  );
};

export default Home;