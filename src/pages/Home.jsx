import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Organize Your Day with{" "}
          <span className="text-blue-500">DailyTracker</span>
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Track your daily tasks, stay productive, and never miss anything important.
          Simple, fast, and built for efficiency.
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
            Get Started
          </button>
          <button className="px-6 py-3 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50">
            Learn More
          </button>
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

      {/* Call to Action */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Start Managing Your Tasks Today
        </h2>
        <p className="text-gray-600 mb-6">
          Join now and boost your productivity 🚀
        </p>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
          Create Account
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center">
        <p>© {new Date().getFullYear()} DailyTracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;