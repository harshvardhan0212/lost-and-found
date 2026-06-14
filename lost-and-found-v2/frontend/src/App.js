import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateItemPage from "./pages/CreateItemPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClaims from "./pages/admin/AdminClaims";
import AdminItems from "./pages/admin/AdminItems";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={<CreateItemPage />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/claims" element={<AdminClaims />} />
        <Route path="/admin/items" element={<AdminItems />} />
      </Routes>
    </Router>
  );
}

export default App;