import React from "react";
import { Link } from "react-router-dom";
import ApiService from "../services/ApiService";

const logout = () =>{
    ApiService.logout();
}

const Sidebar = () => {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();

    return (
        <div className="sidebar">
            <h1 className="ims">IMS</h1>
            <ul className="nav-links">
                {isAuthenticated && 
                    <li>
                        <Link to="/dashboard">DashBoard</Link>
                    </li>
                }
                {isAuthenticated && 
                    <li>
                        <Link to="/transactions">Transactions</Link>
                    </li>
                }
                {isAdmin && 
                    <li>
                        <Link to="/category">Categories</Link>
                    </li>
                }
                {isAdmin && 
                    <li>
                        <Link to="/product">Products</Link>
                    </li>
                }
                {isAdmin && 
                    <li>
                        <Link to="/supplier">Suppliers</Link>
                    </li>
                }
                {isAuthenticated && 
                    <li>
                        <Link to="/requests">Requests</Link>
                    </li>
                }
                {isAuthenticated && 
                    <li>
                        <Link to="/purchase">Add To Inventory</Link>
                    </li>
                }
                {isAuthenticated && 
                    <li>
                        <Link to="/sale">Withdraw</Link>
                    </li>
                }
                {isAuthenticated && 
                    <li>
                        <Link to="/user/profile">Profile</Link>
                    </li>
                }
                {isAuthenticated && 
                    <li>
                        <Link to="/login" onClick={logout}>Logout</Link>
                    </li>
                }
                
            </ul>
        </div>
    )
}

export default Sidebar;