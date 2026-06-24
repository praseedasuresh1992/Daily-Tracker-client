import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, LogIn } from "lucide-react";
import API from "../utils/api";

export default function JoinWorkspace() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      return alert("Please enter an invite code");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        `/workspace/join/${inviteCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Joined workspace successfully");

      // If backend returns workspace
      if (res.data.workspace?._id) {
        navigate(`/workspace/${res.data.workspace._id}`);
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to join workspace"
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Users
              className="text-green-600 dark:text-green-400"
              size={28}
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join Workspace
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Enter the invite code shared by your team
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleJoinWorkspace}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Invite Code
            </label>

            <input
              type="text"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) =>
                setInviteCode(e.target.value)
              }
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
                focus:ring-green-500
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
              bg-green-600
              hover:bg-green-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              py-3
              rounded-xl
              font-semibold
              transition-all
            "
          >
            <LogIn size={20} />

            {loading
              ? "Joining Workspace..."
              : "Join Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}