// src/services/taskService.js
import API from "../utils/api";

export const getTasks = async (status) => {
  let url = "/tasks";

  if (status) {
    url += `?status=${status}`;
  }

  const res = await API.get(url);
  return res.data;
};

export const createTask = async (data) => {
  const res = await API.post("/tasks", data);
  return res.data;
};

export const updateTask = async (id) => {
  const res = await API.put(`/tasks/${id}`);
  return res.data;
};

export const deleteTask = async (id) => {
  await API.delete(`/tasks/${id}`);
};