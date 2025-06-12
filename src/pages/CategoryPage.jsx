import React , {useState,useEffect}from "react";
import Layout from "../component/layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
    const [categories, setCategories] = React.useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const navigate = useNavigate();

    //fetch categories from the backend

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response= await ApiService.getAllCategories();
                if(response.status === 200) {
                    setCategories(response.categories);
                }
            } catch (error) {
                console.error("Login error:", error);
                showMessage(error.response?.data?.message || "Login failed. Please try again.");
            }
        };
        getCategories();
    },[])


    const addCategory = async () => {
        if(!categoryName)
        {
            showMessage("Please enter a category name.");
            return;
        }
        try {
            await ApiService.createCategory({ name: categoryName });
            showMessage("Category added successfully.");
            setCategoryName("");
            window.location.reload(); 
        }catch (error) {
            console.error("Error adding category:", error);
            showMessage(error.response?.data?.message || "Failed to add category. Please try again.");
        }
    };


    //edit category

    const editCategory = async () => {
        try{
            await ApiService.updateCategory(editingCategoryId, { name: categoryName });
            showMessage("Category updated successfully.");
            setIsEditing(false);
            setEditingCategoryId(null);
            setCategoryName("");
            window.location.reload();

        }catch (error) {
            console.error("Error editing category:", error);
            showMessage(error.response?.data?.message || "Failed to edit category. Please try again.");
        }
    }


    const handleEditCategory = (category) => {
        setCategoryName(category.name);
        setIsEditing(true);
        setEditingCategoryId(category.id);
    }; 

    //delete category
    const handleDeleteCategory = async (categoryId) => {
        if(window.confirm("Are you sure you want to delete this category?")) {
            try {
                await ApiService.deleteCategory(categoryId);
                showMessage("Category deleted successfully.");
                window.location.reload();
            } catch (error) {
                console.error("Error deleting category:", error);
                showMessage(error.response?.data?.message || "Failed to delete category. Please try again.");
            }
        }
    };
    
    const handleProductsButtonClick=(categoryId)=>
    {
        navigate(`/p-by-category/${categoryId}`);
    }

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };


    return(
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="category-page">
                <div className="category-header">
                    <h1>
                        Categories  
                    </h1>
                    <div className="add-cat">
                        <input 
                            value={categoryName}
                            type="text" 
                            placeholder="Enter category name" 
                            onChange={(e) => setCategoryName(e.target.value)} 
                        />
                        {!isEditing ? (
                            <button type="button" onClick={addCategory}>Add Category</button>
                        ) : (
                            <button type="button" onClick={editCategory}>Edit Category</button>
                        )} 
                    </div>
                </div>
                {categories &&
                    <ul className="category-list"> 
                        {categories.map((category) => (
                            <li className="category-item" key={category.id}>
                                <span>{category.name}</span>
                                <div className="category-actions">
                                    <button onClick={()=>handleEditCategory(category)}>Edit</button>
                                    <button 
                                        onClick={() => handleProductsButtonClick(category.id)}
                                    >
                                        View Products
                                    </button>
                                    <button onClick={()=>handleDeleteCategory(category.id)}>Delete</button>
                                    
                                </div>
                            </li>
                        ))}
                    </ul>    
                }
            </div>
        </Layout>
    );


}

    
export default CategoryPage;