// Dashboard.jsx
import React from "react";
import { getAllFoods } from "../services/foodService";
import { useEffect } from "react";
import { getUsers } from "../services/userService";
import { getOrders } from "../services/orderService";
import { getCategoriesWithOrders,getTotalRevenue,getMonthlyRevenue } from "../services/adminService";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";

function Dashboard() {
  // Dummy data for charts
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4780 },
    { month: "May", sales: 5890 },
    { month: "Jun", sales: 6390 },
  ];

  const ordersData = [
    { category: "Pizza", orders: 120 },
    { category: "Burger", orders: 90 },
    { category: "Drinks", orders: 70 },
    { category: "Desserts", orders: 60 },
  ];

  const [foods, setFoods] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = React.useState([]);

  const [categoriesWithOrders, setCategoriesWithOrders] = React.useState([]);


  const fetchMonthlyRevenue = async () => {
    try {
      const data = await getMonthlyRevenue(new Date().getFullYear());
      setMonthlyRevenue(data);
      console.log("Monthly Revenue:", data);
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
    }
  };


  const fetchCategoriesWithOrders = async () => {
    try {
      const data = await getCategoriesWithOrders();
      setCategoriesWithOrders(data);
      console.log("Categories with orders:", data);
    } catch (error) {
      console.error("Error fetching categories with orders:", error);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const revenue = await getTotalRevenue();
      setTotalRevenue(revenue);
      console.log("Total Revenue:", revenue);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }
  };


  // Fetch foods and users
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      const data = await getAllFoods();
      setFoods(data);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };
  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchUsers();
    fetchOrders();
    fetchCategoriesWithOrders();
    fetchTotalRevenue();
    fetchMonthlyRevenue();
  }, []);

  return (
    <div className="container-fluid">
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <div
              className="icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: "50px", height: "50px" }}
            >
              <FaShoppingCart />
            </div>
            <div>
              <h6 className="text-muted mb-0">Total Orders</h6>
              <h4>{orders.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <div
              className="icon bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: "50px", height: "50px" }}
            >
              <FaMoneyBillWave />
            </div>
            <div>
              <h6 className="text-muted mb-0">Revenue</h6>
              <h4>₹{totalRevenue.toFixed(2)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <div
              className="icon bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: "50px", height: "50px" }}
            >
              <FaUsers />
            </div>
            <div>
              <h6 className="text-muted mb-0">Users</h6>
              <h4>{users.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
            <div
              className="icon bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: "50px", height: "50px" }}
            >
              <FaUtensils />
            </div>
            <div>
              <h6 className="text-muted mb-0">Foods</h6>
              <h4>{foods.length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3">
            <h6 className="mb-3">Monthly Sales Trend</h6>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" interval={0} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0d6efd"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3">
            <h6 className="mb-3">Orders by Category</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoriesWithOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="categoryName"
                  interval={0} // ✅ Show all category names
                  angle={-30} // ✅ Tilt the labels to avoid overlap
                  textAnchor="end"
                  height={80} // ✅ Add space for longer names
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders.length" fill="#198754" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
