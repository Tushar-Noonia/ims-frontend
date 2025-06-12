import React, { useState, useEffect } from "react";
import Layout from "../component/layout";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../services/ApiService";



const AddEditSupplierPage = () => {
    const {supplierId}=useParams();
    const [name, setName] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [message, setMessage] = useState("");
    const [address, setAddress] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    
    const navigate = useNavigate();

    useEffect(()=>{
        if(supplierId){
            setIsEditing(true);
        }

        const fetchSupplier = async () => {
            if (supplierId) {
                try {
                    const response = await ApiService.getSupplierById(supplierId);
                    if (response.status === 200) {
                        setName(response.supplier.name);
                        setContactInfo(response.supplier.contactInfo);
                        setAddress(response.supplier.address);
                    } else {
                        showMessage(response.message);
                    }
                } catch (error) {
                    console.error("Error fetching supplier:", error);
                    showMessage(error.response?.data?.message || "Failed to fetch supplier. Please try again.");
                }
            }
        };
        
        fetchSupplier();

    },[supplierId]);


    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

    //handle form submission

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const supplierData = {
            name,
            contactInfo,
            address
        };

        try {
            let response;
            if (isEditing) {
                response = await ApiService.updateSupplier(supplierId, supplierData);
            } else {
                response = await ApiService.createSupplier(supplierData);
            }

            if (response.status === 200) {
                showMessage(isEditing ? "Supplier updated successfully." : "Supplier added successfully.");
                navigate("/supplier");
            } else {
                showMessage(response.message);
            }
        } catch (error) {
            console.error("Error submitting supplier data:", error);
            showMessage(error.response?.data?.message || "Failed to submit supplier data. Please try again.");
        }
    }

    return (
        <Layout>
            {message && <div className="message">message</div>}
            <div className="supplier-form-page">
                <h1>{isEditing ? "Edit Supplier" : "Add Supplier"}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Supplier Name</label>
                        <input type="text" value={name} required onChange={(e)=>setName(e.target.value)}/>

                    </div>

                    <div className="form-group">
                        <label>Contact Info</label>
                        <input type="text" value={contactInfo} required onChange={(e)=>setContactInfo(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <label>Supplier Address</label>
                        <input type="text" value={address} required onChange={(e)=>setAddress(e.target.value)}/>
                    </div>

                    <button type="submit">{isEditing ? "Update Supplier" : "Add Supplier"}</button>
                </form>
            </div>
        </Layout>
    )
    

}

export default AddEditSupplierPage;