import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";

export default function AddWorkspaceCategory() {
  const { workspaceId } = useParams();

  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    getWorkspace();
  }, []);

  const getWorkspace = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        `/workspace/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkspace(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/workspace/${workspaceId}/categories`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Category created");
      setName("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Create Workspace Category
        </h1>

        {workspace && (
          <div className="mt-3 mb-6">
            <p className="text-gray-500 dark:text-gray-400">
              Workspace
            </p>

            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              {workspace.name}
            </h2>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block mb-2 font-medium dark:text-white">
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              className="
                w-full
                border
                rounded-xl
                p-3
                dark:bg-gray-700
                dark:border-gray-600
                dark:text-white
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              py-3
              rounded-xl
              font-medium
            "
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}