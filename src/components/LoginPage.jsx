// components/LoginPage.js
import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { login } from "../services/authService"; // import your API call

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      // Call onLogin to notify parent about successful login
      onLogin(data);
    } catch (err) {
      // Show proper error message
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm login-card" style={{ minWidth: "350px" }}>
        <h3 className="text-center mb-4 text-primary">Admin Login</h3>
        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white"><FaUser /></span>
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
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white"><FaLock /></span>
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-muted mt-3" style={{ fontSize: "0.85rem" }}>
          © 2025 Food Admin
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
