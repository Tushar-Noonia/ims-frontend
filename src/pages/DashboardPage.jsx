import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,

  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedData, setSelectedData] = useState("amount");
  const [transactionData, setTransactionData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    pendingRequests: 0,
    totalProducts: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionResponse = await ApiService.getAllTransactions();
        if (transactionResponse.status === 200) {
          const allTransactions = transactionResponse.transactions;
          setTransactionData(
            transformTransactionData(
              allTransactions,
              selectedMonth,
              selectedYear,
            ),
          );
          setTransactions(allTransactions.slice(0, 5));

          // Calculate stats
          const totalRevenue = allTransactions.reduce(
            (sum, t) => sum + (t.totalPrice || 0),
            0,
          );
          setStats((prev) => ({
            ...prev,
            totalTransactions: allTransactions.length,
            totalRevenue: totalRevenue,
          }));
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Failed to fetch transaction data. Please try again.",
        );
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear, selectedData]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await ApiService.getAllRequests();
        if (response.status === 200) {
          const allRequests = response.requests;
          setRequests(allRequests.slice(0, 5));
          setStats((prev) => ({
            ...prev,
            pendingRequests: allRequests.length,
          }));
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Failed to fetch requests. Please try again.",
        );
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ApiService.getAllProducts();
        if (response.status === 200) {
          setStats((prev) => ({
            ...prev,
            totalProducts: response.products.length,
          }));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const transformTransactionData = (transactions, month, year) => {
    const dailyData = {};
    const daysInMonths = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonths; day++) {
      dailyData[day] = { day, count: 0, amount: 0, quantity: 0 };
    }
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();
      if (transactionMonth === month && transactionYear === year) {
        const day = transactionDate.getDate();
        dailyData[day].count += 1;
        dailyData[day].amount += transaction.totalPrice;
        dailyData[day].quantity += transaction.totalProducts;
      }
    });
    return Object.values(dailyData);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const handleViewAllTransactions = () => {
    navigate("/transactions");
  };

  const handleViewAllRequests = () => {
    navigate("/requests");
  };

  const navigateToTransactionDetailsPage = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  const navigateToRequestDetailsPage = (requestId) => {
    navigate(`/requests/${requestId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Layout>
      <div className="elegant-dashboard">
        {message && (
          <div className="dashboard-message">
            <div className="message-content">
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
              {message}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1 className="hero-title">Dashboard Overview</h1>
            <p className="hero-subtitle">
              Welcome back! Here's what's happening with your inventory today.
            </p>
          </div>
          <div className="hero-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card revenue">
            <div className="stat-icon">
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
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="stat-label">Total Transaction Ammount</div>
            </div>
            <div className="stat-trend positive">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
          </div>

          <div className="stat-card transactions" onClick={()=>navigate("/transactions")}>
            <div className="stat-icon">
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
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalTransactions}</div>
              <div className="stat-label">Total Transactions</div>
            </div>
            <div className="stat-trend positive">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
          </div>

          <div className="stat-card products" onClick={()=>navigate("/product")}>
            <div className="stat-icon">
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
            <div className="stat-content">
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-label">Total Products</div>
            </div>
            <div className="stat-trend neutral">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </div>

          <div className="stat-card requests" onClick={()=>navigate("/requests")}>
            <div className="stat-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pendingRequests}</div>
              <div className="stat-label">Pending Requests</div>
            </div>
            <div className="stat-trend warning">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">Analytics Overview</h2>
            <div className="filter-controls">
              <div className="filter-group">
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3>Transaction Trends</h3>
              <div className="chart-filter-buttons">
                <button
                  className={`chart-filter-btn ${selectedData === "count" ? "active" : ""}`}
                  onClick={() => setSelectedData("count")}
                >
                  Count
                </button>
                <button
                  className={`chart-filter-btn ${selectedData === "amount" ? "active" : ""}`}
                  onClick={() => setSelectedData("amount")}
                >
                  Amount
                </button>
                <button
                  className={`chart-filter-btn ${selectedData === "quantity" ? "active" : ""}`}
                  onClick={() => setSelectedData("quantity")}
                >
                  Quantity
                </button>
              </div>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedData}
                    stroke="url(#colorGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#008080", strokeWidth: 0, r: 5 }}
                    activeDot={{
                      r: 7,
                      fill: "#008080",
                      strokeWidth: 3,
                      stroke: "white",
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#008080" />
                      <stop offset="100%" stopColor="#20b2aa" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Tables Section */}
        <div className="tables-grid">
          {/* Recent Transactions */}
          <div className="elegant-table-section">
            <div className="table-section-header">
              <h3>Recent Transactions</h3>
              <button
                className="view-all-link"
                onClick={handleViewAllTransactions}
              >
                View All
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
            {transactions && transactions.length > 0 ? (
              <div className="elegant-table-wrapper">
                <table className="elegant-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Product</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="table-row">
                        <td>
                          <span
                            className={`transaction-badge ${transaction.transactionType.toLowerCase()}`}
                          >
                            {transaction.transactionType}
                          </span>
                        </td>
                        <td className="product-cell">
                          {transaction.product.name}
                        </td>
                        <td>
                          <button
                            className="action-btn"
                            onClick={() =>
                              navigateToTransactionDetailsPage(transaction.id)
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data-elegant">
                <svg
                  width="48"
                  height="48"
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
                <p>No transactions found</p>
              </div>
            )}
          </div>

          {/* Recent Requests */}
          <div className="elegant-table-section">
            <div className="table-section-header">
              <h3>Recent Requests</h3>
              <button className="view-all-link" onClick={handleViewAllRequests}>
                View All
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
            {requests && requests.length > 0 ? (
              <div className="elegant-table-wrapper">
                <table className="elegant-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id} className="table-row">
                        <td>
                          <span className="request-id">#{request.id}</span>
                        </td>
                        <td className="product-cell">{request.product.name}</td>
                        <td className="date-cell">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="action-btn"
                            onClick={() =>
                              navigateToRequestDetailsPage(request.id)
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data-elegant">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                </svg>
                <p>No requests found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
