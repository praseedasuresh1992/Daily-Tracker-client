import React, { useState, useEffect } from "react";
import { Download, FileText, X } from "lucide-react";

const TaskCard = ({
  task,
  onToggleStatus,
  onUpdate,
  onDelete,
  selected,
  selectionMode,
  onSelect,
  onDoubleSelect, 
  deleteAttachment,
  onAttachmentDeleted,
  addAttachment,
}) => {
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    amount: task.amount,
  });


  useEffect(() => {
  setEditData({
    title: task.title,
    description: task.description,
    amount: task.amount,
  });
}, [task]);


  const handleToggle = async () => {
    try {
      setLoading(true);
      await onToggleStatus(task._id);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      await onUpdate(task._id, editData);
      setIsEditing(false);
      setEditData({
        title: editData.title,
        description: editData.description,
        amount: editData.amount,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await onDelete(task._id);
    } finally {
      setLoading(false);
    }
  };
  // --------Adding attachments-----------
  const handleAddAttachment = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    try {
      setUploading(true);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      await addAttachment(task._id, formData);

      onAttachmentDeleted(); // refresh list

    } catch (err) {
      console.log(err);
      alert("Failed to upload attachment");
    } finally {
      setUploading(false);
    }
  };
  // --------Delete already added Attachment-------
  const handleDeleteAttachment = async (
    taskId,
    attachmentId
  ) => {
    try {
      await deleteAttachment(
        taskId,
        attachmentId
      );
      onAttachmentDeleted();
    } catch (err) {
      console.log(err);
    }
  };


  const formattedDate = task.taskDate
    ? new Date(task.taskDate).toLocaleDateString()
    : "No date";

  return (
    <>
      <div
        onDoubleClick={() => {
          if (!selectionMode) {
            onDoubleSelect();
          }
        }}
        onClick={() => {
          if (selectionMode) {
            onSelect();
          }
        }}
        className={`
          shadow-md rounded-2xl p-5 border cursor-pointer
          transition-all duration-300
          ${selected
            ? "bg-blue-50 dark:bg-blue-950 border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg"
          }
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          {isEditing ? (
            <input
              value={editData.title}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  title: e.target.value,
                })
              }
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <h2 className="text-lg font-bold">
              {task.title}
            </h2>
          )}

          {isEditing ? (
            <input
              type="number"
              value={editData.amount}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  amount: e.target.value,
                })
              }
              className="border rounded px-2 py-1 w-24"
            />
          ) : (
            <span>
              ₹{task.amount || 0}
            </span>
          )}
          <span
            className={`px-4 py-2 text-sm rounded-lg font-medium transition ${task.status === "completed"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "bg-green-500 text-white hover:bg-green-600"
              }`}
          >
            {task.status}
          </span>
        </div>

        {/* Category + Date */}
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>📂 {task.category?.name || "No category"}</span>
          <span>📅 {formattedDate}</span>
        </div>

        {/* Description */}
        {isEditing ? (
          <textarea
            value={editData.description}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              setEditData({
                ...editData,
                description: e.target.value,
              })
            }
            className="border rounded p-2 w-full"
            rows={3}
          />
        ) : (
          <p>
            {task.description || "No description"}
          </p>
        )}

        {/* Attachments */}
        {/* ------Adding attachment--------- */}
        {/* ================= ATTACHMENTS ================= */}

        <div className="pt-3 mt-3 border-t">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm dark:text-white">
              Attachments
            </h4>

            <label
              className="
        cursor-pointer
        px-3 py-1.5
        text-xs
        rounded-lg
        bg-lime-400
        font-bold
        text-white
        hover:bg-blue-700
        transition
      "
            >
              {uploading ? "Uploading..." : "➕ Add Attachment"}

              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleAddAttachment}
              />
            </label>
          </div>

          {task.attachments?.length > 0 ? (
            <div className="space-y-2">
              {task.attachments.map((file) => (
                <div
                  key={file._id}
                  className="
            flex items-center justify-between
            px-3 py-2
            rounded-lg
            bg-gray-100
            dark:bg-gray-700
          "
                >
                  {/* File Name */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewFile(file);
                    }}
                    className="
              flex items-center gap-2
              text-sm
              text-blue-600
              hover:underline
              truncate
            "
                  >
                    <FileText size={16} />
                    {file.fileName}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      const confirmDelete =
                        window.confirm(
                          `Are you sure you want to remove "${file.fileName}"?`
                        );

                      if (!confirmDelete) return;

                      handleDeleteAttachment(
                        task._id,
                        file._id
                      );
                    }}
                    className="
              text-red-500
              hover:text-red-700
              transition
            "
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No attachments
            </p>
          )}
        </div>


        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition ${task.status === "completed"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              : "bg-green-500 text-white hover:bg-green-600"
              }`}
          >
            {loading
              ? "Updating..."
              : task.status === "completed"
                ? "Mark Pending"
                : "Mark Done"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate();
            }}
            disabled={loading}
            className="text-green-500 hover:text-green-700 text-sm font-medium"
          >
            {isEditing ? "Save" : "Update"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={loading}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>

        {/* Selected */}
        {selected && (
          <div className="mt-3 text-blue-600 text-sm font-semibold">
            ✓ Selected
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="
              bg-white dark:bg-gray-800
              rounded-xl p-4
              max-w-4xl w-full
              max-h-[90vh]
              overflow-auto
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold dark:text-white">
                {previewFile.fileName}
              </h3>

              <button
                onClick={() => setPreviewFile(null)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview */}
            <div className="flex justify-center mb-4">
              {previewFile.fileType?.startsWith("image") ? (
                <img
                  src={`http://localhost:5000/uploads/${previewFile.filePath}`}
                  alt={previewFile.fileName}
                  className="max-h-[70vh] rounded"
                />
              ) : (
                <iframe
                  title="attachment"
                  src={`http://localhost:5000/uploads/${previewFile.filePath}`}
                  className="w-full h-[70vh] border rounded"
                />
              )}
            </div>

            {/* Download */}
            <div className="flex justify-end">
              <a
                href={`http://localhost:5000/uploads/${previewFile.filePath}`}
                download={previewFile.fileName}
                className="
                  flex items-center gap-2
                  bg-green-600 text-white
                  px-4 py-2 rounded-lg
                  hover:bg-green-700
                "
              >
                <Download size={18} />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;