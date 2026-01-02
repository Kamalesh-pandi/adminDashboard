import axios from "axios";

const API_URL = "https://foodorderapp-9ko4.onrender.com/api/admin/categories";

// Helper function to get fresh token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};

// Add a new category
export const addCategory = async (category) => {
  try {
    const response = await axios.post(API_URL, category, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};

// Update existing category
export const updateCategory = async (id, category) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, category, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};

// Get single category by ID
export const getCategory = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};
