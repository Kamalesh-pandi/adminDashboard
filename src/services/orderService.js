import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/orders";

const token = localStorage.getItem("token");

const config = {
  headers: { Authorization: `Bearer ${token}` }
};

export const getOrders = async () => {
  const response = await axios.get(API_URL, config);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}/status?status=${status}`, {}, config);
  return response.data;
};
