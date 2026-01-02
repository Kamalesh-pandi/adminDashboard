// components/UsersManagement.jsx
import React, { useState, useEffect } from "react";
import { FaTrash, FaSearch, FaDownload } from "react-icons/fa";
import {
  getAllUsers,
  deleteUser,
} from "../services/userService";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    setError("");
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber || "").includes(searchTerm)
  );

  // Convert users array to CSV and download
const handleExport = () => {
  if (!users || users.length === 0) return;

  const headers = ["ID", "Full Name", "Email", "Role", "Phone Number"];
  const rows = users.map(u => [u.id, u.fullName, u.email, u.role, u.phoneNumber]);

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += headers.join(",") + "\r\n";
  rows.forEach(row => {
    csvContent += row.map(value => `"${value || ""}"`).join(",") + "\r\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "users_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <h1 className="h3 p-color fw-bold mb-0">User Management</h1>
        <div className="d-flex gap-2 flex-wrap w-100 w-sm-auto">
          <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-grow-1 flex-sm-grow-0" onClick={handleExport}>
            <FaDownload className="me-2" /> Export
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text theme-bg-light theme-border">
            <FaSearch className="theme-text-muted" />
          </span>
          <input
            type="text"
            className="form-control theme-bg-light theme-text-main theme-border"
            placeholder="Search by name, email, role or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center theme-text-main">Loading...</div>}

      {/* Users Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title theme-text-dark fw-bold mb-4">User Accounts</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="theme-text-muted">
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center theme-text-muted">
                      No users found.
                    </td>
                  </tr>
                )}
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="theme-text-main">{user.id}</td>
                    <td className="theme-text-dark fw-bold">{user.fullName}</td>
                    <td className="theme-text-main">{user.email}</td>
                    <td className="theme-text-main">{user.role}</td>
                    <td className="theme-text-main">{user.phoneNumber}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
