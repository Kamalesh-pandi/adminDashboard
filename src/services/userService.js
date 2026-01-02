// src/services/userService.js
import api from "../config/api";

const API_URL = "/admin/users";

export const getUsers = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};
