import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import PaginationComponent from "../component/paginationComponent";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // For search filtering
  const [message, setMessage] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await ApiService.getAllProducts();
        if (response.status === 200) {
          setAllProducts(response.products);
          setTotalPages(Math.ceil(response.products.length / itemsPerPage));
          setProducts(
            response.products.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage,
            ),
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        showMessage(
          error.response?.data?.message ||
            "Failed to fetch products. Please try again.",
        );
      }
    };
    getProducts();
  }, [currentPage]);

  // Update products when page or search changes
  useEffect(() => {
    let filtered = allProducts;
    if (valueToSearch.trim() !== "") {
      filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(valueToSearch.toLowerCase()),
      );
    }
    setProducts(
      filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    );
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [currentPage, valueToSearch, allProducts]);

  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(searchFilter);
    if (searchFilter.trim() === "") {
      setProducts(allProducts.slice(0, itemsPerPage));
      setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
    } else {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchFilter.toLowerCase()),
      );
      setProducts(filtered.slice(0, itemsPerPage));
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await ApiService.deleteProduct(productId);
        if (response.status === 200) {
          window.location.reload();
          showMessage("Product deleted successfully.");
        } else {
          showMessage(response.message);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        showMessage(
          error.response?.data?.message ||
            "Failed to delete product. Please try again.",
        );
      }
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="product-page">
        {/* Professional Header Section */}
        <div className="product-page-header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title">Product Management</h1>
              <p className="page-subtitle">
                Manage your inventory and product catalog
              </p>
            </div>
            <div className="header-actions">
              <button
                className="add-product-btn"
                onClick={() => navigate("/add-product")}
              >
                <span className="btn-icon">+</span>
                Add New Product
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg
                className="search-icon"
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
              <input
                className="search-input"
                placeholder="Search products by name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                type="text"
              />
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid Section */}
        <div className="products-section">
          <div className="products-header">
            <h2 className="section-title">Products ({products.length})</h2>
          </div>
          {products && products.length > 0 ? (
            <div className="product-list">
              {products.map((product) => (
                <div className="product-item" key={product.id}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3 className="name">{product.name}</h3>
                    <p className="quantity">
                      Quantity: {product.stockQuantity}
                    </p>
                  </div>
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="no-products-content">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                <h3>No products found</h3>
                <p>Start by adding your first product to the inventory</p>
                <button
                  className="add-first-product-btn"
                  onClick={() => navigate("/add-product")}
                >
                  Add Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
};

export default ProductPage;
