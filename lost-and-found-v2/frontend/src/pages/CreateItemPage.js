// src/pages/CreateItemPage.js
// This page lets a logged-in user post a lost or found item.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function CreateItemPage() {
  // State for each form field
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation]     = useState("");
  const [status, setStatus]         = useState("lost"); // Default to "lost"

  const [message, setMessage]       = useState("");
  const [isError, setIsError]       = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in before submitting
    if (!localStorage.getItem("token")) {
      setIsError(true);
      setMessage("Please login first to post an item.");
      return;
    }

    try {
      // POST /api/items — the JWT token is auto-attached by the Axios interceptor in api.js
      await API.post("/items", { title, description, location, status });

      setIsError(false);
      setMessage("Item posted successfully! Redirecting...");

      // Redirect to home page after success
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Failed to post item");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Post a Lost / Found Item</h2>

        {message && (
          <div className={`message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Item Title (e.g. Blue Wallet)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description (e.g. Found near the cafeteria)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />

        <input
          type="text"
          placeholder="Location (e.g. Library, 2nd Floor)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        {/* Dropdown to select if item is lost or found */}
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <button type="submit">Post Item</button>
      </form>
    </div>
  );
}

export default CreateItemPage;
