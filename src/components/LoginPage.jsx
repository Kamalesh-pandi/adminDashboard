// components/LoginPage.js
import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaSun, FaMoon } from "react-icons/fa";
import { login } from "../services/authService";
import logo from "../assets/food logo.png";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);
      onLogin(data);
    } catch (err) {
      const errorMsg = err.message || (typeof err === 'string' ? err : "Login failed. Please try again.");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <button className="login-theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>
      <div className="login-card">
        <div className="text-center mb-5">
          <div className="login-logo-container">
            <img src={logo} alt="FoodCafe Logo" />
          </div>
          <h3 className="h4 px-color-dark">Admin Login</h3>
          <p className="text-muted small">
            Empowering your restaurant management
          </p>
        </div>

        {error && (
          <div className="alert alert-danger text-center mb-4" style={{ borderRadius: "12px", border: "none", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold small text-uppercase tracking-wider text-muted mb-2">Email Address</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUser />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="form-label fw-bold small text-uppercase tracking-wider text-muted mb-2">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-login w-100" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner text-white"></span>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-muted mb-0" style={{ fontSize: "0.75rem", opacity: 0.7 }}>
            © 2026 FoodCafe. Powered by Advanced Dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
