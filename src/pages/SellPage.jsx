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
    const [dropdownOpen, setDropdownOpen] = useState(false);
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
                showMessage(error.response?.data?.message || "Failed to fetch products. Please try again.");
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
                products.filter(product =>
                    product.name.toLowerCase().includes(productSearch.toLowerCase())
                )
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

    const   handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId || !quantity) {
            showMessage("Please fill in all fields.");
            return;
        }

        const body = {
            productId,
            quantity: parseInt(quantity),
            description
        };

        try {
            const response = await ApiService.saleTransaction(body);
            if (response.status === 200) {
                showMessage("Withdraw submitted successfully.");
                resetForm();
            } else {
                showMessage("Failed to submit withdraw. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting withdraw:", error);
            showMessage(error.response?.data?.message || "Failed to submit withdraw. Please try again.");
        }
    };

    const resetForm = () => {
        setProductId("");
        setDescription("");
        setQuantity("");
        setProductSearch("");
        setFilteredProducts(products);
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

    return (
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="purchase-form-page">
                <h1>Withdraw from Inventory</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" ref={searchRef} style={{ position: "relative" }}>
                        <label>Select product</label>
                        <input
                            type="text"
                            value={productSearch}
                            onChange={(e) => {
                                setProductSearch(e.target.value);
                                setProductId(""); // Clear selection if user types
                                setDropdownOpen(true);
                            }}
                            onFocus={handleSearchFocus}
                            placeholder="Type product name"
                            autoComplete="off"
                        />
                        {dropdownOpen && filteredProducts.length > 0 && (
                            <ul
                                style={{
                                    position: "absolute",
                                    zIndex: 10,
                                    background: "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    width: "100%",
                                    maxHeight: "180px",
                                    overflowY: "auto",
                                    marginTop: "2px",
                                    listStyle: "none",
                                    padding: 0
                                }}
                            >
                                {filteredProducts.map((product) => (
                                    <li
                                        key={product.id}
                                        style={{
                                            padding: "8px 12px",
                                            cursor: "pointer",
                                            background: productId === product.id ? "#f3f4f6" : "#fff"
                                        }}
                                        onMouseDown={() => handleProductSelect(product)}
                                    >
                                        {product.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Reason for withdrawal"
                        />
                    </div>
                    <div className="form-group">
                        <label>Quantity Withdrawn</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            required
                        />
                    </div>
                    <button type="submit">Withdraw Product</button>
                </form>
            </div>
        </Layout>
    );
};

export default SellPage;