import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/paginationComponent";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TransactionsTablePDF from "../component/transactionsTablePDF";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalValue: 0,
  });

  const navigate = useNavigate();

  // Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const getTransactions = async () => {
      setIsLoading(true);
      try {
        let response;
        let filteredTransactions = [];

        // If both dates are selected, use getTransactionsBetweenDates
        if (startDate && endDate) {
          response = await ApiService.getTransactionsBetweenDates(startDate, endDate);
          if (response.status === 200) {
            filteredTransactions = response.transactions;
          }
        } else {
          // Otherwise, fetch all and filter as before
          response = await ApiService.getAllTransactions(valueToSearch);
          if (response.status === 200) {
            filteredTransactions = response.transactions;
          }
        }

        // Apply filters
        if (selectedStatus !== "all") {
          filteredTransactions = filteredTransactions.filter(
            (t) => t.transactionStatus.toLowerCase() === selectedStatus,
          );
        }
        if (selectedType !== "all") {
          filteredTransactions = filteredTransactions.filter(
            (t) => t.transactionType.toLowerCase() === selectedType,
          );
        }

        setTotalPages(Math.ceil(filteredTransactions.length / itemsPerPage));
        setTransactions(
          filteredTransactions.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
          ),
        );

        // Calculate stats
        const totalValue = filteredTransactions
        .filter((t)=>t.transactionType.toLowerCase()==="stock_acquisition")
        .reduce(
          (sum, t) => sum + (t.totalPrice || 0),
          0,
        );
        const completed = filteredTransactions.filter(
          (t) => t.transactionStatus.toLowerCase() === "completed",
        ).length;
        const pending = filteredTransactions.filter(
          (t) => t.transactionStatus.toLowerCase() === "pending",
        ).length;

        setStats({
          total: filteredTransactions.length,
          completed,
          pending,
          totalValue,
        });
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error Getting transactions: " + error,
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getTransactions();
  }, [
    currentPage,
    valueToSearch,
    selectedStatus,
    selectedType,
    startDate,
    endDate,
  ]);

  // Method to show message or errors
  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilter("");
    setValueToSearch("");
    setSelectedStatus("all");
    setSelectedType("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Navigate to transactions details page
  const navigateToTransactionDetailsPage = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "neutral";
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "withdrawal":
        return "success";
      case "stock_acquisition":
        return "info";
      default:
        return "neutral";
    }
  };

  return (
    <Layout>
      <div className="elegant-transactions-page">
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
        <div className="transactions-hero">
          <div className="hero-content">
            <h1 className="page-title">Transaction Management</h1>
            <p className="page-subtitle">
              Monitor and manage all your inventory transactions
            </p>
          </div>
          <div className="hero-decoration">
            <div className="decoration-element"></div>
            <div className="decoration-element"></div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="transactions-stats">
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
              <div className="stat-label">Total Transactions</div>
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
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
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
                {formatCurrency(stats.totalValue)}
              </div>
              <div className="stat-label">Total Value</div>
            </div>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="transactions-controls">
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
                  <path
                      d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
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
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="stock_acquisition">Stock_Acquisition</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div className="filter-group filter-date-group">
              <label htmlFor="start-date-input" className="filter-label">Start Date:</label>
              <input
                id="start-date-input"
                type="datetime-local"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                className="filter-date-input"
                autoComplete="off"
              />
            </div>
            {/* End Date Filter */}
            <div className="filter-group filter-date-group">
              <label htmlFor="end-date-input" className="filter-label">End Date:</label>
              <input
                id="end-date-input"
                type="datetime-local"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                className="filter-date-input"
                autoComplete="off"
              />
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
            <PDFDownloadLink
              document={<TransactionsTablePDF transactions={transactions || []} />}
              fileName="transactions.pdf"
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                color: "#fff",
                background: "#008080",
                borderRadius: 4,
                marginBottom: 16,
                display: "inline-block"
              }}
            >
              {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
            </PDFDownloadLink>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="transactions-table-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="table-wrapper">
              <table className="elegant-transactions-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Product</th>
                    <th>Total Price</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="transaction-row">
                      <td>
                        <span
                          className={`type-badge ${getTypeColor(transaction.transactionType)}`}
                        >
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusColor(transaction.transactionStatus)}`}
                        >
                          {transaction.transactionStatus}
                        </span>
                      </td>
                      <td className="product-cell">
                        <div className="product-info">
                          <span className="product-name">
                            {transaction.product.name}
                          </span>
                        </div>
                      </td>
                      <td className="price-cell">
                        {formatCurrency(transaction.totalPrice)}
                      </td>
                      <td className="date-cell">
                        {new Date(transaction.createdAt).toLocaleDateString(
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
                            navigateToTransactionDetailsPage(transaction.id)
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>No transactions found</h3>
              <p>
                Try adjusting your search criteria or create your first
                transaction
              </p>
              <button onClick={handleClearFilters} className="empty-action-btn">
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {transactions.length > 0 && (
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

export default TransactionsPage;