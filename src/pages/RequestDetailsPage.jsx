import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const RequestDetailsPage = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [message, setMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await ApiService.getRequestById(requestId);
        if (response.status === 200) {
          setRequest(response.request);
          setRequestStatus(response.request.status || response.request.requestStatus);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error getting request: " + error
        );
      }
    };
    getRequest();
  }, [requestId]);

  // Update request status
  const handleUpdateStatus = async () => {
    try {
      await ApiService.updateRequestStatus(requestId, requestStatus);
      navigate("/requests");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error updating request: " + error
      );
    }
  };

  // Show message
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <p className="message">{message}</p>}
      <div className="transaction-details-page">
        {request && (
          <>
            {/* Request base information */}
            <div className="section-card">
              <h2>Request Information</h2>
              <p>Type: {request.requestType}</p>
              <p>Status: {request.requestStatus}</p>
              <p>Description: {request.description}</p>
              <p>Total Products: {request.totalProducts}</p>
              <p>Total Price: {request.totalPrice && request.totalPrice.toFixed ? request.totalPrice.toFixed(2) : request.totalPrice}</p>
              <p>Created At: {new Date(request.createdAt).toLocaleString()}</p>
              {request.updatedAt && (
                <p>Updated At: {new Date(request.updatedAt).toLocaleString()}</p>
              )}
            </div>

            {/* Product information */}
            {request.product && (
              <div className="section-card">
                <h2>Product Information</h2>
                <p>Name: {request.product.name}</p>
                <p>SKU: {request.product.sku}</p>
                <p>Price: {request.product.price && request.product.price.toFixed ? request.product.price.toFixed(2) : request.product.price}</p>
                <p>Stock Quantity: {request.product.stockQuantity}</p>
                <p>Description: {request.product.description}</p>
                {request.product.imageUrl && (
                  <img src={request.product.imageUrl} alt={request.product.name} />
                )}
              </div>
            )}

            {/* User information */}
            {request.user && (
              <div className="section-card">
                <h2>User Information</h2>
                <p>Name: {request.user.name}</p>
                <p>Email: {request.user.email}</p>
                <p>Phone Number: {request.user.phoneNumber}</p>
                <p>Role: {request.user.role}</p>
              </div>
            )}

            {/* Supplier information */}
            {request.supplier && (
              <div className="section-card">
                <h2>Supplier Information</h2>
                <p>Name: {request.supplier.name}</p>
                <p>Contact Address: {request.supplier.contactInfo}</p>
                <p>Address: {request.supplier.address}</p>
              </div>
            )}

            {/* Update request status */}
            <div className="section-card transaction-status-update">
              <label>Status: </label>
              <select
                value={requestStatus}
                onChange={(e) => setRequestStatus(e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
              {ApiService.isAdmin() &&
                <button onClick={handleUpdateStatus}>Update Status</button> 
              }

            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default RequestDetailsPage;