import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Users, PlusCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-500 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Users className="text-blue-600 dark:text-blue-400" size={28} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Workspace
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Collaborate with your team and manage projects together
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleCreateWorkspace}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Workspace Name
            </label>

            <input
              type="text"
              placeholder="My Awesome Workspace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder:text-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              py-3
              rounded-xl
              font-semibold
              transition-all
            "
          >
            <PlusCircle size={20} />

            {loading
              ? "Creating Workspace..."
              : "Create Workspace"}
          </button>
        </form>

      </div>

    </div>
  );
}