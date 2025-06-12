import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import { useNavigate} from "react-router-dom";
import ApiService from "../services/ApiService";
import PaginationComponent from "../component/paginationComponent";


const ProductPage = () => {

    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();


    //pagination setup

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 5;

    useEffect(()=>{
        const getProducts = async () => {
            try{
                const response = await ApiService.getAllProducts();
                if(response.status === 200) {
                    setTotalPages(Math.ceil(response.products.length / itemsPerPage));
                    setProducts(response.products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));    
                }
            }catch (error) {
                console.error("Error fetching products:", error);
                showMessage(error.response?.data?.message || "Failed to fetch products. Please try again.");
            }
        }

        getProducts();

    },[currentPage]);



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
                showMessage(error.response?.data?.message || "Failed to delete product. Please try again.");
            }
        }
    }



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
                <div className="product-header">
                    <h1>Products</h1>
                    <div className="add-product-btn">
                        <button onClick={() => navigate("/add-product")}>Add Product</button>
                    </div>
                </div>
                {products &&
                    <div className="product-list">
                        {products.map((product) => (
                            <div className="product-item" key={product.id}>
                                <img src={product.imageUrl} alt={product.name} className="product-image" />
                                <div className="product-info">
                                    <h3 className="name">{product.name}</h3>
                                    <p className="sku">{product.sku}</p>
                                    <p className="price">Price: Rs.{product.price}</p>
                                    <p className="quantity">Quantity: {product.stockQuantity}</p>
                                </div>

                                <div className="product-actions">
                                    <button className="edit-btn" onClick={() => navigate(`/edit-product/${product.id}`)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>

                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            >
            </PaginationComponent>
        </Layout>
    );
}

export default ProductPage;