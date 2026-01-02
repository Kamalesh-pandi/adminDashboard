import api from "../config/api";

const API_URL = "/admin/categories";

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};

// Add a new category
export const addCategory = async (category) => {
  try {
    const response = await api.post(API_URL, category);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};

// Update existing category
export const updateCategory = async (id, category) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, category);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};

// Get single category by ID
export const getCategory = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};
