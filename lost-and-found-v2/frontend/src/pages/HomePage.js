// src/pages/HomePage.js
// This is the main page. It fetches all items from the backend and displays them.
// Each item has a "Claim" button that sends a claim request.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function HomePage() {
  // State to store the list of items fetched from the API
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // useEffect runs once when the component mounts (like componentDidMount)
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch all items from GET /api/items
  const fetchItems = async () => {
    try {
      const response = await API.get("/items");
      setItems(response.data); // Store the array of items in state
    } catch (error) {
      setMessage("Failed to load items.");
    } finally {
      setLoading(false); // Stop showing loading text
    }
  };

  // Called when the user clicks "Claim" on an item
  const handleClaim = async (itemId) => {
    // User must be logged in to claim
    if (!localStorage.getItem("token")) {
      alert("Please login to claim an item.");
      navigate("/login");
      return;
    }

    try {
      // POST /api/claims with the item's ID
      await API.post("/claims", { itemId });
      alert("Claim submitted! Status: Pending");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit claim");
    }
  };

  // Show loading text while items are being fetched
  if (loading) return <div className="container"><p>Loading items...</p></div>;

  return (
    <div className="container">
      <h2>All Lost &amp; Found Items</h2>

      {/* Show error message if fetch failed */}
      {message && <div className="message error">{message}</div>}

      {/* If no items exist yet */}
      {items.length === 0 && <p>No items posted yet. Be the first to post one!</p>}

      {/* Loop through items and render each as a card */}
      {items.map((item) => (
        <div key={item._id} className="item-card">
          {/* Badge shows whether item is "lost" or "found" */}
          <span className={`badge ${item.status}`}>{item.status}</span>

          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p>📍 {item.location}</p>

          {/* Show who reported it (populated from DB) */}
          {item.reportedBy && (
            <p style={{ fontSize: "12px", color: "#999", marginTop: "6px" }}>
              Posted by: {item.reportedBy.name}
            </p>
          )}

          {/* Claim button */}
          <button
            className="claim-btn"
            onClick={() => handleClaim(item._id)}
          >
            Claim This Item
          </button>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
