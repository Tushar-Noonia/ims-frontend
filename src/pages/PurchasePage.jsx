import React, { useState, useEffect, useRef } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";

const PurchasePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productId, setProductId] = useState("");
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [productPrice, setProductPrice] = useState("");
  const productSearchRef = useRef(null);

  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
  const supplierSearchRef = useRef(null);

  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedProduct = products.find((p) => p.id === productId);

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const productResponse = await ApiService.getAllProducts();
        const supplierResponse = await ApiService.getAllSuppliers();
        if (productResponse.status === 200 && supplierResponse.status === 200) {
          setProducts(productResponse.products);
          setFilteredProducts(productResponse.products);
          setSuppliers(supplierResponse.suppliers);
          setFilteredSuppliers(supplierResponse.suppliers);
        }
      } catch (error) {
        console.error("Error fetching products or suppliers:", error);
        showMessage(
          error.response?.data?.message ||
            "Failed to fetch data. Please try again.",
          "error",
        );
      }
    };
    fetchProductsAndSuppliers();
  }, []);

  useEffect(() => {
    if (selectedProduct && selectedProduct.price !== undefined && selectedProduct.price !== null) {
      setProductPrice(selectedProduct.price);
    } else {
      setProductPrice("");
    }
  }, [selectedProduct]);

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

  // Filter suppliers as user types
  useEffect(() => {
    if (supplierSearch.trim() === "") {
      setFilteredSuppliers(suppliers);
    } else {
      setFilteredSuppliers(
        suppliers.filter((supplier) =>
          supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()),
        ),
      );
    }
  }, [supplierSearch, suppliers]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        productSearchRef.current &&
        !productSearchRef.current.contains(event.target)
      ) {
        setProductDropdownOpen(false);
      }
      if (
        supplierSearchRef.current &&
        !supplierSearchRef.current.contains(event.target)
      ) {
        setSupplierDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductSelect = (product) => {
    setProductId(product.id);
    setProductSearch(product.name);
    setProductDropdownOpen(false);
  };

  const handleSupplierSelect = (supplier) => {
    setSupplierId(supplier.id);
    setSupplierSearch(supplier.name);
    setSupplierDropdownOpen(false);
  };

  const handleProductSearchFocus = () => {
    setProductDropdownOpen(true);
  };

  const handleSupplierSearchFocus = () => {
    setSupplierDropdownOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !supplierId || !quantity) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    setIsLoading(true);
    const body = {
      productId,
      quantity: parseInt(quantity), 
      supplierId,
      description,
    };

    try {
      const formData=new FormData();
      formData.append("productId",productId);
      formData.append("price",productPrice);
      const priceUpdateRes = await ApiService.updateProduct(formData) ;
      if (priceUpdateRes.status !== 200) {
        showMessage("Failed to update product price.", "error");
        setIsLoading(false);
        return;
      }


      const response = await ApiService.purchaseTransaction(body);
      if (response.status === 200) {
        showMessage("Added to inventory successfully.", "success");
        resetForm();
      } else {
        showMessage("Failed to submit purchase. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error submitting purchase:", error);
      showMessage(
        error.response?.data?.message ||
          "Failed to submit purchase. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setProductId("");
    setProductSearch("");
    setSupplierId("");
    setSupplierSearch("");
    setDescription("");
    setQuantity("");
    setFilteredProducts(products);
    setFilteredSuppliers(suppliers);
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
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
              </div>
              <h1 className="welcome-title">Add to Inventory</h1>
              <p className="welcome-subtitle">
                Purchase products to increase inventory stock levels
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
                <div className="input-group" ref={productSearchRef}>
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
                        setProductDropdownOpen(true);
                      }}
                      onFocus={handleProductSearchFocus}
                      placeholder="Type product name..."
                      autoComplete="off"
                    />
                  </div>
                  {productDropdownOpen && filteredProducts.length > 0 && (
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
                              Stock: {product.stockQuantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>


                {selectedProduct && (
                  <div className="input-group">
                    <label className="input-label">Product Price</label>
                    <div className="input-wrapper">
                      <div className="input-icon">
                        {/* Indian Rupee Symbol */}
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <text x="2" y="17" fontSize="16" fontFamily="Arial">&#8377;</text>
                        </svg>
                      </div>
                      <input
                        className="auth-input"
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="Product price"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Supplier Selection */}
                <div className="input-group" ref={supplierSearchRef}>
                  <label className="input-label">Select Supplier</label>
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
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                      </svg>
                    </div>
                    <input
                      className="auth-input"
                      type="text"
                      value={supplierSearch}
                      onChange={(e) => {
                        setSupplierSearch(e.target.value);
                        setSupplierId("");
                        setSupplierDropdownOpen(true);
                      }}
                      onFocus={handleSupplierSearchFocus}
                      placeholder="Type supplier name..."
                      autoComplete="off"
                    />
                  </div>
                  {supplierDropdownOpen && filteredSuppliers.length > 0 && (
                    <div className="inventory-dropdown">
                      {filteredSuppliers.map((supplier) => (
                        <div
                          key={supplier.id}
                          className={`dropdown-item ${supplierId === supplier.id ? "selected" : ""}`}
                          onMouseDown={() => handleSupplierSelect(supplier)}
                        >
                          <div className="supplier-info">
                            <span className="supplier-name">
                              {supplier.name}
                            </span>
                            <span className="supplier-contact">
                              {supplier.contactInfo}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity Input */}
                <div className="input-group">
                  <label className="input-label">Quantity to Add</label>
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
                        <line x1="9" y1="9" x2="15" y2="15"></line>
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
                  <div className="textarea-wrapper">
                    <textarea
                      className="inventory-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter purchase description..."
                      rows={4}
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
                      Adding to Inventory...
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
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                      Add to Inventory
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

export default PurchasePage;
