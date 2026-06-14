// src/api.js
// Central place to configure Axios.
// All API calls go through this file so we only define the base URL once.

import axios from "axios";

// Create an Axios instance with the backend base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  //baseURL: "https://33qwlvvm-5000.inc1.devtunnels.ms/api",
});

// Interceptor: automatically attach the JWT token to every request
// This runs before each request is sent
API.interceptors.request.use((config) => {
  // Get the token stored in localStorage after login
  const token = localStorage.getItem("token");

  // If a token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
