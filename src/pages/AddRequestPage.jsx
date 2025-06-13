import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";

const AddRequestPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productSearch, setProductSearch] = useState("");
    const [productId, setProductId] = useState("");
    const [productDropdownOpen, setProductDropdownOpen] = useState(false);
    const productSearchRef = useRef(null);

    const navigate=useNavigate();

    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productResponse = await ApiService.getAllProducts();
                if (productResponse.status === 200) {
                    setProducts(productResponse.products);
                    setFilteredProducts(productResponse.products);
                }
            } catch (error) {
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
            if (productSearchRef.current && !productSearchRef.current.contains(event.target)) {
                setProductDropdownOpen(false);
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

    const handleProductSearchFocus = () => {
        setProductDropdownOpen(true);
    };

    const handleSubmit = async (e) => {
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
            const response = await ApiService.addRequest(body);
            if (response.status === 200) {
                showMessage("Request added successfully.");
                resetForm();
            } else {
                showMessage("Failed to submit request. Please try again.");
            }
        } catch (error) {
            showMessage(error.response?.data?.message || "Failed to submit request. Please try again.");
        }
    };

    const resetForm = () => {
        setProductId("");
        setProductSearch("");
        setDescription("");
        setQuantity("");
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
                <h1>Add Request</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" ref={productSearchRef} style={{ position: "relative" }}>
                        <label>Select product</label>
                        <input
                            type="text"
                            value={productSearch}
                            onChange={(e) => {
                                setProductSearch(e.target.value);
                                setProductId(""); // Clear selection if user types
                                setProductDropdownOpen(true);
                            }}
                            onFocus={handleProductSearchFocus}
                            placeholder="Type product name"
                            autoComplete="off"
                        />
                        {productDropdownOpen && filteredProducts.length > 0 && (
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
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            rows={4}
                        />
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            required
                        />
                    </div>
                    <button type="submit" onClick={()=>{navigate('/requests')}}>Add Request</button>
                </form>
            </div>
        </Layout>
    );
};

export default AddRequestPage;