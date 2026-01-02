import axios from "axios";
import { BASE_URL } from "../config/api";

const API_URL = `${BASE_URL}/auth`; // Adjust if needed

// Login API call
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.name);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("Login server error:", error.response.status, error.response.data);
      throw error.response.data || { message: `Error: ${error.response.status}` };
    } else if (error.request) {
      // Request was made but no response was received
      console.error("Login network/request error:", error.request);
      throw { message: "No response from server. Check your connection or the backend status." };
    } else {
      // Something else happened in setting up the request
      console.error("Login setup error:", error.message);
      throw { message: error.message };
    }
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
};
