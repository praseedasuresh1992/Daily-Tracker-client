import API from "../utils/api";

export const getTasks = async (status="all") => {
  let url = "/tasks/personal";

  if (status) {
    url += `?status=${status}`;
  }

  const res = await API.get(url);
  return res.data;
};

export const createTask = async (formData) => {
  const res = await API.post(
    "/tasks",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};


export const updateTask = async (id,data) => {
  const res = await API.put(`/tasks/update/${id}`,data);
  return res.data;
};

export const updateTaskStatus = async (id) => {
  const res = await API.patch(
    `/tasks/${id}`
  );

  return res.data;
};

export const deleteTask = async (id) => {
  await API.delete(`/tasks/${id}`);
};

export const addAttachment = async (
  taskId,
  formData
) => {
  const res = await API.patch(
    `/tasks/${taskId}/attachments`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};


export const deleteAttachment = async (
  taskId,
  attachmentId
) => {
  const res = await API.delete(
    `/tasks/${taskId}/attachment/${attachmentId}`
  );

  return res.data;
};

