import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../services/ApiService";
import PaginationComponent from "../component/paginationComponent";

const ProductsByCategory = () => {
    const navigate = useNavigate();
    const params = useParams();

    const [categoryId, setCategoryId] = useState(params.categoryId);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // For search filtering
    const [message, setMessage] = useState("");
    const [searchFilter, setSearchFilter] = useState("");
    const [valueToSearch, setValueToSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 5;

    // Update categoryId state if params change
    useEffect(() => {
        setCategoryId(params.categoryId);
        setCurrentPage(1);
    }, [params.categoryId]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await ApiService.getProductsByCategory(categoryId);
                if (response.status === 200) {
                    setAllProducts(response.products);
                    setTotalPages(Math.ceil(response.products.length / itemsPerPage));
                    setProducts(
                        response.products.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                        )
                    );
                }
            } catch (error) {
                setMessage(
                    error?.response?.data?.message ||
                    "Failed to fetch products. Please try again."
                );
            }
        };

        if (categoryId) {
            getProducts();
        }
    }, [currentPage, categoryId]);

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        setValueToSearch(searchFilter);
        if (searchFilter.trim() === "") {
            setProducts(
                allProducts.slice(0, itemsPerPage)
            );
            setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
        } else {
            const filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(searchFilter.toLowerCase())
            );
            setProducts(filtered.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        }
    };

    // Update products when page or search changes
    useEffect(() => {
        let filtered = allProducts;
        if (valueToSearch.trim() !== "") {
            filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(valueToSearch.toLowerCase()) 
            );
        }
        setProducts(
            filtered.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            )
        );
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    }, [currentPage, valueToSearch, allProducts]);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await ApiService.deleteProduct(productId);
                if (response.status === 200) {
                    setMessage("Product deleted successfully.");
                    // Refresh products after deletion
                    const refreshed = await ApiService.getProductsByCategory(categoryId);
                    if (refreshed.status === 200) {
                        setAllProducts(refreshed.products);
                        setProducts(
                            refreshed.products.slice(
                                (currentPage - 1) * itemsPerPage,
                                currentPage * itemsPerPage
                            )
                        );
                        setTotalPages(Math.ceil(refreshed.products.length / itemsPerPage));
                    }
                } else {
                    setMessage(response.message);
                }
            } catch (error) {
                setMessage(
                    error?.response?.data?.message ||
                    "Failed to delete product. Please try again."
                );
            }
        }
    };

    return (
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="product-page">
                <div className="product-header">
                    <h1>Products</h1>
                    <div className="add-product-btn">
                        <button onClick={() => navigate("/add-product")}>Add Product</button>
                    </div>
                </div>
                <div className="product-search" style={{ marginBottom: "1rem" }}>
                    <input
                        placeholder="Search product ..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        type="text"
                    />
                    <button onClick={handleSearch}>Search</button>
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
                                        onClick={() =>
                                            navigate(`/edit-product/${product.id}`)
                                        }
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
                    <div>No products found for this category.</div>
                )}
            </div>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </Layout>
    );
};

export default ProductsByCategory;