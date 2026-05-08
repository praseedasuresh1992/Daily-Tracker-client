import { useState, useEffect } from "react";
import { User, Pencil, Save, X } from "lucide-react";
import API from "../utils/api"; // your axios instance

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
 const [changePassword, setChangePassword] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [formData, setFormData] = useState(user);

  const token = localStorage.getItem("token");

  // 🔹 Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/profile", {
          headers: { Authorization: token },
        });

        setUser(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Edit Mode
  const handleEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handlePasswordChange = (e) => {
  setPasswordData({
    ...passwordData,
    [e.target.name]: e.target.value,
  });
};

  // 🔹 Save (Update API)
const handleSave = async () => {
  try {
    const res = await API.put(
      "/auth/profile",
      { ...formData, ...passwordData },
      {
        headers: { Authorization: token },
      }
    );

    setUser(res.data);
    setIsEditing(false);

    localStorage.setItem("user", JSON.stringify(res.data));

    // clear password fields
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  } catch (error) {
    console.error(error.response?.data?.message);
    alert(error.response?.data?.message);
  }
};

  // 🔹 Delete Account
  const handleDelete = async () => {
    if (!window.confirm("Are you sure to delete account?")) return;

    try {
      await API.delete("/auth/profile", {
       headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      alert("successfully deleted user Account")
      window.location.href = "/register";

    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white  p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User />
          <h2 className="text-xl font-semibold">User Profile</h2>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-lg"
          > 
            <Pencil size={16} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-lg"
            >
              <Save size={16} /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-400 text-white px-3 py-1 rounded-lg"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-4">

        {/* Name */}
        <div>
          
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          ) : (
            <p className="text-gray-800 font-medium">{user.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
            />
          ) : (
            <p className="text-gray-800 font-medium">{user.email}</p>
          )}
        </div>
       <button
  onClick={() => setChangePassword(!changePassword)}
  className="text-blue-500"
>
  Change Password
</button>
{changePassword && (
  <div className="space-y-3 mt-4">

    <input
      type="password"
      name="oldPassword"
      placeholder="Old Password"
      value={passwordData.oldPassword}
      onChange={handlePasswordChange}
      className="w-full border rounded-lg p-2"
    />

    <input
      type="password"
      name="newPassword"
      placeholder="New Password"
      value={passwordData.newPassword}
      onChange={handlePasswordChange}
      className="w-full border rounded-lg p-2"
    />

    <input
      type="password"
      name="confirmPassword"
      placeholder="Confirm Password"
      value={passwordData.confirmPassword}
      onChange={handlePasswordChange}
      className="w-full border rounded-lg p-2"
    />

  </div>
)}

      </div>

      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Delete Account
        </button>
      </div>

    </div>
  );
};

export default ProfilePage;