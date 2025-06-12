import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const getSuppliers = async() => {
            try {
                const response = await ApiService.getAllSuppliers();
                if (response.status === 200) {
                    setSuppliers(response.suppliers);
                } else {
                    showMessage(response.message);
                }
            }
            catch (error) {
                console.error("Error fetching the suppliers:", error);
                showMessage(error.response?.data?.message || "Failed to fetch suppliers. Please try again.");
            }
        }

        getSuppliers();
    }, [])

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

    const handleDeleteSupplier = async (supplierId) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            try {
                const response = await ApiService.deleteSupplier(supplierId);
                if (response.status === 200) {
                    window.location.reload();
                    showMessage("Supplier deleted successfully.");
                } else {
                    showMessage(response.message);
                }
            } catch (error) {
                console.error("Error deleting supplier:", error);
                showMessage(error.response?.data?.message || "Failed to delete supplier. Please try again.");
            }
        }
    }



    return (
        <Layout>
            {message && <div className="message">message</div>}
            <div className="supplier-page">
                <div className="supplier-header">
                    <h1>Suppliers</h1>
                    <div className="add-sup">
                        <button onClick={() => navigate('/add-supplier')}>Add Supplier</button>
                    </div>
                </div>
            </div>
            {suppliers &&
                <ul className="supplier-list">
                    {suppliers.map((supplier) => (
                        <li className="supplier-item" key={supplier.id}>
                            <span>{supplier.name}</span>
                            <div className="supplier-actions">
                                <button onClick={() => navigate(`/edit-supplier/${supplier.id}`)}>Edit</button>
                                <button onClick={() => handleDeleteSupplier(supplier.id)}>Delete</button>
                            </div>

                        </li>
                    ))}

                </ul>
            }
        </Layout>
    );

}

export default SupplierPage;