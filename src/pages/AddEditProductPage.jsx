import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../services/ApiService";

const AddEditProductPage = () => {

    const { productId } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const navigate = useNavigate();

    useEffect(()=>{

        const fetchCategories = async () => {
            try {
                const response = await ApiService.getAllCategories();
                if (response.status === 200) {
                    setCategories(response.categories);
                } else {
                    showMessage(response.message);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                showMessage(error.response?.data?.message || "Failed to fetch categories. Please try again.");
            }
        };


        const fetchProductById = async () => {
            if (productId) {
                setIsEditing(true);
                try {
                    const response = await ApiService.getProductById(productId);
                    if (response.status === 200) {
                        setName(response.product.name);
                        setDescription(response.product.description);
                        setSku(response.product.sku);
                        setPrice(response.product.price);
                        setCategoryId(response.product.categoryId);
                        setImageUrl(response.product.imageUrl);
                        setStockQuantity(response.product.stockQuantity);
                    } else {
                        showMessage(response.message);
                    }
                } catch (error) {
                    console.error("Error fetching product:", error);
                    showMessage(error.response?.data?.message || "Failed to fetch product. Please try again.");
                }
            }
        }
        fetchCategories();
        if(productId) {
            fetchProductById();
        }
    },[productId])


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImageUrl("");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData=new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("sku", sku);
        formData.append("price", price);
        formData.append("categoryId", categoryId);
        formData.append("stockQuantity", stockQuantity);
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }
        try{
            if(isEditing)
            {
                formData.append("productId", productId);
                
                // for (let pair of formData.entries()) {
                // console.log(pair[0] + ": " + pair[1]);
                // }
                const response = await ApiService.updateProduct(formData);

                if (response.status === 200) {
                    showMessage("Product updated successfully.");
                    navigate("/product");
                } else {
                    showMessage(response.message);
                }
            }
            else
            {
                const response = await ApiService.addProduct(formData);
                if (response.status === 200) {
                    showMessage("Product added successfully.");
                    navigate("/product");
                } else {
                    showMessage(response.message);
                }
            }
        }
        catch (error) {
            console.error("Error submitting product:", error);
            showMessage(error.response?.data?.message || "Failed to submit product. Please try again.");
        }
    }

    //     const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append("name", name);
    //     formData.append("sku", sku);
    //     formData.append("price", price);
    //     formData.append("stockQuantity", stockQuantity);
    //     formData.append("categoryId", categoryId);
    //     formData.append("description", description);
    //     if (imageFile) {
    //       formData.append("imageFile", imageFile);
    //     }

    //     try {
    //       if (isEditing) {
    //         formData.append("productId", productId);
    //         await ApiService.updateProduct(formData);
    //         showMessage("Product successfully updated");
    //       } else {
    //         await ApiService.addProduct(formData);
    //         showMessage("Product successfully Saved 🤩");
    //       }
    //       navigate("/product");
    //     } catch (error) {
    //       showMessage(
    //         error.response?.data?.message || "Error Saving a Product: " + error
    //       );
    //     }
    //   };


    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };


    return(
        <Layout>{message && <div className="message">{message}</div>}
            <div className="product-form-page">
                <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" value={name} required onChange={(e)=>setName(e.target.value)}/>

                    </div>

                    <div className="form-group">
                        <label>SKU</label>
                        <input type="text" value={sku} required onChange={(e)=>setSku(e.target.value)}/>
                    </div>
                    
                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input type="text" value={stockQuantity} required onChange={(e)=>setStockQuantity(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" value={price} required onChange={(e)=>setPrice(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select value={categoryId} required onChange={(e)=>setCategoryId(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>
                        <input type="file" onChange={handleImageChange} />
                        {imageUrl && (
                            <img src={imageUrl} alt="Product" className="image-preview" />
                        )} 
                    </div>

                    <button onClick={()=>navigate('/product')} type="submit" className="submit-btn">
                        {isEditing ? "Update Product" : "Add Product"}
                    </button>
                </form>
            </div>
        </Layout>
    )


   


}

export default AddEditProductPage;