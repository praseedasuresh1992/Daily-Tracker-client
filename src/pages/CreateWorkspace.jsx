import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";


export default function CreateWorkspace() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return alert("Workspace name is required");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/workspace/create",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Workspace created successfully");

      // Navigate to workspace page
      navigate(`/workspace/${res.data._id}`);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Workspace
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Start collaborating with your team
        </p>

        <form
          onSubmit={handleCreateWorkspace}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Workspace Name
            </label>

            <input
              type="text"
              placeholder="Enter workspace name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading
              ? "Creating..."
              : "Create Workspace"}
          </button>

        </form>

      </div>

    </div>
  );
}