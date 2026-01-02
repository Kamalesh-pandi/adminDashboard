// src/services/adminService.js
import api from "../config/api";

const API_URL = "/admin";

// ================== Admin Service ==================

// Fetch all categories with their related orders
export const getCategoriesWithOrders = async () => {
  try {
    const res = await api.get(`${API_URL}/categories-with-orders`);
    return res.data;
  } catch (error) {
    console.error("Error fetching categories with orders:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch orders by specific category ID
export const getOrdersByCategory = async (categoryId) => {
  try {
    const res = await api.get(`${API_URL}/categories/${categoryId}/orders`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching orders for category ${categoryId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Fetch all orders
export const getAllOrders = async () => {
  try {
    const res = await api.get(`${API_URL}/orders`);
    return res.data;
  } catch (error) {
    console.error("Error fetching all orders:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch total revenue
export const getTotalRevenue = async () => {
  try {
    const res = await api.get(`${API_URL}/total-revenue`);
    return res.data.totalRevenue ?? res.data;
  } catch (error) {
    console.error("Error fetching total revenue:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch monthly revenue for a specific year
export const getMonthlyRevenue = async (year) => {
  try {
    const res = await api.get(`${API_URL}/monthly-revenue/${year}`);
    return res.data; // Expected: [{ month: 1, revenue: 12345 }, ...]
  } catch (error) {
    console.error(`Error fetching monthly revenue for ${year}:`, error.response?.data || error.message);
    throw error;
  }
};
