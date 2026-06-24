import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function MyWorkspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyWorkspaces();
  }, []);

  const getMyWorkspaces = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/workspace/my-workspaces", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWorkspaces(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Workspaces
      </h1>

      {workspaces.length === 0 ? (
        <p>No workspaces found.</p>
      ) : (
        <div className="grid gap-4">
          {workspaces.map((workspace) => (
            <div
              key={workspace._id}
              onClick={() =>
                navigate(`/workspace/${workspace._id}`)
              }
              className="p-4 bg-white rounded-xl shadow cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">
                {workspace.name}
              </h2>

              <p className="text-gray-500">
                Members: {workspace.members.length}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}