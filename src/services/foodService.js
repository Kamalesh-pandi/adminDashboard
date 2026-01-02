import api from "../config/api";

const API_URL = "/admin/foods";

export const getAllFoods = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getFoodById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const addFood = async (food) => {
  const response = await api.post(API_URL, food);
  return response.data;
};

export const updateFood = async (id, food) => {
  const response = await api.put(`${API_URL}/${id}`, food);
  return response.data;
};

export const deleteFood = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};
