// App.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Dashboard from "./components/Dashboard";
import FoodsManagement from "./components/FoodsManagement";
import CategoriesManagement from "./components/CategoriesManagement";
import UsersManagement from "./components/UsersManagement";
import OrdersManagement from "./components/OrdersManagement";

import LoginPage from "./components/LoginPage";
import { logout } from "./services/authService";

import {
  FaTachometerAlt,
  FaUtensils,
  FaTags,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout(); // remove token from localStorage
      setIsLoggedIn(false);
      setActivePage("dashboard");
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard onLogout={handleLogout} />;
      case "foods":
        return <FoodsManagement />;
      case "categories":
        return <CategoriesManagement />;
      case "users":
        return <UsersManagement />;
      case "orders":
        return <OrdersManagement />;
      default:
        return <Dashboard onLogout={handleLogout} />;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { key: "foods", label: "Foods", icon: <FaUtensils /> },
    { key: "categories", label: "Categories", icon: <FaTags /> },
    { key: "users", label: "Users", icon: <FaUsers /> },
    { key: "orders", label: "Orders", icon: <FaShoppingCart /> },
  ];

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="d-flex flex-column">
      {/* Desktop Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top d-none d-lg-flex justify-content-between px-4">
        <span className="navbar-brand mb-0 h4 fw-bold text-primary">
          🍔 Food Management
        </span>
        <ul className="navbar-nav flex-row">
          {navItems.map((item) => (
            <li
              key={item.key}
              className={`nav-item mx-3 nav-link-custom ${
                activePage === item.key ? "active-nav" : ""
              }`}
              onClick={() => setActivePage(item.key)}
              style={{ cursor: "pointer" }}
            >
              {item.icon} <span className="ms-2">{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="d-flex align-items-center gap-3">
          <img
            src="src/assets/food logo.png"
            alt="Admin"
            width={50}
            height={50}
            className="rounded-circle border"
          />
          <span className="fw-semibold">Admin</span>
          <button
            className="btn btn-outline-danger btn-sm d-flex align-items-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-1" /> Logout
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm d-lg-none px-3 d-flex justify-content-between">
        <FaBars
          style={{ cursor: "pointer" }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <span className="navbar-brand mb-0 h5 fw-bold text-primary">
          🍔 Food Admin
        </span>
        <img
          src="https://via.placeholder.com/35"
          alt="Admin"
          className="rounded-circle border"
        />
      </nav>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div className="overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <h5 className="text-center py-3 border-bottom">Menu</h5>
        <ul className="nav flex-column mt-3">
          {navItems.map((item) => (
            <li
              key={item.key}
              className={`nav-item p-3 sidebar-item ${
                activePage === item.key ? "active-nav" : ""
              }`}
              onClick={() => {
                setActivePage(item.key);
                setMobileMenuOpen(false);
              }}
              style={{ cursor: "pointer" }}
            >
              {item.icon} <span className="ms-2">{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto p-3 border-top">
          <button
            className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 main-content">{renderPage()}</div>
    </div>
  );
}

export default App;
