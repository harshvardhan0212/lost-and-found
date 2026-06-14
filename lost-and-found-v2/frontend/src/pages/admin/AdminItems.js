// src/pages/admin/AdminItems.js
// Admin can see ALL items and delete any item.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

function AdminItems() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate              = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.isAdmin) {
      alert("Access denied!");
      navigate("/");
      return;
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/admin/items");
      setItems(res.data);
    } catch (err) {
      setMessage("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  // Delete an item (also deletes its related claims on backend)
  const handleDelete = async (itemId, itemTitle) => {
    // Ask for confirmation before deleting
    if (!window.confirm(`Delete "${itemTitle}"? This will also delete all its claims.`)) return;

    try {
      await API.delete(`/admin/items/${itemId}`);
      // Remove from local state so UI updates immediately
      setItems((prev) => prev.filter((i) => i._id !== itemId));
      setMessage("Item deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete item");
    }
  };

  if (loading) return <div className="container"><p>Loading items...</p></div>;

  return (
    <div className="container">
      <h2>📦 Manage Items</h2>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Total: {items.length} items posted
      </p>

      {message && <div className="message success">{message}</div>}

      {items.length === 0 ? (
        <p style={{ color: "#888" }}>No items found.</p>
      ) : (
        items.map((item) => (
          <div key={item._id} className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className={`badge ${item.status}`}>{item.status}</span>
                <h3 style={{ marginBottom: "4px", marginTop: "6px" }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "#555" }}>{item.description}</p>
                <p style={{ fontSize: "13px", color: "#777" }}>📍 {item.location}</p>
                <p style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
                  Posted by: {item.reportedBy ? `${item.reportedBy.name} (${item.reportedBy.email})` : "Unknown"}
                </p>
                <p style={{ fontSize: "12px", color: "#aaa" }}>
                  Date: {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
              </div>

              {/* Delete button */}
              <button
                className="reject-btn"
                onClick={() => handleDelete(item._id, item.title)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminItems;
