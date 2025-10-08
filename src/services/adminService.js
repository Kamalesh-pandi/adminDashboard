// src/services/adminService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/admin";

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ================== Admin Service ==================

// Fetch all categories with their related orders
export const getCategoriesWithOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/categories-with-orders`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error fetching categories with orders:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch orders by specific category ID
export const getOrdersByCategory = async (categoryId) => {
  try {
    const res = await axios.get(`${API_URL}/categories/${categoryId}/orders`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error(`Error fetching orders for category ${categoryId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Fetch all orders
export const getAllOrders = async () => {
  try {
    const res = await axios.get(`${API_URL}/orders`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error fetching all orders:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch total revenue
export const getTotalRevenue = async () => {
  try {
    const res = await axios.get(`${API_URL}/total-revenue`, getAuthHeaders());
    return res.data.totalRevenue ?? res.data;
  } catch (error) {
    console.error("Error fetching total revenue:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch monthly revenue for a specific year
export const getMonthlyRevenue = async (year) => {
  try {
    const res = await axios.get(`${API_URL}/monthly-revenue/${year}`, getAuthHeaders());
    return res.data; // Expected: [{ month: 1, revenue: 12345 }, ...]
  } catch (error) {
    console.error(`Error fetching monthly revenue for ${year}:`, error.response?.data || error.message);
    throw error;
  }
};
