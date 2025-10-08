import axios from "axios";

const API_URL = "http://localhost:8080/api/auth"; // Adjust if needed

// Login API call
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    // Save token in localStorage if available
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    // Properly throw an error object
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "Network Error" };
    }
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
};
