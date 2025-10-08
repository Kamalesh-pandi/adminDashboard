// components/UsersManagement.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaDownload, FaPlus } from "react-icons/fa";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../services/userService";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "USER",
    phoneNumber: "",
  });

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "USER",
      phoneNumber: user.phoneNumber || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let savedUser;
      if (editingUser) {
        savedUser = await updateUser(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((user) => (user.id === editingUser.id ? savedUser : user))
        );
      } else {
        savedUser = await addUser(formData);
        setUsers((prev) => [...prev, savedUser]);
      }

      setShowModal(false);
      setEditingUser(null);
      setFormData({
        fullName: "",
        email: "",
        role: "USER",
        phoneNumber: "",
      });
    } catch (err) {
      setError(err.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <h1 className="h3 text-primary fw-bold">Users Management</h1>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-secondary" onClick={handleExport}>
            <FaDownload className="me-1" /> Export Users
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text bg-light">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, role or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Loading...</div>}

      {/* Users Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">User Accounts</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
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
                    <td colSpan="6" className="text-center text-muted">
                      No users found.
                    </td>
                  </tr>
                )}
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.phoneNumber}</td>
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

      {/* Modal Add/Edit User */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {editingUser ? "Edit User" : "Add New User"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="USER">Customer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {editingUser ? "Update User" : "Save User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
