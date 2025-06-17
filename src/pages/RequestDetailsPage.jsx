import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const RequestDetailsPage = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getRequest = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.getRequestById(requestId);
        if (response.status === 200) {
          setRequest(response.request);
          setRequestStatus(
            response.request.status || response.request.requestStatus,
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error getting request: " + error,
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    getRequest();
  }, [requestId]);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await ApiService.updateRequestStatus(requestId, requestStatus);
      showMessage("Request status updated successfully!", "success");
      setTimeout(() => {
        navigate("/requests");
      }, 1500);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error updating request: " + error,
        "error",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
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
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "neutral";
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "purchase":
        return "info";
      case "sale":
        return "success";
      case "return":
        return "warning";
      default:
        return "neutral";
    }
  };

  const handleBackToRequests = () => {
    navigate("/requests");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="request-details-loading">
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <h2>Loading Request Details...</h2>
            <p>Please wait while we fetch the information</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <div className="request-not-found">
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
            <h2>Request Not Found</h2>
            <p>
              The request you're looking for doesn't exist or has been removed.
            </p>
            <button onClick={handleBackToRequests} className="back-btn">
              Back to Requests
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="elegant-request-details">
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
        <div className="request-details-header">
          <div className="header-content">
            <button onClick={handleBackToRequests} className="back-button">
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
              Back to Requests
            </button>
            <div className="header-info">
              <h1>Request Details</h1>
              <p>
                Request ID: <span className="request-id">#{requestId}</span>
              </p>
            </div>
            <div className="header-status">
              <span
                className={`status-badge ${getStatusColor(request.requestStatus)}`}
              >
                {request.requestStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          {/* Request Information */}
          <div className="detail-card request-info">
            <div className="card-header">
              <div className="card-icon request">
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
              <h3>Request Information</h3>
            </div>
            <div className="card-content">
              <div className="info-grid">
                {request.requestType && (
                  <div className="info-item">
                    <label>Type</label>
                    <span
                      className={`type-badge ${getTypeColor(request.requestType)}`}
                    >
                      {request.requestType}
                    </span>
                  </div>
                )}
                <div className="info-item">
                  <label>Status</label>
                  <span
                    className={`status-badge ${getStatusColor(request.requestStatus)}`}
                  >
                    {request.requestStatus}
                  </span>
                </div>
                {request.totalProducts && (
                  <div className="info-item">
                    <label>Total Products</label>
                    <span className="value">{request.totalProducts}</span>
                  </div>
                )}
                {request.totalPrice && (
                  <div className="info-item">
                    <label>Total Price</label>
                    <span className="price-value">
                      {formatCurrency(request.totalPrice)}
                    </span>
                  </div>
                )}
                <div className="info-item">
                  <label>Created At</label>
                  <span className="date-value">
                    {formatDate(request.createdAt)}
                  </span>
                </div>
                {request.updatedAt && (
                  <div className="info-item">
                    <label>Updated At</label>
                    <span className="date-value">
                      {formatDate(request.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
              {request.description && (
                <div className="description-section">
                  <label>Description</label>
                  <p className="description-text">{request.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          {request.product && (
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
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <h3>Product Information</h3>
              </div>
              <div className="card-content">
                {request.product.imageUrl && (
                  <div className="product-image-container">
                    <img
                      src={request.product.imageUrl}
                      alt={request.product.name}
                      className="product-image"
                    />
                  </div>
                )}
                <div className="info-grid">
                  <div className="info-item full-width">
                    <label>Product Name</label>
                    <span className="product-name">{request.product.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Price</label>
                    <span className="price-value">
                      {formatCurrency(request.product.price)}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Stock Quantity</label>
                    <span className="stock-value">
                      {request.product.stockQuantity}
                    </span>
                  </div>
                </div>
                {request.product.description && (
                  <div className="description-section">
                    <label>Product Description</label>
                    <p className="description-text">
                      {request.product.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Information */}
          {request.user && (
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
                  <div className="info-item full-width">
                    <label>Name</label>
                    <span className="user-name">{request.user.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span className="email-value">{request.user.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <span className="phone-value">
                      {request.user.phoneNumber}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Role</label>
                    <span className="role-badge">{request.user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Supplier Information */}
          {request.supplier && (
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
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <h3>Supplier Information</h3>
              </div>
              <div className="card-content">
                <div className="info-grid">
                  <div className="info-item full-width">
                    <label>Supplier Name</label>
                    <span className="supplier-name">
                      {request.supplier.name}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Contact Info</label>
                    <span className="contact-value">
                      {request.supplier.contactInfo}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Address</label>
                    <span className="address-value">
                      {request.supplier.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Update Section */}
          {ApiService.isAdmin() && (
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
                    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
                    <polyline points="17,6 23,6 23,12"></polyline>
                  </svg>
                </div>
                <h3>Update Request Status</h3>
              </div>
              <div className="card-content">
                <div className="status-update-form">
                  <div className="form-group">
                    <label>Change Status</label>
                    <select
                      value={requestStatus}
                      onChange={(e) => setRequestStatus(e.target.value)}
                      className="status-select"
                      disabled={isUpdating}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating}
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RequestDetailsPage;
