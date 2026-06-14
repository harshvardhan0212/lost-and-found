// src/pages/RegisterPage.js
// This page lets a new user create an account.

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function RegisterPage() {
  // State for each form field
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage]   = useState("");
  const [isError, setIsError]   = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // POST request to /api/auth/register
      const response = await API.post("/auth/register", { name, email, password });

      // Save the token so the user is immediately logged in after registering
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      setIsError(false);
      setMessage("Account created! Redirecting...");

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>

        {message && (
          <div className={`message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>

        <p style={{ marginTop: "12px", fontSize: "13px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
