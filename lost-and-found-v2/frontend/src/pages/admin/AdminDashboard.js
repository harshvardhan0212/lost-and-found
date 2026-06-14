// src/pages/admin/AdminDashboard.js
// Main admin dashboard — shows summary stats and navigation to other admin sections.

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";

function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const navigate              = useNavigate();

  useEffect(() => {
    // Check if logged-in user is admin
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.isAdmin) {
      alert("Access denied! Admins only.");
      navigate("/");
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>;
  if (error)   return <div className="container"><p className="message error">{error}</p></div>;

  return (
    <div className="container">
      <h2>🛠️ Admin Dashboard</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Welcome, Admin! Manage all claims, items, and users from here.
      </p>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-number">{stats.totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{stats.lostItems}</div>
          <div className="stat-label">Lost Items</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{stats.foundItems}</div>
          <div className="stat-label">Found Items</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Registered Users</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-number">{stats.pendingClaims}</div>
          <div className="stat-label">Pending Claims</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{stats.approvedClaims}</div>
          <div className="stat-label">Approved Claims</div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{stats.rejectedClaims}</div>
          <div className="stat-label">Rejected Claims</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-number">{stats.totalClaims}</div>
          <div className="stat-label">Total Claims</div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div style={{ marginTop: "30px" }}>
        <h3 style={{ marginBottom: "14px" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/admin/claims" className="admin-nav-btn">
            📋 Manage Claims
          </Link>
          <Link to="/admin/items" className="admin-nav-btn">
            📦 Manage Items
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
