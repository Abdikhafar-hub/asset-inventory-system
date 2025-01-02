import axios from "axios";

const API_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const handleApiCall = async (method, url, data = null) => {
  try {
    const response = await api[method](url, data);
    return response.data;
  } catch (error) {
    console.error("API error:", error);

    return error.response
      ? error.response.data
      : { message: "An error occurred. Please try again later." };
  }
};

export const registerUser = (userData) =>
  handleApiCall("post", "/register", userData);

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("API error:", error);

    if (error.response && error.response.status === 401) {
      return { message: "Invalid username or password" };
    } else {
      return {
        message: "An error occurred. Please try again later.",
      };
    }
  }
};

export const logoutUser = () => handleApiCall("get", "/logout");

// Check authentication status (updated to use a different endpoint)
export const checkAuth = async () => {
  try {
    const response = await api.get("/Users"); // Use a valid endpoint
    return response.data; // Return the full user list (modify as needed)
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

// Fetch assets (protected route, requires authentication)
export const fetchAssets = () => handleApiCall("get", "/assets");
export const fetchDepartments = () => handleApiCall("get", "/departments");
export const fetchCategories = () => handleApiCall("get", "/categories");
// Removed fetchProfile or repurpose to a valid endpoint if needed
export const fetchRequests = () => handleApiCall("get", "/requests");
export const fetchMyRequests = () => handleApiCall("get", "/my_requests");
export const submitNewRequest = (newRequest) =>
  handleApiCall("post", "/new_request", newRequest);
export const submitNewUser = (newUser) =>
  handleApiCall("post", "/register", newUser);
export const submitReview = (review) =>
  handleApiCall("post", `/request/${review.id}/review`, review);

export default api;
