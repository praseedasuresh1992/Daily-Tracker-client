import API from "../utils/api";

// Create category
export const createCategory = async (data) => {
  const res = await API.post("/categories/", data);
  return res.data;
};

// Get all categories
export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};
export const updateCategory = async (id, data) => {
  const res = await API.put(`/categories/${id}`, data);
  return res.data;
};

// Delete category
export const deleteCategory = async (id) => {
  await API.delete(`/categories/${id}`);
}