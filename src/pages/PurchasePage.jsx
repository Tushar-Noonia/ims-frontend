import React, { useState, useEffect, useRef } from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";

const PurchasePage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productSearch, setProductSearch] = useState("");
    const [productId, setProductId] = useState("");
    const [productDropdownOpen, setProductDropdownOpen] = useState(false);
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
                showMessage(error.response?.data?.message || "Failed to fetch data. Please try again.");
            }
        };
        fetchProductsAndSuppliers();
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

    // Filter suppliers as user types
    useEffect(() => {
        if (supplierSearch.trim() === "") {
            setFilteredSuppliers(suppliers);
        } else {
            setFilteredSuppliers(
                suppliers.filter(supplier =>
                    supplier.name.toLowerCase().includes(supplierSearch.toLowerCase())
                )
            );
        }
    }, [supplierSearch, suppliers]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (productSearchRef.current && !productSearchRef.current.contains(event.target)) {
                setProductDropdownOpen(false);
            }
            if (supplierSearchRef.current && !supplierSearchRef.current.contains(event.target)) {
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
            showMessage("Please fill in all fields.");
            return;
        }

        const body = {
            productId,
            quantity: parseInt(quantity),
            supplierId,
            description
        };

        try {
            const resoonse = await ApiService.purchaseTransaction(body);
            if (resoonse.status === 200) {
                showMessage("Added to inventory successfully.");
                resetForm();
            } else {
                showMessage("Failed to submit purchase. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting purchase:", error);
            showMessage(error.response?.data?.message || "Failed to submit purchase. Please try again.");
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
                <h1>Add to Inventory</h1>
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

                    <div className="form-group" ref={supplierSearchRef} style={{ position: "relative" }}>
                        <label>Select supplier</label>
                        <input
                            type="text"
                            value={supplierSearch}
                            onChange={(e) => {
                                setSupplierSearch(e.target.value);
                                setSupplierId(""); // Clear selection if user types
                                setSupplierDropdownOpen(true);
                            }}
                            onFocus={handleSupplierSearchFocus}
                            placeholder="Type supplier name"
                            autoComplete="off"
                        />
                        {supplierDropdownOpen && filteredSuppliers.length > 0 && (
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
                                {filteredSuppliers.map((supplier) => (
                                    <li
                                        key={supplier.id}
                                        style={{
                                            padding: "8px 12px",
                                            cursor: "pointer",
                                            background: supplierId === supplier.id ? "#f3f4f6" : "#fff"
                                        }}
                                        onMouseDown={() => handleSupplierSelect(supplier)}
                                    >
                                        {supplier.name}
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
                        <label>Quantity Added</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Enter quantity"
                            required
                        />
                    </div>
                    <button type="submit">Add to Inventory</button>
                </form>
            </div>
        </Layout>
    );
};

export default PurchasePage;