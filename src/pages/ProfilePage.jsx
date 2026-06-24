import { useState, useEffect } from "react";
import {
  User,
  Pencil,
  Save,
  X,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import API from "../utils/api";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changePassword, setChangePassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [formData, setFormData] = useState(user);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setChangePassword(false);
    setPasswordVerified(false);

    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    if (name === "newPassword") {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

      if (!regex.test(value)) {
        setPasswordError(
          "Password must contain uppercase, lowercase, number and at least 6 characters"
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const verifyOldPassword = async () => {
    try {
      const res = await API.post(
        "/auth/verify-password",
        {
          oldPassword: passwordData.oldPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setPasswordVerified(true);
      }
    } catch (error) {
      setPasswordVerified(false);
      alert("Previous password is incorrect");
    }
  };

  const handleSave = async () => {
    try {
      const res = await API.put(
        "/auth/profile",
        {
          ...formData,
          ...passwordData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
      setIsEditing(false);

      localStorage.setItem("user", JSON.stringify(res.data));

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordVerified(false);
      setChangePassword(false);

      alert("Profile updated successfully");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };
// -----------DElete the Account -----------
 const handleDelete = async () => {
  try {
    // Verify password first
    const verifyRes = await API.post(
      "/auth/verify-password",
      {
        oldPassword: deletePassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!verifyRes.data.success) {
      alert("Incorrect password");
      return;
    }

    const confirmed = window.confirm(
      "This will permanently delete your account and all associated data. Continue?"
    );

    if (!confirmed) return;

    await API.delete("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.clear();

    alert("Account deleted successfully");

    window.location.href = "/register";
  } catch (error) {
    alert("Incorrect password");
    console.error(error);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-500 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <User className="text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold dark:text-white">
                Profile
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account information
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
            >
              <Pencil size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
              >
                <Save size={16} />
                Save
              </button>

              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Full Name
            </label>

            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-3"
              />
            ) : (
              <p className="text-lg font-medium dark:text-white mt-1">
                {user.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Email Address
            </label>

            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-3"
              />
            ) : (
              <p className="text-lg font-medium dark:text-white mt-1">
                {user.email}
              </p>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="mt-8">
          <button
            onClick={() => setChangePassword(!changePassword)}
            className="text-blue-600 dark:text-blue-400 font-medium"
          >
            {changePassword
              ? "Hide Password Section"
              : "Change Password"}
          </button>

          {changePassword && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-5 space-y-4">

              {/* Old Password */}
              <PasswordInput
                name="oldPassword"
                placeholder="Current Password"
                value={passwordData.oldPassword}
                visible={showPassword.oldPassword}
                toggle={() =>
                  setShowPassword({
                    ...showPassword,
                    oldPassword: !showPassword.oldPassword,
                  })
                }
                onChange={handlePasswordChange}
              />

              {!passwordVerified && (
                <button
                  onClick={verifyOldPassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                >
                  Verify Password
                </button>
              )}

              {passwordVerified && (
                <>
                  <PasswordInput
                    name="newPassword"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    visible={showPassword.newPassword}
                    toggle={() =>
                      setShowPassword({
                        ...showPassword,
                        newPassword: !showPassword.newPassword,
                      })
                    }
                    onChange={handlePasswordChange}
                  />

                  {passwordError && (
                    <p className="text-red-500 text-sm">
                      {passwordError}
                    </p>
                  )}

                  <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={passwordData.confirmPassword}
                    visible={showPassword.confirmPassword}
                    toggle={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmPassword:
                          !showPassword.confirmPassword,
                      })
                    }
                    onChange={handlePasswordChange}
                  />

                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                  >
                    Update Password
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Delete Account */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6">
         <button
  onClick={() => setShowDeleteModal(true)}
  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
>
            <Trash2 size={18} />
            Delete Account
          </button>
        </div>
      </div>
      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">

      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Confirm Account Deletion
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Enter your current password to permanently delete your account.
      </p>

      <input
        type="password"
        value={deletePassword}
        onChange={(e) =>
          setDeletePassword(e.target.value)
        }
        placeholder="Current Password"
        className="
          w-full
          p-3
          rounded-lg
          border
          border-gray-300
          dark:border-gray-600
          bg-white
          dark:bg-gray-700
          text-gray-900
          dark:text-white
          mb-4
        "
      />

      <div className="flex justify-end gap-3">

        <button
          onClick={() => {
            setShowDeleteModal(false);
            setDeletePassword("");
          }}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Delete Account
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

const PasswordInput = ({
  name,
  placeholder,
  value,
  visible,
  toggle,
  onChange,
}) => (
  <div className="relative">
    <input
      type={visible ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-3 pr-12"
    />

    <button
      type="button"
      onClick={toggle}
      className="absolute right-4 top-3 text-gray-500"
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

export default ProfilePage;