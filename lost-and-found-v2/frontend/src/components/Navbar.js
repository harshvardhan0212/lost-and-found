import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo">
          🔍 Lost & Found
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/">🏠 Home</Link>

        {isLoggedIn && (
          <Link to="/create">➕ Post Item</Link>
        )}

        {isLoggedIn && user.isAdmin && (
          <Link to="/admin" className="admin-link">
            👑 Admin Panel
          </Link>
        )}

        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        ) : (
          <>
            <Link to="/login">🔑 Login</Link>
            <Link to="/register">📝 Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;