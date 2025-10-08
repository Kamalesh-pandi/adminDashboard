// components/CategoriesManagement.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  // Fetch categories from backend
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      imageUrl: category.imageUrl || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let savedCategory;
      if (editingCategory) {
        // Update existing category
        savedCategory = await updateCategory(editingCategory.id, formData);
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? savedCategory : cat
          )
        );
      } else {
        // Add new category
        savedCategory = await addCategory(formData);
        setCategories((prev) => [...prev, savedCategory]);
      }

      // Reset modal and form
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "", imageUrl: "" });
    } catch (err) {
      setError(err.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    setError("");
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-primary fw-bold">Categories Management</h1>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", description: "", imageUrl: "" });
            setShowModal(true);
          }}
        >
          <FaPlus className="me-2" /> Add New Category
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Loading...</div>}

      <div className="row">
        {categories.map((category) => (
          <div key={category.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm category-card">
              <img
                src={category.imageUrl || "/assets/default-category.png"}
                className="card-img-top"
                alt={category.name}
                style={{ height: "210px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/default-category.png";
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{category.name}</h5>
                <p className="text-secondary small mb-3">{category.description}</p>
                <div className="mt-auto d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(category)}
                  >
                    <FaEdit className="me-1" /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(category.id)}
                  >
                    <FaTrash className="me-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {editingCategory ? "Edit Category" : "Add New Category"}
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
                    <div className="col-md-12">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="2"
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
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
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {editingCategory ? "Update Category" : "Save Category"}
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

export default CategoriesManagement;
