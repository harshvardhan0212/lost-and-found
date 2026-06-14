// src/pages/LoginPage.js
// This page lets a user log in with email and password.
// On success, the JWT token is saved to localStorage.

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function LoginPage() {
  // State to hold what the user types in the form
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  // State for showing success or error messages
  const [message, setMessage]   = useState("");
  const [isError, setIsError]   = useState(false);

  const navigate = useNavigate(); // Used to redirect after login

  // Called when the form is submitted
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the browser from refreshing the page

    try {
      // POST request to /api/auth/login
      const response = await API.post("/auth/login", { email, password });

      // Save the returned JWT token in localStorage
      localStorage.setItem("token", response.data.token);
      // Save full user info (including isAdmin) so we can check role anywhere
      localStorage.setItem("user", JSON.stringify(response.data));

      setIsError(false);
      setMessage("Login successful! Redirecting...");

      // Redirect to the home page after a short delay
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      // Show error message if login fails
      setIsError(true);
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        {/* Show message if any */}
        {message && (
          <div className={`message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update state on every keystroke
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p style={{ marginTop: "12px", fontSize: "13px" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
