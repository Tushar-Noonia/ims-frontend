import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalValue: 0,
  });

  // Requests state
  const [requests, setRequests] = useState([]);
  const [requestStats, setRequestStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const userInfo = await ApiService.getCurrentUser();
        setUser(userInfo);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error loading user data: " + error,
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  // Fetch user transactions
  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (!user?.id) return;
      try {
        const response = await ApiService.getUserTransactions(user.id);
        if (response.status === 200) {
          const allTransactions = response.user.transactions;
          setTransactions(allTransactions.slice(0, 5));

          // Calculate transaction stats
          const totalValue = allTransactions.reduce(
            (sum, t) => sum + (t.totalPrice || 0),
            0,
          );
          const completed = allTransactions.filter(
            (t) => t.transactionStatus.toLowerCase() === "completed",
          ).length;
          const pending = allTransactions.filter(
            (t) => t.transactionStatus.toLowerCase() === "pending",
          ).length;

          setTransactionStats({
            total: allTransactions.length,
            completed,
            pending,
            totalValue,
          });
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error loading transactions: " + error,
          "error",
        );
      }
    };
    fetchUserTransactions();
  }, [user]);

  // Fetch user requests
  useEffect(() => {
    const fetchUserRequests = async () => {
      if (!user?.id) return;
      try {
        const response = await ApiService.getUserRequests(user.id);
        if (response.status === 200) {
          const allRequests = response.user.requests;
          setRequests(allRequests.slice(0, 5));

          // Calculate request stats
          const approved = allRequests.filter(
            (r) => r.requestStatus.toLowerCase() === "approved",
          ).length;
          const pending = allRequests.filter(
            (r) => r.requestStatus.toLowerCase() === "pending",
          ).length;
          const rejected = allRequests.filter(
            (r) => r.requestStatus.toLowerCase() === "rejected",
          ).length;

          setRequestStats({
            total: allRequests.length,
            approved,
            pending,
            rejected,
          });
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error loading requests: " + error,
          "error",
        );
      }
    };
    fetchUserRequests();
  }, [user]);

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // Navigation functions
  const navigateToTransactionDetailsPage = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  const navigateToRequestDetailsPage = (requestId) => {
    navigate(`/requests/${requestId}`);
  };

  const handleViewAllTransactions = () => {
    navigate("/transactions");
  };

  const handleViewAllRequests = () => {
    navigate("/requests");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
      case "rejected":
        return "error";
      default:
        return "neutral";
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "sale":
        return "success";
      case "purchase":
        return "info";
      default:
        return "neutral";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="profile-loading">
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <h2>Loading Profile...</h2>
            <p>Please wait while we fetch your information</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="elegant-profile-page">
        {message && (
          <div className={`elegant-message ${messageType}`}>
            <div className="message-icon">
              {messageType === "success" ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              ) : (
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
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
            </div>
            <span>{message}</span>
          </div>
        )}

        {/* Profile Header Section */}
        <div className="profile-hero">
          <div className="hero-content">
            <div className="user-avatar-section">
              <div className="user-avatar">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="user-welcome">
                <h1 className="page-title">Welcome back, {user?.name}</h1>
                <p className="page-subtitle">
                  Manage your profile and track your activity
                </p>
              </div>
            </div>
          </div>
          <div className="hero-decoration">
            <div className="decoration-element"></div>
            <div className="decoration-element"></div>
          </div>
        </div>

        {/* User Information Card */}
        <div className="profile-info-section">
          <div className="detail-card user-profile-card">
            <div className="card-header">
              <div className="card-icon user">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Profile Information</h3>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <span className="user-name">{user?.name}</span>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <span className="email-value">{user?.email}</span>
                </div>
                <div className="info-item">
                  <label>Phone Number</label>
                  <span className="phone-value">{user?.phoneNumber}</span>
                </div>
                <div className="info-item">
                  <label>Role</label>
                  <span className="role-badge">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Overview Stats */}
        <div className="activity-stats">
          <div className="stat-item">
            <div className="stat-icon transactions">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{transactionStats.total}</div>
              <div className="stat-label">Total Transactions</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon requests">
              <svg
                width="24"
                height="24"
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
            </div>
            <div className="stat-content">
              <div className="stat-value">{requestStats.total}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon completed">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {transactionStats.completed + requestStats.approved}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon value">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M6 12h4m4 0h4m-9-3h6m-6 6h6"></path>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {formatCurrency(transactionStats.totalValue)}
              </div>
              <div className="stat-label">Total Value</div>
            </div>
          </div>
        </div>

        {/* Recent Activity Sections */}
        <div className="activity-sections">
          {/* Recent Transactions */}
              {ApiService.isAdmin() && <div className="activity-card">
                <div className="activity-header">
                  <div className="header-content">
                    <div className="header-icon transactions">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M6 12h4m4 0h4m-9-3h6m-6 6h6"></path>
                      </svg>
                    </div>
                    <h3>Recent Transactions</h3>
                  </div>
                  <button
                    onClick={handleViewAllTransactions}
                    className="view-all-btn"
                  >
                    <span>View All</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </button>
                </div>

                <div className="activity-content">
                  {transactions && transactions.length > 0 ? (
                    <div className="activity-list">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="activity-item"
                          onClick={() =>
                            navigateToTransactionDetailsPage(transaction.id)
                          }
                        >
                          <div className="activity-info">
                            <div className="activity-main">
                              <span
                                className={`type-badge ${getTypeColor(transaction.transactionType)}`}
                              >
                                {transaction.transactionType}
                              </span>
                              <span className="activity-title">
                                {transaction.product?.name || "Transaction"}
                              </span>
                            </div>
                            <div className="activity-meta">
                              <span
                                className={`status-badge ${getStatusColor(transaction.transactionStatus)}`}
                              >
                                {transaction.transactionStatus}
                              </span>
                              <span className="activity-date">
                                {formatDate(transaction.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="activity-value">
                            <span className="value-amount">
                              {formatCurrency(transaction.totalPrice)}
                            </span>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="9,18 15,12 9,6"></polyline>
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <h4>No transactions yet</h4>
                      <p>Your transaction history will appear here</p>
                    </div>
                  )}
                </div>
              </div>}

          {/* Recent Requests */}
          <div className="activity-card">
            <div className="activity-header">
              <div className="header-content">
                <div className="header-icon requests">
                  <svg
                    width="24"
                    height="24"
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
                </div>
                <h3>Recent Requests</h3>
              </div>
              <button onClick={handleViewAllRequests} className="view-all-btn">
                <span>View All</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>

            <div className="activity-content">
              {requests && requests.length > 0 ? (
                <div className="activity-list">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="activity-item"
                      onClick={() => navigateToRequestDetailsPage(request.id)}
                    >
                      <div className="activity-info">
                        <div className="activity-main">
                          <span className="request-id">#{request.id}</span>
                          <span className="activity-title">
                            {request.product?.name || request.description}
                          </span>
                        </div>
                        <div className="activity-meta">
                          <span
                            className={`status-badge ${getStatusColor(request.requestStatus)}`}
                          >
                            {request.requestStatus}
                          </span>
                          <span className="activity-date">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="activity-arrow">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>
                  <h4>No requests yet</h4>
                  <p>Your request history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
