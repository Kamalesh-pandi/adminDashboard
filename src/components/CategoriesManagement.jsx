// components/CategoriesManagement.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCategories = categories.filter(cat => 
    (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h1 className="h3 p-color fw-bold mb-0 text-nowrap">Categories Management</h1>
        <div className="d-flex gap-2 flex-wrap w-100 w-md-auto">
          <div className="input-group" style={{maxWidth: '300px'}}>
            <span className="input-group-text theme-bg-light theme-border">
              <FaSearch className="theme-text-muted" />
            </span>
            <input 
              type="text" 
              className="form-control theme-bg-light theme-text-main theme-border" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn bg-color d-flex align-items-center"
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: "", description: "", imageUrl: "" });
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Add Category
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}
      {loading && <div className="text-center py-5"><div className="loading-spinner"></div></div>}

      <div className="row">
        {filteredCategories && filteredCategories.map((category) => {
          if (!category) return null;
          return (
            <div key={category.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm category-card border-0">
                <img
                  src={category.imageUrl || "/assets/default-category.png"}
                  className="card-img-top"
                  alt={category.name || "Category"}
                  style={{ height: "210px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/default-category.png";
                  }}
                />
                <div className="card-body d-flex flex-column theme-bg-card">
                  <h5 className="card-title fw-bold theme-text-dark">{category.name || "Unnamed"}</h5>
                  <p className="theme-text-main small mb-3">{category.description || ""}</p>
                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(category)}
                    >
                      <FaEdit className="me-1" /> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => category.id && handleDelete(category.id)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {(!filteredCategories || filteredCategories.length === 0) && !loading && (
          <div className="col-12 text-center py-5 theme-text-muted">No categories found.</div>
        )}
      </div>

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content shadow-lg border-0 theme-bg-card">
              <div className="modal-header bg-color text-white border-0">
                <h5 className="modal-title fw-bold">
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
                      <label className="form-label theme-text-dark">Name</label>
                      <input
                        type="text"
                        className="form-control theme-bg-light theme-text-main theme-border"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label theme-text-dark">Description</label>
                      <textarea
                        className="form-control theme-bg-light theme-text-main theme-border"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="2"
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label theme-text-dark">Image URL</label>
                      <input
                        type="text"
                        className="form-control theme-bg-light theme-text-main theme-border"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer theme-border-top">
                  <button
                    type="button"
                    className="btn btn-secondary border-0"
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
