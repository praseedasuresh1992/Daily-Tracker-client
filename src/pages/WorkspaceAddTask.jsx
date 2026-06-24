import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function WorkspaceAddTask() {
    const { workspaceId, memberId } = useParams();
    const navigate = useNavigate();

    const [workspace, setWorkspace] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        amount: "",
        dueDate: "",
        assignedTo: memberId,
        priority: "Medium",
        assignedTo: "",
    });

    const [categories, setCategories] = useState([]);


    useEffect(() => {
        getWorkspace();
        getCategories();
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
    const selectedMember = workspace?.members?.find(
        (m) => m.user._id === memberId
    );

    const getCategories = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get(
                `/workspace/${workspaceId}/categories`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCategories(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await API.post(
                `/workspace/${workspaceId}/tasks`,
                {
                    ...formData,
                    assignedTo: memberId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Task Assigned Successfully");

            navigate(`/workspace/${workspaceId}`);
        } catch (error) {
            console.log(error);
            alert("Failed to create task");
        }
    };

    if (!workspace) {
        return (
            <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">

            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                    Assign Workspace Task
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Workspace Name */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Workspace
                        </label>

                        <input
                            value={workspace.name}
                            readOnly
                            className="w-full border rounded-xl p-3 bg-gray-100 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Assign Member */}
                    <div>

                        <div>
                            <label className="block mb-2 font-semibold">
                                Assigned To
                            </label>

                            <input
                                value={
                                    selectedMember
                                        ? `${selectedMember.user.name} (${selectedMember.user.email})`
                                        : ""
                                }
                                readOnly
                                className="w-full border rounded-xl p-3 bg-gray-100 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                    </div>

                    {/* Title */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Task Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter task title"
                            className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Description
                        </label>

                        <textarea
                            rows="4"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Task description..."
                            className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Category
                        </label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select Category</option>

                            {categories.map((category) => (
                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Amount
                        </label>

                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Due Date
                        </label>

                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Priority
                        </label>

                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:text-white"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                        >
                            Assign Task
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}