import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditSupplierPage = () => {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const { supplierId } = useParams();

  useEffect(() => {
  if (supplierId) {
    setIsEditing(true);
    // Fetch supplier details for editing
    ApiService.getSupplierById(supplierId).then((data) => {
      const supplier = data.supplier || {};
      setName(supplier.name || "");
      setContactInfo(supplier.contactInfo || "");
      setAddress(supplier.address || "");
    });
  }
}, [supplierId]);

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Supplier name is required.";
    if (!contactInfo.trim()) errors.contactInfo = "Contact info is required.";
    if (!address.trim()) errors.address = "Address is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const supplierData = { name, contactInfo, address };
      let response;
      if (isEditing) {
        response = await ApiService.updateSupplier(supplierId, supplierData);
      } else {     
        response = await ApiService.createSupplier(supplierData);
      }
      if (response.status === 200) {
        setMessageType("success");
        setMessage(isEditing ? "Supplier updated successfully." : "Supplier added successfully.");
        setTimeout(() => navigate("/supplier"), 1200);
      } else {
        setMessageType("error");
        setMessage(response.message || "Something went wrong.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to save supplier.");
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    navigate("/supplier");
  };

  return (
    <Layout>
      <div className="elegant-product-form-page">
        {message && (
          <div className={`product-form-message ${messageType}`}>
            <div className="message-icon">
              {messageType === "success" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
            </div>
            <span>{message}</span>
          </div>
        )}

        <div className="product-form-header">
          <div className="header-content">
            <button onClick={handleCancel} className="back-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              Back to Suppliers
            </button>
            <div className="header-info">
              <h1>{isEditing ? "Edit Supplier" : "Add New Supplier"}</h1>
              <p>
                {isEditing
                  ? "Update supplier information"
                  : "Add a new supplier to your system"}
              </p>
            </div>
          </div>
        </div>

        <div className="product-form-container">
          <form onSubmit={handleSubmit} className="elegant-product-form">
            <div className="form-grid">
              <div className="form-section basic-info">
                <div className="section-header">
                  <div className="section-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10V7a2 2 0 0 0-2-2h-3"></path>
                      <path d="M3 7v3a2 2 0 0 0 2 2h3"></path>
                      <rect x="7" y="7" width="10" height="10" rx="2"></rect>
                    </svg>
                  </div>
                  <h3>Supplier Information</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Supplier Name *</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path>
                        <path d="M4.22 19.78C5.47 18.53 7.11 18 9 18s3.53.53 4.78 1.78"></path>
                      </svg>
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter supplier name..."
                      className={`form-input ${formErrors.name ? "error" : ""}`}
                      required
                    />
                  </div>
                  {formErrors.name && (
                    <span className="error-text">{formErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="contactInfo">Contact Info *</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <input
                      id="contactInfo"
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Enter contact info (email or phone)..."
                      className={`form-input ${formErrors.contactInfo ? "error" : ""}`}
                      required
                    />
                  </div>
                  {formErrors.contactInfo && (
                    <span className="error-text">{formErrors.contactInfo}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <div className="textarea-wrapper">
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter supplier address..."
                      className={`form-textarea ${formErrors.address ? "error" : ""}`}
                      rows="3"
                      required
                    />
                  </div>
                  {formErrors.address && (
                    <span className="error-text">{formErrors.address}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`submit-btn ${isSubmitting ? "loading" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    {isEditing ? "Update Supplier" : "Add Supplier"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddEditSupplierPage;