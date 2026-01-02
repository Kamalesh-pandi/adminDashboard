import axios from "axios";

const API_URL = "https://foodorderapp-9ko4.onrender.com/api/admin/foods";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const getAllFoods = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data;
};

export const getFoodById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getConfig());
  return response.data;
};

export const addFood = async (food) => {
  const response = await axios.post(API_URL, food, getConfig());
  return response.data;
};

export const updateFood = async (id, food) => {
  const response = await axios.put(`${API_URL}/${id}`, food, getConfig());
  return response.data;
};

export const deleteFood = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig());
  return response.data;
};
