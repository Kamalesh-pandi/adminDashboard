// components/FoodsManagement.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaStar, FaPlus } from "react-icons/fa";
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-primary fw-bold">Foods Management</h1>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            setEditingFood(null);
            setNewFood({ ...initialFoodState });
            setShowModal(true);
          }}
        >
          <FaPlus className="me-2" /> Add New Food
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Loading...</div>}

      {/* Food Cards */}
      <div className="row">
        {foods.map((food) => (
          <div key={food.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm food-card">
              <img
                src={food.imageUrl || "src/assets/food logo.png"}
                className="card-img-top"
                alt={food.name}
                style={{ height: "250px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if fallback fails
                  e.target.src = "src/assets/food logo.png";
                }}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{food.name}</h5>
                <p className="text-muted mb-1">{food.categoryName || "N/A"}</p>
                <p className="text-secondary mb-2 small">{food.description}</p>

                <div className="d-flex align-items-center mb-2">
                  <h5 className="text-primary me-auto mb-0">
                    ₹{food.price.toFixed(2)}
                  </h5>
                </div>

                <div className="mb-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`me-1 ${
                        index < Math.round(food.rating)
                          ? "text-warning"
                          : "text-secondary"
                      }`}
                    />
                  ))}
                  <span className="ms-2 small text-muted">
                    {food.rating.toFixed(1)}
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
                    onClick={() => handleDelete(food.id)}
                  >
                    <FaTrash className="me-1" /> Delete
                  </button>
                </div>

                <div className="mt-2 d-flex gap-1">
                  {food.popular && (
                    <span className="badge bg-warning text-dark">Popular</span>
                  )}
                  {food.newest && (
                    <span className="badge bg-info text-dark">New</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
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
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newFood.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
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
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price"
                        value={newFood.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={newFood.description}
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
                        value={newFood.imageUrl}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        min="0"
                        className="form-control"
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
                        <label className="form-check-label">Popular</label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="newest"
                          checked={newFood.newest}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">New</label>
                      </div>
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
