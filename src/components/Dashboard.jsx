import React, { useState, useEffect } from "react";
import { getAllFoods } from "../services/foodService";
import { getAllCategories } from "../services/categoryService";
import { getAllOrders } from "../services/orderService";
import { getAllUsers } from "../services/userService";
import { getTotalRevenue } from "../services/adminService";
import { 
  FaSearch, 
  FaChevronRight, 
  FaShoppingCart, 
  FaUsers, 
  FaUtensils, 
  FaWallet,
  FaEllipsisH
} from "react-icons/fa";

function Dashboard({ setActivePage }) {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalMenuItems: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foods, categories, orders, users, revenue] = await Promise.all([
          getAllFoods(),
          getAllCategories(),
          getAllOrders(),
          getAllUsers(),
          getTotalRevenue()
        ]);

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalMenuItems: foods.length
        });

        // Filter for recent orders (last 5)
        setRecentOrders(orders.slice(0, 5));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateReport = () => {
    if (loading) return;

    const headers = ["ID", "Customer", "Date", "Amount", "Status"];
    const rows = recentOrders.map(o => [
      o.id, 
      o.user?.fullName || "Guest", 
      new Date(o.orderDate).toLocaleDateString(), 
      o.totalPrice, 
      o.orderStatus
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "OVERVIEW STATS\r\n";
    csvContent += `Total Revenue,Total Orders,Total Users,Menu Items\r\n`;
    csvContent += `"${stats.totalRevenue}","${stats.totalOrders}","${stats.totalUsers}","${stats.totalMenuItems}"\r\n\r\n`;
    csvContent += "RECENT ORDERS\r\n";
    csvContent += headers.join(",") + "\r\n";
    rows.forEach(row => {
      csvContent += row.map(value => `"${value || ""}"`).join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admin_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <FaWallet />, color: "#4e73df", bg: "rgba(78, 115, 223, 0.1)" },
    { title: "Total Orders", value: stats.totalOrders, icon: <FaShoppingCart />, color: "#1cc88a", bg: "rgba(28, 200, 138, 0.1)" },
    { title: "Total Users", value: stats.totalUsers, icon: <FaUsers />, color: "#36b9cc", bg: "rgba(54, 185, 204, 0.1)" },
    { title: "Menu Items", value: stats.totalMenuItems, icon: <FaUtensils />, color: "#f6c23e", bg: "rgba(246, 194, 62, 0.1)" }
  ];

  return (
    <div className="dashboard-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 theme-text-dark fw-bold">Overview</h1>
        <button 
          className="btn btn-sm btn-primary-custom shadow-sm"
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 g-lg-4 mb-4 mb-lg-5">
        {statCards.map((stat, idx) => (
          <div key={idx} className="col-12 col-md-6 col-xl-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-xs font-weight-bold text-uppercase mb-1 theme-text-muted" style={{fontSize: '0.75rem', letterSpacing: '0.05em'}}>
                      {stat.title}
                    </div>
                    <div className="h5 mb-0 font-weight-bold theme-text-dark" style={{fontSize: '1.5rem'}}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="icon-circle" style={{
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    backgroundColor: stat.bg, 
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Recent Orders Table */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-header theme-bg-card py-3 d-flex flex-row align-items-center justify-content-between theme-border-bottom">
              <h6 className="m-0 font-weight-bold theme-text-dark">Recent Orders</h6>
              <div 
                className="theme-text-muted" 
                style={{cursor: 'pointer'}}
                onClick={() => setActivePage("orders")}
              >
                <FaChevronRight />
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr className="theme-text-muted" style={{fontSize: '0.85rem'}}>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} style={{fontSize: '0.9rem'}}>
                        <td className="fw-bold theme-text-dark">#{order.id.toString().slice(-4)}</td>
                        <td className="theme-text-main">{order.user?.fullName || "Guest User"}</td>
                        <td className="theme-text-main">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="theme-text-main">₹{order.totalPrice}</td>
                        <td>
                          <span className={`badge bg-${
                            order.orderStatus === 'COMPLETED' ? 'success' : 
                            order.orderStatus === 'PENDING' ? 'warning' : 'primary'
                          } bg-opacity-10 text-${
                            order.orderStatus === 'COMPLETED' ? 'success' : 
                            order.orderStatus === 'PENDING' ? 'warning' : 'primary'
                          } border-0`}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4 theme-text-muted">No recent orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-header theme-bg-card py-3 d-flex flex-row align-items-center justify-content-between theme-border-bottom">
              <h6 className="m-0 font-weight-bold theme-text-dark">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-primary border-0 text-start p-3 d-flex align-items-center theme-bg-light" 
                  style={{borderRadius: '12px'}}
                  onClick={() => setActivePage("foods")}
                >
                  <FaUtensils className="me-3" /> Add New Dish
                </button>
                <button 
                  className="btn btn-outline-success border-0 text-start p-3 d-flex align-items-center" 
                  style={{borderRadius: '12px', backgroundColor: 'rgba(28, 200, 138, 0.1)'}}
                  onClick={() => setActivePage("orders")}
                >
                  <FaShoppingCart className="me-3" /> View All Orders
                </button>
                <button 
                  className="btn btn-outline-info border-0 text-start p-3 d-flex align-items-center" 
                  style={{borderRadius: '12px', backgroundColor: 'rgba(54, 185, 204, 0.1)'}}
                  onClick={() => setActivePage("users")}
                >
                  <FaUsers className="me-3" /> Manage Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

