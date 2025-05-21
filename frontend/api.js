import axios from 'axios';

const API_URL = 'http://localhost:5001'; // Backend API URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken = null;

const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};


// User Authentication
const register = (userData) => apiClient.post('/register', userData);
const login = async (credentials) => {
  const response = await apiClient.post('/login', credentials);
  // Assuming the backend returns a token in response.data.token upon successful login
  // This part needs to align with what the Flask backend actually returns.
  // For now, the Flask backend just returns a success message.
  // Let's simulate a token for frontend testing or adjust if backend provides one.
  if (response.data.message === "Login successful") {
    // Simulate a token if backend doesn't send one.
    // In a real app, the backend MUST send a token (e.g., JWT).
    const simulatedToken = "fake-jwt-token-for-" + credentials.username; 
    setAuthToken(simulatedToken); // Set it for subsequent requests
    return { ...response.data, token: simulatedToken }; // Add token to response data
  }
  return response.data; // Should include error message if login failed
};

// Item CRUD operations
const getItems = () => apiClient.get('/items');
const createItem = (itemData) => {
  // The backend's /items POST expects user_id.
  // In a real app with proper auth, this would be handled by the backend using the token.
  // For now, we might need to pass it, or adjust the backend to infer user from token.
  // The current backend /items POST has a fallback to user_id=1 if not provided.
  // For now, we assume this fallback is acceptable or user_id is part of itemData.
  return apiClient.post('/items', itemData);
};
const updateItem = (itemId, itemData) => apiClient.put(`/items/${itemId}`, itemData);
const deleteItem = (itemId) => apiClient.delete(`/items/${itemId}`);

export default {
  setAuthToken,
  register,
  login,
  getItems,
  createItem,
  updateItem,
  deleteItem,
};
