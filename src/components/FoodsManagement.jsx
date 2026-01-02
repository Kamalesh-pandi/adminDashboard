// components/FoodsManagement.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaStar, FaPlus, FaSearch } from "react-icons/fa";
import {
  getAllFoods,
  addFood,
  updateFood,
  deleteFood,
  getFoodById,
} from "../services/foodService";
import { getAllCategories } from "../services/categoryService"; // 👈 category service

// Initial state (rating must be string for input)
const initialFoodState = {
  name: "",
  categoryId: "",
  price: "",
  description: "",
  imageUrl: "",
  rating: "0", // 👈 string
  popular: false,
  newest: false,
};

const FoodsManagement = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [newFood, setNewFood] = useState({ ...initialFoodState });

  // Fetch foods
  const fetchFoods = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllFoods();
      setFoods(data);
    } catch (err) {
      setError(err.message || "Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFood((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = (food.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()));
    // Fallback to empty string for categoryId to avoid comparison with undefined
    const foodCatId = food.categoryId ? food.categoryId.toString() : "";
    const matchesCategory = categoryFilter === "" || foodCatId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddOrUpdateFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const foodPayload = {
        ...newFood,
        price: parseFloat(newFood.price),
        rating: parseFloat(newFood.rating), // 👈 convert string to number
        categoryId: parseInt(newFood.categoryId),
      };

      if (editingFood && editingFood.id) {
        await updateFood(editingFood.id, foodPayload);
      } else {
        await addFood(foodPayload);
      }

      setShowModal(false);
      setEditingFood(null);
      setNewFood({ ...initialFoodState });
      fetchFoods();
    } catch (err) {
      setError(err.message || "Failed to save food");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (food) => {
    setLoading(true);
    setError("");
    try {
      const latestFood = await getFoodById(food.id);
      setEditingFood(latestFood);
      setNewFood({
        ...latestFood,
        categoryId: latestFood.categoryId || "",
        rating: latestFood.rating?.toString() || "0", // 👈 convert to string
      });
      setShowModal(true);
    } catch (err) {
      setError(err.message || "Failed to load food");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food?")) return;

    setLoading(true);
    setError("");
    try {
      await deleteFood(id);
      fetchFoods();
    } catch (err) {
      setError(err.message || "Failed to delete food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h1 className="h3 p-color fw-bold mb-0">Menu Management</h1>
        <div className="d-flex gap-2 flex-wrap w-100 w-md-auto">
          <div className="input-group" style={{maxWidth: '300px'}}>
            <span className="input-group-text theme-bg-light theme-border">
              <FaSearch className="theme-text-muted" />
            </span>
            <input 
              type="text" 
              className="form-control theme-bg-light theme-text-main theme-border" 
              placeholder="Search dishes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-select theme-bg-light theme-text-main theme-border" 
            style={{maxWidth: '200px'}}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            className="btn bg-color d-flex align-items-center"
            onClick={() => {
              setEditingFood(null);
              setNewFood({ ...initialFoodState });
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Add Food
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}
      {loading && <div className="text-center py-5"><div className="loading-spinner"></div></div>}

      {/* Food Cards */}
      <div className="row">
        {filteredFoods && filteredFoods.map((food) => {
          if (!food) return null;
          return (
            <div key={food.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm food-card border-0">
                <img
                  src={food.imageUrl || "src/assets/food logo.png"}
                  className="card-img-top"
                  alt={food.name || "Food"}
                  style={{ height: "250px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "src/assets/food logo.png";
                  }}
                />

                <div className="card-body d-flex flex-column theme-bg-card">
                  <h5 className="card-title fw-bold theme-text-dark">{food.name || "Unnamed"}</h5>
                  <p className="theme-text-muted mb-1">{food.categoryName || "N/A"}</p>
                  <p className="theme-text-main mb-2 small">{food.description || ""}</p>

                  <div className="d-flex align-items-center mb-2">
                    <h5 className="p-color me-auto mb-0">
                      ₹{(food.price || 0).toFixed(2)}
                    </h5>
                  </div>

                  <div className="mb-2">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`me-1 ${
                          index < Math.round(food.rating || 0)
                            ? "text-warning"
                            : "theme-text-muted opacity-50"
                        }`}
                      />
                    ))}
                    <span className="ms-2 small theme-text-muted">
                      {(food.rating || 0).toFixed(1)}
                    </span>
                  </div>

                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEdit(food)}
                    >
                      <FaEdit className="me-1" /> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => food.id && handleDelete(food.id)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </button>
                  </div>

                  <div className="mt-2 d-flex gap-1">
                    {food.popular && (
                      <span className="badge bg-warning text-dark border-0">Popular</span>
                    )}
                    {food.newest && (
                      <span className="badge bg-info text-dark border-0">New</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {(!filteredFoods || filteredFoods.length === 0) && !loading && (
          <div className="col-12 text-center py-5 theme-text-muted">No dishes found.</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content shadow-lg border-0 theme-bg-card">
              <div className="modal-header bg-color text-white border-0">
                <h5 className="modal-title fw-bold">
                  {editingFood ? "Edit Food" : "Add New Food"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddOrUpdateFood}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label theme-text-dark">Name</label>
                      <input
                        type="text"
                        className="form-control theme-bg-light theme-text-main theme-border"
                        name="name"
                        value={newFood.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label theme-text-dark">Category</label>
                      <select
                        className="form-select theme-bg-light theme-text-main theme-border"
                        name="categoryId"
                        value={newFood.categoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label theme-text-dark">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control theme-bg-light theme-text-main theme-border"
                        name="price"
                        value={newFood.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label theme-text-dark">Description</label>
                      <textarea
                        className="form-control theme-bg-light theme-text-main theme-border"
                        name="description"
                        value={newFood.description}
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
                        value={newFood.imageUrl}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label theme-text-dark">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        min="0"
                        className="form-control theme-bg-light theme-text-main theme-border"
                        name="rating"
                        value={newFood.rating}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 d-flex align-items-center gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="popular"
                          checked={newFood.popular}
                          onChange={handleChange}
                        />
                        <label className="form-check-label theme-text-main">Popular</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="newest"
                          checked={newFood.newest}
                          onChange={handleChange}
                        />
                        <label className="form-check-label theme-text-main">New</label>
                      </div>
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {editingFood ? "Update Food" : "Save Food"}
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

export default FoodsManagement;
