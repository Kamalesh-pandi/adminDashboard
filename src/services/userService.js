// src/services/userService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/users";

const token = localStorage.getItem("token");
const config = {
  headers: { Authorization: `Bearer ${token}` },
};

export const getUsers = async () => {
  const response = await axios.get(API_URL, config);
  return response.data;
};

export const addUser = async (user) => {
  const response = await axios.post(API_URL, user, config);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await axios.put(`${API_URL}/${id}`, user, config);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};
