import React from "react";
import { Navigate, useLocation} from "react-router-dom";
import ApiService from "./ApiService";

export const ProtectedRoute=({element:Component})=> {
    const location=useLocation();
    return ApiService.isAuthenticated() ?(
        Component
    ):(
        <Navigate to="/login" replace state={{from:location}}/>
    );
}

export const AdminRoute = ({ element }) => {
    // These should return true if the user is authenticated and is an admin
    
    const isAuthenticated = !!ApiService.getToken();
    const isAdmin = ApiService.getRole && ApiService.getRole() === "ADMIN";
    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/login" />;
    }
    return element;
};

