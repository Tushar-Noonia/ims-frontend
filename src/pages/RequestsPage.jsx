import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/paginationComponent";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const navigate = useNavigate();

  // Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const getRequests = async () => {
      setIsLoading(true);
      try {
        let response;
        let allRequests = [];

        if (ApiService.isAdmin()) {
          response = await ApiService.getAllRequests(valueToSearch);
          if (response.status === 200) {
            allRequests = response.requests;
          }
        } else if (ApiService.isAuthenticated) {
          const user = await ApiService.getCurrentUser();
          const userId = user.id;
          response = await ApiService.getUserRequests(userId);
          if (response.status === 200) {
            allRequests = response.user.requests;
          }
        }

        // Apply status filter
        let filteredRequests = allRequests;
        if (selectedStatus !== "all") {
          filteredRequests = allRequests.filter(
            (r) => r.requestStatus.toLowerCase() === selectedStatus,
          );
        }

        setTotalPages(Math.ceil(filteredRequests.length / itemsPerPage));
        setRequests(
          filteredRequests.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
          ),
        );

        // Calculate stats
        const pending = allRequests.filter(
          (r) => r.requestStatus.toLowerCase() === "pending",
        ).length;
        const approved = allRequests.filter(
          (r) => r.requestStatus.toLowerCase() === "approved",
        ).length;
        const rejected = allRequests.filter(
          (r) => r.requestStatus.toLowerCase() === "rejected",
        ).length;

        setStats({
          total: allRequests.length,
          pending,
          approved,
          rejected,
        });
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting requests: " + error,
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getRequests();
  }, [currentPage, valueToSearch, selectedStatus]);

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const handleAddRequest = () => {
    navigate("/add-request");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  const handleClearFilters = () => {
    setFilter("");
    setValueToSearch("");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  const navigateToRequestDetailsPage = (requestId) => {
    navigate(`/requests/${requestId}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  return (
    <Layout>
      <div className="elegant-requests-page">
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

        {/* Header Section */}
        <div className="requests-hero">
          <div className="hero-content">
            <h1 className="page-title">Request Management</h1>
            <p className="page-subtitle">
              Monitor and manage all inventory requests efficiently
            </p>
          </div>
          <div className="hero-decoration">
            <div className="decoration-element"></div>
            <div className="decoration-element"></div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="requests-stats">
          <div className="stat-item">
            <div className="stat-icon total">
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
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon pending">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon approved">
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
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon rejected">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="requests-controls">
          <div className="search-section">
            <div className="search-input-group">
              <div className="search-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search requests..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="search-input"
              />
              <button onClick={handleSearch} className="search-btn">
                Search
              </button>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <button onClick={handleClearFilters} className="clear-filters-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
              Clear Filters
            </button>
          </div>

          <div className="add-request-section">
            <button onClick={handleAddRequest} className="add-request-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add Request
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="requests-table-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading requests...</p>
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="table-wrapper">
              <table className="elegant-requests-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="request-row">
                      <td className="request-id-cell">
                        <span className="request-id">#{request.id}</span>
                      </td>
                      <td className="description-cell">
                        <div className="description-info">
                          <span className="description-text">
                            {request.description}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusColor(request.requestStatus)}`}
                        >
                          {request.requestStatus}
                        </span>
                      </td>
                      <td className="date-cell">
                        {new Date(request.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            navigateToRequestDetailsPage(request.id)
                          }
                          className="view-details-action-btn"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg
                  width="64"
                  height="64"
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
              <h3>No requests found</h3>
              <p>
                Try adjusting your search criteria or create your first request
              </p>
              <button onClick={handleClearFilters} className="empty-action-btn">
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {requests.length > 0 && (
          <div className="pagination-wrapper">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RequestsPage;
