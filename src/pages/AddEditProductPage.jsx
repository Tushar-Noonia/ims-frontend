import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../services/ApiService";

const AddEditProductPage = () => {
  const { productId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await ApiService.getAllCategories();
        if (categoriesResponse.status === 200) {
          setCategories(categoriesResponse.categories);
        } else {
          showMessage(categoriesResponse.message, "error");
        }

        // If editing, fetch product details
        if (productId) {
          setIsEditing(true);
          const productResponse = await ApiService.getProductById(productId);
          if (productResponse.status === 200) {
            const product = productResponse.product;
            setName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price?.toString() || "");
            setCategoryId(product.categoryId?.toString() || "");
            setImageUrl(product.imageUrl || "");
            setStockQuantity(product.stockQuantity?.toString() || "");
          } else {
            showMessage(productResponse.message, "error");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showMessage(
          error.response?.data?.message ||
            "Failed to fetch data. Please try again.",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Product name is required";
    if (!price || parseFloat(price) <= 0)
      errors.price = "Valid price is required";
    if (!stockQuantity || parseInt(stockQuantity) < 0)
      errors.stockQuantity = "Valid stock quantity is required";
    if (!categoryId) errors.categoryId = "Category selection is required";
    if (!description.trim())
      errors.description = "Product description is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const processImageFile = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showMessage("Please select a valid image file", "error");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showMessage("Image size should be less than 5MB", "error");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImageUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showMessage("Please fix the form errors before submitting", "error");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("price", parseFloat(price));
    formData.append("categoryId", categoryId);
    formData.append("stockQuantity", parseInt(stockQuantity));

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      let response;
      if (isEditing) {
        formData.append("productId", productId);
        response = await ApiService.updateProduct(formData);
      } else {
        response = await ApiService.addProduct(formData);
      }

      if (response.status === 200 || response.status === 201) {
        showMessage(
          `Product ${isEditing ? "updated" : "added"} successfully!`,
          "success",
        );
        setTimeout(() => navigate("/product"), 1500);
      } else {
        showMessage(response.message, "error");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      showMessage(
        error.response?.data?.message ||
          "Failed to submit product. Please try again.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/product");
  };

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="product-form-loading">
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <h2>Loading...</h2>
            <p>Please wait while we fetch the product information</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="elegant-product-form-page">
        {message && (
          <div className={`product-form-message ${messageType}`}>
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
        <div className="product-form-header">
          <div className="header-content">
            <button onClick={handleCancel} className="back-button">
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
              Back to Products
            </button>
            <div className="header-info">
              <h1>{isEditing ? "Edit Product" : "Add New Product"}</h1>
              <p>
                {isEditing
                  ? "Update product information"
                  : "Create a new product for your inventory"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="product-form-container">
          <form onSubmit={handleSubmit} className="elegant-product-form">
            <div className="form-grid">
              {/* Basic Information Section */}
              <div className="form-section basic-info">
                <div className="section-header">
                  <div className="section-icon">
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
                  <h3>Basic Information</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <svg
                        width="20"
                        height="20"
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
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name..."
                      className={`form-input ${formErrors.name ? "error" : ""}`}
                      required
                    />
                  </div>
                  {formErrors.name && (
                    <span className="error-text">{formErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <div className="textarea-wrapper">
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your product..."
                      className={`form-textarea ${formErrors.description ? "error" : ""}`}
                      rows="4"
                      required
                    />
                  </div>
                  {formErrors.description && (
                    <span className="error-text">{formErrors.description}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <div className="select-wrapper">
                    <div className="select-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <select
                      id="category"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className={`form-select ${formErrors.categoryId ? "error" : ""}`}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.categoryId && (
                    <span className="error-text">{formErrors.categoryId}</span>
                  )}
                </div>
              </div>

              {/* Pricing & Inventory Section */}
              <div className="form-section pricing-info">
                <div className="section-header">
                  <div className="section-icon">
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
                  <h3>Pricing & Inventory</h3>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($) *</label>
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`form-input ${formErrors.price ? "error" : ""}`}
                        required
                      />
                    </div>
                    {formErrors.price && (
                      <span className="error-text">{formErrors.price}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="stock">Stock Quantity *</label>
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                          <rect
                            x="8"
                            y="2"
                            width="8"
                            height="4"
                            rx="1"
                            ry="1"
                          ></rect>
                        </svg>
                      </div>
                      <input
                        id="stock"
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        placeholder="0"
                        min="0"
                        className={`form-input ${formErrors.stockQuantity ? "error" : ""}`}
                        required
                      />
                    </div>
                    {formErrors.stockQuantity && (
                      <span className="error-text">
                        {formErrors.stockQuantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="form-section image-section">
                <div className="section-header">
                  <div className="section-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                  </div>
                  <h3>Product Image</h3>
                </div>

                <div className="image-upload-section">
                  {imageUrl ? (
                    <div className="image-preview-container">
                      <img
                        src={imageUrl}
                        alt="Product preview"
                        className="image-preview"
                      />
                      <div className="image-overlay">
                        <button
                          type="button"
                          onClick={removeImage}
                          className="remove-image-btn"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`image-upload-area ${dragActive ? "drag-active" : ""}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="upload-content">
                        <div className="upload-icon">
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                            <circle cx="12" cy="13" r="3"></circle>
                          </svg>
                        </div>
                        <h4>Upload Product Image</h4>
                        <p>Drag and drop your image here, or click to browse</p>
                        <input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="file-input"
                        />
                        <button type="button" className="browse-btn">
                          Browse Files
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
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
                    {isEditing ? "Update Product" : "Add Product"}
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

export default AddEditProductPage;
