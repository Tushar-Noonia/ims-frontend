import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [transactionStatus, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getTransaction = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.getTransactionById(transactionId);

        if (response.status === 200) {
          setTransaction(response.transaction);
          setStatus(
            response.transaction.transactionStatus ||
              response.transaction.status,
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error Getting transaction details: " + error,
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getTransaction();
  }, [transactionId]);

  // Update transaction status
  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await ApiService.updateTransactionStatus(
        transactionId,
        transactionStatus,
      );
      showMessage("Transaction status updated successfully!", "success");
      setTimeout(() => {
        navigate("/transactions");
      }, 1500);
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error updating transaction status: " + error,
        "error",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Method to show message or errors
  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "processing":
        return "warning";
      case "pending":
        return "info";
      case "cancelled":
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

  const handleBackToTransactions = () => {
    navigate("/transactions");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="transaction-details-loading">
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <h2>Loading Transaction Details...</h2>
            <p>Please wait while we fetch the information</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!transaction) {
    return (
      <Layout>
        <div className="transaction-not-found">
          <div className="not-found-content">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h2>Transaction Not Found</h2>
            <p>
              The transaction you're looking for doesn't exist or has been
              removed.
            </p>
            <button onClick={handleBackToTransactions} className="back-btn">
              Back to Transactions
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="elegant-transaction-details">
        {message && (
          <div className={`details-message ${messageType}`}>
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

        {/* Header Section */}
        <div className="transaction-details-header">
          <div className="header-content">
            <button onClick={handleBackToTransactions} className="back-button">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              Back to Transactions
            </button>
            <div className="header-info">
              <h1>Transaction Details</h1>
              <p>
                Transaction ID:{" "}
                <span className="transaction-id">#{transactionId}</span>
              </p>
            </div>
            <div className="header-status">
              <span
                className={`status-badge ${getStatusColor(transaction.transactionStatus)}`}
              >
                {transaction.transactionStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          {/* Transaction Information */}
          <div className="detail-card transaction-info">
            <div className="card-header">
              <div className="card-icon transaction">
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
              <h3>Transaction Information</h3>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Type</label>
                  <span
                    className={`type-badge ${getTypeColor(transaction.transactionType)}`}
                  >
                    {transaction.transactionType}
                  </span>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <span
                    className={`status-badge ${getStatusColor(transaction.transactionStatus)}`}
                  >
                    {transaction.transactionStatus}
                  </span>
                </div>
                <div className="info-item">
                  <label>Total Products</label>
                  <span className="value">{transaction.totalProducts}</span>
                </div>
                <div className="info-item">
                  <label>Total Price</label>
                  <span className="price-value">
                    {formatCurrency(transaction.totalPrice)}
                  </span>
                </div>
                <div className="info-item">
                  <label>Created At</label>
                  <span className="date-value">
                    {formatDate(transaction.createdAt)}
                  </span>
                </div>
                {transaction.updatedAt && (
                  <div className="info-item">
                    <label>Updated At</label>
                    <span className="date-value">
                      {formatDate(transaction.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
              {transaction.description && (
                <div className="description-section">
                  <label>Description</label>
                  <p className="description-text">{transaction.description}</p>
                </div>
              )}
              {transaction.note && (
                <div className="note-section">
                  <label>Note</label>
                  <p className="note-text">{transaction.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          {transaction.product && (
            <div className="detail-card product-info">
              <div className="card-header">
                <div className="card-icon product">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3>Product Information</h3>
              </div>
              <div className="card-content">
                {transaction.product.imageUrl && (
                  <div className="product-image-container">
                    <img
                      src={transaction.product.imageUrl}
                      alt={transaction.product.name}
                      className="product-image"
                    />
                  </div>
                )}
                <div className="info-grid">
                  <div className="info-item">
                    <label>Product Name</label>
                    <span className="product-name">
                      {transaction.product.name}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Price</label>
                    <span className="price-value">
                      {formatCurrency(transaction.product.price)}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Stock Quantity</label>
                    <span className="stock-value">
                      {transaction.product.stockQuantity}
                    </span>
                  </div>
                </div>
                {transaction.product.description && (
                  <div className="description-section">
                    <label>Product Description</label>
                    <p className="description-text">
                      {transaction.product.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Information */}
          {transaction.user && (
            <div className="detail-card user-info">
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
                <h3>User Information</h3>
              </div>
              <div className="card-content">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name</label>
                    <span className="user-name">{transaction.user.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span className="email-value">
                      {transaction.user.email}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <span className="phone-value">
                      {transaction.user.phoneNumber}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Role</label>
                    <span className="role-badge">{transaction.user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Supplier Information */}
          {transaction.supplier && (
            <div className="detail-card supplier-info">
              <div className="card-header">
                <div className="card-icon supplier">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Supplier Information</h3>
              </div>
              <div className="card-content">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Supplier Name</label>
                    <span className="supplier-name">
                      {transaction.supplier.name}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Contact Info</label>
                    <span className="contact-value">
                      {transaction.supplier.contactInfo}
                    </span>
                  </div>
                  <div className="info-item full-width">
                    <label>Address</label>
                    <span className="address-value">
                      {transaction.supplier.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Update Section */}
          <div className="detail-card status-update-card">
            <div className="card-header">
              <div className="card-icon update">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"></path>
                </svg>
              </div>
              <h3>Update Transaction Status</h3>
            </div>
            <div className="card-content">
              <div className="status-update-form">
                <div className="form-group">
                  <label htmlFor="status-select">Current Status</label>
                  <select
                    id="status-select"
                    value={transactionStatus}
                    onChange={(e) => setStatus(e.target.value)}
                    className="status-select"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <button
                  onClick={handleUpdateStatus}
                  disabled={
                    isUpdating ||
                    transactionStatus ===
                      (transaction.transactionStatus || transaction.status)
                  }
                  className={`update-status-btn ${isUpdating ? "loading" : ""}`}
                >
                  {isUpdating ? (
                    <>
                      <div className="btn-spinner"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;
