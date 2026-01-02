// components/OrdersManagement.jsx
import React, { useState, useEffect } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { getOrders, updateOrderStatus } from "../services/orderService";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");

  // Load orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || order.status === statusFilter)
  );

  // Open modal with selected order
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentMethod(order.paymentMethod);
  };

  // Save changes
  const handleSave = async () => {
    if (!selectedOrder) return;
    try {
      const updatedOrder = await updateOrderStatus(
        selectedOrder.id,
        editStatus
      );
      // Update frontend state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id
            ? { ...order, status: editStatus, paymentMethod: editPaymentMethod }
            : order
        )
      );
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Function to assign badge classes
  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "info";
      case "PREPARING":
        return "warning";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <h1 className="h3 p-color fw-bold">Orders Management</h1>
        <div className="d-flex gap-2 flex-wrap w-100 w-md-auto">
          <div className="input-group">
            <span className="input-group-text theme-bg-light theme-border">
              <FaSearch className="theme-text-muted" />
            </span>
            <input
              type="text"
              className="form-control theme-bg-light theme-text-main theme-border"
              placeholder="Search by Order ID or Customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="form-select theme-bg-light theme-text-main theme-border"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PREPARING">Preparing</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title theme-text-dark fw-bold mb-3">Recent Orders</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="theme-text-muted">
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Food ID</th>
                  <th>Items</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Payment Method</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center theme-text-muted">
                      No orders found.
                    </td>
                  </tr>
                )}
                {filteredOrders.map(
                  (order) => (
                    (
                      <tr key={order.id}>
                        <td className="theme-text-dark fw-bold">{order.id}</td>
                        <td className="theme-text-main">{new Date(order.orderDate).toLocaleString()}</td>
                        <td className="theme-text-main">{order.items.map(item => item.foodId).join(", ")}</td>
                        <td className="theme-text-main">{order.items.length}</td>
                        <td className="theme-text-main">{order.address}</td>
                        <td>
                          <span
                            className={`badge bg-${getStatusClass(
                              order.status
                            )} bg-opacity-10 text-${getStatusClass(order.status)} border-0`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="theme-text-main">₹{order.totalAmount?.toFixed(2)}</td>
                        <td className="theme-text-main">{order.paymentMethod}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditClick(order)}
                          >
                            <FaEdit className="me-1" /> Update
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 theme-bg-card">
              <div className="modal-header theme-border-bottom">
                <h5 className="modal-title theme-text-dark fw-bold">Update Order {selectedOrder.id}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label theme-text-dark">Status</label>
                  <select
                    className="form-select theme-bg-light theme-text-main theme-border"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer theme-border-top">
                <button
                  className="btn btn-secondary border-0"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
