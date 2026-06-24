import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import socket from "../socket";

export default function WorkspaceDetails() {
  const [workspace, setWorkspace] = useState(null);

  const { workspaceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getWorkspace();

    socket.emit("joinWorkspace", workspaceId);
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

  if (!workspace) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const inviteCode = workspace.inviteCode;

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      alert("Invite code copied");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-600">

      {/* Workspace Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 dark:bg-gray-500 ">

        <div className="flex justify-between items-center flex-wrap gap-4 ">

          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {workspace.name}
            </h1>

            <p className="text-gray-500 mt-2">
              Members: {workspace.members?.length || 0}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">



            <button
              onClick={() =>
                navigate(`/workspace/${workspaceId}/add-category`)
              }
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-medium"
            >
              ➕ Category
            </button>

          </div>

        </div>

        {/* Invite Code */}
        <div className="mt-6">
          <input
            value={inviteCode}
            readOnly
            onClick={async () => {
              await navigator.clipboard.writeText(inviteCode);
              alert("Invite code copied");
            }}
            className="
      w-full
      border
      border-gray-300
      dark:border-gray-700 
      rounded-xl
      px-4
      py-3
      bg-gray-50
      dark:bg-gray-800
      dark:text-white
      cursor-pointer
      text-center
      font-semibold
      tracking-widest
      hover:border-indigo-500
      transition
    "
          />

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Click the invite code to copy
          </p>
        </div>

      </div>

      {/* Members Section */}
      <div className="bg-gray-200 rounded-2xl shadow-md p-6 dark:bg-gray-500">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold text-gray-800">
            Team Members
          </h2>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {workspace.members?.length} Members
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {workspace.members?.map((member) => (
                <tr
                  key={member.user._id}
                  className="
        border-b
        border-gray-200
        dark:border-gray-700
        hover:bg-gray-50
        dark:hover:bg-gray-800
      "
                >
                  <td className="p-4 font-medium dark:text-white">
                    {member.user.name}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {member.user.email}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
            ${member.role === "owner"
                          ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                          : member.role === "admin"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }
          `}
                    >
                      {member.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/workspace/${workspaceId}/add-task/${member.user._id}`
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
                      >
                        ➕ Assign Task
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/workspace/${workspaceId}/member/${member.user._id}/tasks`,
                            {
                              state: {
                                memberName: member.user.name,
                              },
                            }
                          )
                        }
                        className="
              px-4 py-2
              bg-gray-700
              hover:bg-gray-900
              text-white
              rounded-lg
              text-sm
            "
                      >
                        View Tasks
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}