import React, { useState, useEffect, useRef } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";

const SellPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await ApiService.getAllProducts();
        if (productResponse.status === 200) {
          setProducts(productResponse.products);
          setFilteredProducts(productResponse.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        showMessage(
          error.response?.data?.message ||
            "Failed to fetch products. Please try again.",
          "error",
        );
      }
    };
    fetchProducts();
  }, []);

  // Filter products as user types
  useEffect(() => {
    if (productSearch.trim() === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(productSearch.toLowerCase()),
        ),
      );
    }
  }, [productSearch, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductSelect = (product) => {
    setProductId(product.id);
    setProductSearch(product.name);
    setDropdownOpen(false);
  };

  const handleSearchFocus = () => {
    setDropdownOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !quantity) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    setIsLoading(true);
    const body = {
      productId,
      quantity: parseInt(quantity),
      description,
    };

    try {
      const response = await ApiService.saleTransaction(body);
      if (response.status === 200) {
        showMessage("Withdraw submitted successfully.", "success");
        resetForm();
      } else {
        showMessage("Failed to submit withdraw. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error submitting withdraw:", error);
      showMessage(
        error.response?.data?.message ||
          "Failed to submit withdraw. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProductId("");
    setDescription("");
    setQuantity("");
    setProductSearch("");
    setFilteredProducts(products);
  };

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-background">
          <div className="auth-card">
            {/* Header Section */}
            <div className="auth-header">
              <div className="logo-section">
                <div className="logo">
                  <svg
                    width="32"
                    height="32"
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
              </div>
              <h1 className="welcome-title">Withdraw from Inventory</h1>
              <p className="welcome-subtitle">
                Remove products from inventory stock levels
              </p>
            </div>

            {/* Message Card */}
            {message && (
              <div className={`message-card ${messageType}`}>
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

            {/* Content Section */}
            <div className="auth-content">
              <form onSubmit={handleSubmit} className="auth-form">
                {/* Product Selection */}
                <div className="input-group" ref={searchRef}>
                  <label className="input-label">Select Product</label>
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
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                    </div>
                    <input
                      className="auth-input"
                      type="text"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setProductId("");
                        setDropdownOpen(true);
                      }}
                      onFocus={handleSearchFocus}
                      placeholder="Type product name..."
                      autoComplete="off"
                    />
                  </div>
                  {dropdownOpen && filteredProducts.length > 0 && (
                    <div className="inventory-dropdown">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className={`dropdown-item ${productId === product.id ? "selected" : ""}`}
                          onMouseDown={() => handleProductSelect(product)}
                        >
                          <div className="product-info">
                            <span className="product-name">{product.name}</span>
                            <span className="product-stock">
                              Available: {product.stockQuantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity Input */}
                <div className="input-group">
                  <label className="input-label">Quantity to Withdraw</label>
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
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                      </svg>
                    </div>
                    <input
                      className="auth-input"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity..."
                      required
                      min="1"
                    />
                  </div>
                </div>

                {/* Description Input */}
                <div className="input-group">
                  <label className="input-label">Description (Optional)</label>
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
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                    </div>
                    <input
                      className="auth-input"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Reason for withdrawal..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`auth-submit-btn ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Processing Withdrawal...
                    </>
                  ) : (
                    <>
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
                      </svg>
                      Withdraw Product
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellPage;
