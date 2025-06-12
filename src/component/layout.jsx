import React from "react";
import Sidebar from "./sidebar";

const Layout=({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
              {children}
            </div>
        </div>
    );
}


export default Layout;