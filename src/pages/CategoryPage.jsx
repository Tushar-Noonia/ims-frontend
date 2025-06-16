import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const navigate = useNavigate();

  // Fetch categories from the backend
  useEffect(() => {
    const getCategories = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.getAllCategories();
        if (response.status === 200) {
          setCategories(response.categories);
          setFilteredCategories(response.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        showMessage(
          error.response?.data?.message ||
            "Failed to fetch categories. Please try again.",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const addCategory = async () => {
    if (!categoryName.trim()) {
      showMessage("Please enter a category name.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ApiService.createCategory({
        name: categoryName.trim(),
      });
      if (response.status === 201 || response.status === 200) {
        showMessage("Category added successfully!", "success");
        setCategoryName("");
        // Refresh categories list
        const updatedResponse = await ApiService.getAllCategories();
        if (updatedResponse.status === 200) {
          setCategories(updatedResponse.categories);
          setFilteredCategories(updatedResponse.categories);
        }
      }
    } catch (error) {
      console.error("Error adding category:", error);
      showMessage(
        error.response?.data?.message ||
          "Failed to add category. Please try again.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit category
  const editCategory = async () => {
    if (!categoryName.trim()) {
      showMessage("Please enter a category name.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await ApiService.updateCategory(editingCategoryId, {
        name: categoryName.trim(),
      });
      showMessage("Category updated successfully!", "success");
      setIsEditing(false);
      setEditingCategoryId(null);
      setCategoryName("");

      // Refresh categories list
      const updatedResponse = await ApiService.getAllCategories();
      if (updatedResponse.status === 200) {
        setCategories(updatedResponse.categories);
        setFilteredCategories(updatedResponse.categories);
      }
    } catch (error) {
      console.error("Error editing category:", error);
      showMessage(
        error.response?.data?.message ||
          "Failed to edit category. Please try again.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category) => {
    setCategoryName(category.name);
    setIsEditing(true);
    setEditingCategoryId(category.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCategoryId(null);
    setCategoryName("");
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone.",
      )
    ) {
      try {
        await ApiService.deleteCategory(categoryId);
        showMessage("Category deleted successfully!", "success");

        // Refresh categories list
        const updatedResponse = await ApiService.getAllCategories();
        if (updatedResponse.status === 200) {
          setCategories(updatedResponse.categories);
          setFilteredCategories(updatedResponse.categories);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        showMessage(
          error.response?.data?.message ||
            "Failed to delete category. Please try again.",
          "error",
        );
      }
    }
  };

  const handleProductsButtonClick = (categoryId) => {
    navigate(`/p-by-category/${categoryId}`);
  };

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (isEditing) {
        editCategory();
      } else {
        addCategory();
      }
    }
  };

  return (
    <Layout>
      <div className="elegant-categories-page">
        {message && (
          <div className={`categories-message ${messageType}`}>
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
        <div className="categories-hero">
          <div className="hero-content">
            <h1 className="page-title">Category Management</h1>
            <p className="page-subtitle">
              Organize your inventory with custom categories
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-badge">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>

        {/* Add/Edit Category Form */}
        <div className="category-form-section">
          <div className="form-header">
            <h2>{isEditing ? "Edit Category" : "Add New Category"}</h2>
            {isEditing && (
              <button onClick={handleCancelEdit} className="cancel-edit-btn">
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
            )}
          </div>
          <div className="form-content">
            <div className="input-group">
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
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter category name..."
                  className="category-input"
                  disabled={isSubmitting}
                />
                <button
                  onClick={isEditing ? editCategory : addCategory}
                  disabled={isSubmitting || !categoryName.trim()}
                  className={`submit-btn ${isSubmitting ? "loading" : ""}`}
                >
                  {isSubmitting ? (
                    <div className="btn-spinner"></div>
                  ) : isEditing ? (
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
                      Update
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
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-wrapper">
            <div className="search-icon">
              <svg
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
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="clear-search-btn"
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
              </button>
            )}
          </div>
        </div>

        {/* Categories List */}
        <div className="categories-list-section">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="categories-grid">
              {filteredCategories.map((category) => (
                <div key={category.id} className="category-card">
                  <div className="category-header">
                    <div className="category-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="category-name">{category.name}</h3>
                  </div>
                  <div className="category-actions">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="action-btn edit-btn"
                      title="Edit category"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleProductsButtonClick(category.id)}
                      className="action-btn view-btn"
                      title="View products in this category"
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
                      View Products
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="action-btn delete-btn"
                      title="Delete category"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p>
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Start by creating your first category to organize your inventory"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="clear-search-action-btn"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
