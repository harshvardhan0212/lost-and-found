// src/pages/admin/AdminClaims.js
// Admin can see ALL claims and approve or reject each one.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

function AdminClaims() {
  const [claims, setClaims]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filter, setFilter]   = useState("all"); // Filter by status
  const navigate              = useNavigate();

  useEffect(() => {
    // Only admin can access this page
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.isAdmin) {
      alert("Access denied!");
      navigate("/");
      return;
    }
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await API.get("/admin/claims");
      setClaims(res.data);
    } catch (err) {
      setMessage("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  // Called when admin clicks Approve or Reject button
  const handleStatusUpdate = async (claimId, newStatus) => {
    try {
      await API.put(`/admin/claims/${claimId}`, { status: newStatus });

      // Update the claim in local state (no need to refetch all claims)
      setClaims((prev) =>
        prev.map((c) =>
          c._id === claimId ? { ...c, status: newStatus } : c
        )
      );

      setMessage(`Claim ${newStatus} successfully!`);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update claim");
    }
  };

  // Filter claims based on selected tab
  const filteredClaims = claims.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  if (loading) return <div className="container"><p>Loading claims...</p></div>;

  return (
    <div className="container">
      <h2>📋 Manage Claims</h2>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Total: {claims.length} claims
      </p>

      {/* Success/error message */}
      {message && (
        <div className="message success">{message}</div>
      )}

      {/* Filter tabs */}
      <div className="filter-tabs">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? "active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {/* Show count for each tab */}
            <span className="tab-count">
              {tab === "all"
                ? claims.length
                : claims.filter((c) => c.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Claims list */}
      {filteredClaims.length === 0 ? (
        <p style={{ color: "#888", marginTop: "20px" }}>No {filter} claims found.</p>
      ) : (
        filteredClaims.map((claim) => (
          <div key={claim._id} className="admin-card">
            {/* Claim status badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                {/* Item info */}
                <h3 style={{ marginBottom: "4px" }}>
                  {claim.item ? claim.item.title : "Item Deleted"}
                </h3>
                {claim.item && (
                  <>
                    <p style={{ fontSize: "13px", color: "#666" }}>
                      📍 {claim.item.location}
                    </p>
                    <p style={{ fontSize: "13px", color: "#666" }}>
                      Type: <span className={`badge ${claim.item.status}`}>{claim.item.status}</span>
                    </p>
                  </>
                )}
              </div>

              {/* Status badge */}
              <span className={`status-badge ${claim.status}`}>
                {claim.status}
              </span>
            </div>

            {/* Claimant info */}
            <div className="claimant-info">
              <strong>Claimant:</strong>{" "}
              {claim.claimedBy
                ? `${claim.claimedBy.name} (${claim.claimedBy.email})`
                : "User deleted"}
            </div>

            <p style={{ fontSize: "12px", color: "#aaa", marginTop: "6px" }}>
              Claimed on: {new Date(claim.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric"
              })}
            </p>

            {/* Action buttons — only show if claim is still pending */}
            {claim.status === "pending" && (
              <div className="action-btns">
                <button
                  className="approve-btn"
                  onClick={() => handleStatusUpdate(claim._id, "approved")}
                >
                  ✅ Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleStatusUpdate(claim._id, "rejected")}
                >
                  ❌ Reject
                </button>
              </div>
            )}

            {/* If already actioned, show a reset option */}
            {claim.status !== "pending" && (
              <button
                className="reset-btn"
                onClick={() => handleStatusUpdate(claim._id, "pending")}
              >
                🔄 Reset to Pending
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminClaims;
