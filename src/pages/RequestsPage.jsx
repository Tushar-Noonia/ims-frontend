import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/paginationComponent";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");

  const navigate = useNavigate();

  // Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const getRequests = async () => {
      try {
        let response;
        if(ApiService.isAdmin())
        {
            response = await ApiService.getAllRequests(valueToSearch);
            if (response.status === 200) {
              setTotalPages(Math.ceil(response.requests.length / itemsPerPage));
              setRequests(
                response.requests.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
              );
            }
        }
        else if(ApiService.isAuthenticated)
        {
            const user= await ApiService.getCurrentUser();
            const userId=user.id;
            response=await ApiService.getUserRequests(userId);
            if (response.status === 200) {
              setTotalPages(Math.ceil(response.user.requests.length / itemsPerPage));
              setRequests(
                response.user.requests.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
              );
            }
        }
        
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting requests: " + error
        );
      }
    };

    getRequests();
  }, [currentPage, valueToSearch]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleAddRequest = () => {
    navigate("/add-request");
  };

  // handle search
  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  // Navigate to request details page (implement if you have a details page)
  const navigateToRequestDetailsPage = (requestId) => {
    navigate(`/requests/${requestId}`);
  };

  return (
    <Layout>
      {message && <p className="message">{message}</p>}
      <div className="transactions-page">
        <div className="transactions-header">
          <h1>Requests</h1>
        </div>
        <div className="transaction-search">
          <input
            placeholder="Search request ..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            type="text"
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div style={{ marginBottom: "1rem", marginTop:"1rem" }}>
          <button onClick={handleAddRequest}>Add Request</button>
        </div>

        {requests && (
          <table className="transactions-table">
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
                <tr key={request.id}>
                  <td>{request.id}</td>
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
        )}

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
};

export default RequestsPage;