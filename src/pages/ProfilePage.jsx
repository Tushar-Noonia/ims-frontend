import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  // Transactions state
  const [transactions, setTransactions] = useState([]);

  // Requests state
  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await ApiService.getCurrentUser();
        setUser(userInfo);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Loggin in a User: " + error
        );
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
          // Show only first 5 transactions
          setTransactions(response.user.transactions.slice(0, 5));
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting user transactions: " + error
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
          // Show only first 5 requests
          setRequests(response.user.requests.slice(0, 5));
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting user requests: " + error
        );
      }
    };
    fetchUserRequests();
  }, [user]);

  // Show message
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  // Navigation
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

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="profile-page">
        {user && (
          <div className="profile-card">
            <h1>Hello, {user.name}</h1>
            <div className="profile-info">
              <div className="profile-item">
                <label>Name</label>
                <span>{user.name}</span>
              </div>
              <div className="profile-item">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className="profile-item">
                <label>Phone Number</label>
                <span>{user.phoneNumber}</span>
              </div>
              <div className="profile-item">
                <label>Role</label>
                <span>{user.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Transactions Section */}
      <div className="profile-section-card">
        <div className="transactions-header">
          <h2>Your Transactions</h2>
        </div>
        {transactions && transactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>TYPE</th>
                <th>STATUS</th>
                <th>TOTAL PRICE</th>
                <th>TOTAL PRODUCTS</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.transactionStatus}</td>
                  <td>{transaction.totalPrice}</td>
                  <td>{transaction.totalProducts}</td>
                  <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => navigateToTransactionDetailsPage(transaction.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No transactions found.</p>
        )}
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button onClick={handleViewAllTransactions}>View All Transactions</button>
        </div>
      </div>

      {/* User Requests Section */}
      <div className="profile-section-card">
        <div className="transactions-header">
          <h2>Your Requests</h2>
        </div>
        {requests && requests.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.product?.name || "-"}</td>
                  <td>{request.description}</td>
                  <td>{request.requestStatus}</td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => navigateToRequestDetailsPage(request.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No requests found.</p>
        )}
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button onClick={handleViewAllRequests}>View All Requests</button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;