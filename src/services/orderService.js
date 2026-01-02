import api from "../config/api";

const API_URL = "/admin/orders";

export const getAllOrders = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`${API_URL}/${id}/status?status=${status}`, {});
  return response.data;
};
