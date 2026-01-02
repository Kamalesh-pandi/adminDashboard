import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Dashboard from "./components/Dashboard";
import FoodsManagement from "./components/FoodsManagement";
import CategoriesManagement from "./components/CategoriesManagement";
import UsersManagement from "./components/UsersManagement";
import OrdersManagement from "./components/OrdersManagement";

import LoginPage from "./components/LoginPage";
import { logout } from "./services/authService";
import logo from "./assets/food logo.png";

import {
  FaTachometerAlt,
  FaUtensils,
  FaSignOutAlt,
  FaSearch,
  FaChevronRight,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaShoppingCart,
  FaUsers,
  FaList
} from "react-icons/fa";
import { getAllOrders } from "./services/orderService";
import { getAllFoods } from "./services/foodService";
import { getAllCategories } from "./services/categoryService";
import { getAllUsers } from "./services/userService";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [expandedMenus, setExpandedMenus] = useState({ restaurant: true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    if (token) {
      setIsLoggedIn(true);
      if (name) setAdminName(name);
    }
  }, []);

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    if (data && data.name) {
      setAdminName(data.name);
      localStorage.setItem("name", data.name);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      localStorage.removeItem("name");
      setIsLoggedIn(false);
      setActivePage("dashboard");
      setAdminName("Admin");
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateTo = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    setShowSearchResults(true);

    try {
      const [orders, foods, categories, users] = await Promise.all([
        getAllOrders().catch(() => []),
        getAllFoods().catch(() => []),
        getAllCategories().catch(() => []),
        getAllUsers().catch(() => [])
      ]);

      const lowerQuery = query.toLowerCase();
      const results = [];

      // Search orders
      const matchedOrders = orders.filter(order => 
        order.id?.toString().includes(lowerQuery) ||
        order.user?.fullName?.toLowerCase().includes(lowerQuery)
      ).slice(0, 3);
      
      matchedOrders.forEach(order => {
        results.push({
          type: 'order',
          id: order.id,
          title: `Order #${order.id}`,
          subtitle: order.user?.fullName || 'Guest',
          page: 'orders'
        });
      });

      // Search foods
      const matchedFoods = foods.filter(food => 
        food.name?.toLowerCase().includes(lowerQuery) ||
        food.description?.toLowerCase().includes(lowerQuery)
      ).slice(0, 3);
      
      matchedFoods.forEach(food => {
        results.push({
          type: 'food',
          id: food.id,
          title: food.name,
          subtitle: food.categoryName || 'Food Item',
          page: 'foods'
        });
      });

      // Search categories
      const matchedCategories = categories.filter(cat => 
        cat.name?.toLowerCase().includes(lowerQuery)
      ).slice(0, 2);
      
      matchedCategories.forEach(cat => {
        results.push({
          type: 'category',
          id: cat.id,
          title: cat.name,
          subtitle: 'Category',
          page: 'categories'
        });
      });

      // Search users
      const matchedUsers = users.filter(user => 
        user.fullName?.toLowerCase().includes(lowerQuery) ||
        user.email?.toLowerCase().includes(lowerQuery)
      ).slice(0, 3);
      
      matchedUsers.forEach(user => {
        results.push({
          type: 'user',
          id: user.id,
          title: user.fullName,
          subtitle: user.email,
          page: 'users'
        });
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchResultClick = (result) => {
    setActivePage(result.page);
    setSearchQuery("");
    setShowSearchResults(false);
    setIsSidebarOpen(false);
  };

  const getResultIcon = (type) => {
    switch(type) {
      case 'order': return <FaShoppingCart className="me-2" style={{color: 'var(--primary-color)'}} />;
      case 'food': return <FaUtensils className="me-2" style={{color: 'var(--primary-color)'}} />;
      case 'category': return <FaList className="me-2" style={{color: 'var(--primary-color)'}} />;
      case 'user': return <FaUsers className="me-2" style={{color: 'var(--primary-color)'}} />;
      default: return null;
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard onLogout={handleLogout} setActivePage={setActivePage} />;
      case "foods": return <FoodsManagement />;
      case "categories": return <CategoriesManagement />;
      case "users": return <UsersManagement />;
      case "orders": return <OrdersManagement />;
      default: return <Dashboard onLogout={handleLogout} setActivePage={setActivePage} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo-container">
          <div className="logo-icon">
            <img src={logo} alt="FoodCafe Logo" />
          </div>
          <span className="logo-text">FoodCafe</span>
          <button className="sidebar-close-btn d-lg-none" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-nav-section">
          <div className="sidebar-nav-title">Management</div>
          
          <div 
            className={`nav-item-custom ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => navigateTo("dashboard")}
          >
            <div className="nav-item-link">
              <FaTachometerAlt className="nav-item-icon" />
              <span className="nav-item-label">Dashboard</span>
            </div>
            <FaChevronRight style={{fontSize: '0.8rem', opacity: 0.5}} className="d-none d-lg-block" />
          </div>

          <div className="nav-item-custom" onClick={() => toggleMenu('restaurant')}>
            <div className="nav-item-link">
              <FaUtensils className="nav-item-icon" />
              <span className="nav-item-label">Administration</span>
            </div>
            {expandedMenus.restaurant ? <FaChevronDown style={{fontSize: '0.8rem'}} /> : <FaChevronRight style={{fontSize: '0.8rem'}} />}
          </div>
          
          {expandedMenus.restaurant && (
            <div className="ms-4">
              <div 
                className={`nav-item-custom ${activePage === "foods" ? "active" : ""}`}
                onClick={() => navigateTo("foods")}
              >
                <span className="nav-item-label">Menu Items</span>
              </div>
              <div 
                className={`nav-item-custom ${activePage === "orders" ? "active" : ""}`}
                onClick={() => navigateTo("orders")}
              >
                <span className="nav-item-label">Orders</span>
              </div>
              <div 
                className={`nav-item-custom ${activePage === "categories" ? "active" : ""}`}
                onClick={() => navigateTo("categories")}
              >
                <span className="nav-item-label">Categories</span>
              </div>
              <div 
                className={`nav-item-custom ${activePage === "users" ? "active" : ""}`}
                onClick={() => navigateTo("users")}
              >
                <span className="nav-item-label">User Management</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-3 theme-border-top">
          <div 
            className="nav-item-custom text-danger"
            onClick={handleLogout}
          >
            <div className="nav-item-link">
              <FaSignOutAlt className="nav-item-icon" />
              <span className="nav-item-label">Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-wrapper">
        <header className="top-bar">
          <div className="d-flex align-items-center flex-grow-1 gap-3">
            <button className="menu-toggle-btn d-lg-none" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <div className="search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  className="search-bar" 
                  placeholder="Search orders, menu, users..." 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <>
                  <div 
                    className="search-overlay" 
                    onClick={() => setShowSearchResults(false)}
                  />
                  <div className="search-results-dropdown">
                    {searchLoading ? (
                      <div className="search-result-item text-center py-3">
                        <span className="loading-spinner"></span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        {searchResults.map((result, index) => (
                          <div
                            key={`${result.type}-${result.id}-${index}`}
                            className="search-result-item"
                            onClick={() => handleSearchResultClick(result)}
                          >
                            <div className="d-flex align-items-center">
                              {getResultIcon(result.type)}
                              <div>
                                <div className="search-result-title">{result.title}</div>
                                <div className="search-result-subtitle">{result.subtitle}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="search-result-item text-center theme-text-muted">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <button 
            className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center theme-toggle-btn me-2" 
            onClick={toggleTheme}
            style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-light)', border: 'none', color: 'var(--primary-color)' }}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>

          <div className="profile-section">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=FF7D29&color=fff`} alt="Profile" className="profile-img" />
            <div className="profile-info d-none d-sm-flex">
              <span className="profile-name">{adminName}</span>
              <span className="profile-role">Admin</span>
            </div>
            <FaChevronDown className="d-none d-sm-block" style={{fontSize: '0.7rem', marginLeft: '0.5rem', opacity: 0.5}} />
          </div>
        </header>

        <section className="main-content-area flex-grow-1 p-3 p-lg-4 theme-bg-body">
          {renderPage()}
        </section>
      </main>
    </div>
  );
}

export default App;
