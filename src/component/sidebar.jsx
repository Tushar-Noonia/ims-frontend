import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ApiService from "../services/ApiService";

const logout = () => {
  ApiService.logout();
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
        setIsCollapsed(false);
      } else {
        setIsCollapsed(false); // Always expanded on mobile
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleEscape);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      show: isAdmin,
    },
    {
      path: "/transactions",
      label: "Transactions",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M6 12h4m4 0h4m-9-3h6m-6 6h6"></path>
        </svg>
      ),
      show: isAdmin,
    },
    {
      path: "/category",
      label: "Categories",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      show: isAuthenticated,
    },
    {
      path: "/product",
      label: "Products",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      ),
      show: isAuthenticated,
    },
    {
      path: "/supplier",
      label: "Suppliers",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
        </svg>
      ),
      show: isAdmin,
    },
    {
      path: "/requests",
      label: "Requests",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      show: isAuthenticated,
    },
    {
      path: "/purchase",
      label: "Add To Inventory",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      ),
      show: isAuthenticated,
    },
    {
      path: "/sale",
      label: "Withdraw",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
        </svg>
      ),
      show: isAuthenticated,
    },
  ];

  const bottomNavItems = [
    {
      path: "/user/profile",
      label: "Profile",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      show: isAuthenticated,
    },
    {
      path: "/login",
      label: "Logout",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16,17 21,12 16,7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      ),
      show: isAuthenticated,
      onClick: logout,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`elegant-sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileMenuOpen ? "mobile-open" : ""}`}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <h1 className="app-title">IMS</h1>
                <p className="app-subtitle">Inventory Management</p>
              </div>
            )}
          </div>

          <button
            className="collapse-btn desktop-only"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline
                points={isCollapsed ? "9,18 15,12 9,6" : "15,18 9,12 15,6"}
              ></polyline>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map(
              (item) =>
                item.show && (
                  <li key={item.path} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                      onClick={(e) => {
                        if (item.onClick) item.onClick(e);
                        setIsMobileMenuOpen(false);
                      }}
                      title={isCollapsed ? item.label : ""}
                    >
                      <div className="nav-icon">{item.icon}</div>
                      {!isCollapsed && (
                        <span className="nav-label">{item.label}</span>
                      )}
                      {isActive(item.path) && (
                        <div className="active-indicator"></div>
                      )}
                    </Link>
                  </li>
                ),
            )}
          </ul>
        </nav>

        {/* Footer Navigation */}
        <div className="sidebar-footer">
          <ul className="nav-list">
            {bottomNavItems.map(
              (item) =>
                item.show && (
                  <li key={item.path} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                      onClick={(e) => {
                        if (item.onClick) item.onClick(e);
                        setIsMobileMenuOpen(false);
                      }}
                      title={isCollapsed ? item.label : ""}
                    >
                      <div className="nav-icon">{item.icon}</div>
                      {!isCollapsed && (
                        <span className="nav-label">{item.label}</span>
                      )}
                      {isActive(item.path) && (
                        <div className="active-indicator"></div>
                      )}
                    </Link>
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
