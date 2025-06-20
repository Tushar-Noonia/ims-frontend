import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminRoute, ProtectedRoute } from "./services/Guard";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CategoryPage from './pages/CategoryPage';
import SupplierPage from './pages/SupplierPage';
import AddEditSupplierPage from './pages/AddEditSupplierPage';
import ProductPage from './pages/ProductPage';
import AddEditProductPage from './pages/AddEditProductPage';
import PurchasePage from './pages/PurchasePage';
import SellPage from './pages/SellPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailsPage from './pages/TransactionDetailsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ProductsByCategory from "./pages/ProductsByCategory";
import RequestsPage from './pages/RequestsPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import AddRequestPage from './pages/AddRequestPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Paths */}
        <Route path="/p-by-category/:categoryId" element={<AdminRoute element={<ProductsByCategory />}/>} />
        <Route path="/category" element={<AdminRoute element={<CategoryPage />} />} />
        <Route path="/supplier" element={<AdminRoute element={<SupplierPage />} />} />
        <Route path="/add-supplier" element={<AdminRoute element={<AddEditSupplierPage />} />} />
        <Route path="/edit-supplier/:supplierId" element={<AdminRoute element={<AddEditSupplierPage />} />} />
        <Route path="/dashboard" element={<AdminRoute element={<DashboardPage />} />} />
        <Route path="/transactions" element={<AdminRoute element={<TransactionsPage />} />} />
        <Route path="/transaction/:transactionId" element={<AdminRoute element={<TransactionDetailsPage />} />} />
        
        

        {/* Admin and Manager Protected Paths */}
        <Route path="/requests" element={<ProtectedRoute element={<RequestsPage/>}/>}/>
        <Route path="/add-request" element={<ProtectedRoute element={<AddRequestPage/>}/>}/>
        <Route path="/requests/:requestId" element={<ProtectedRoute element={<RequestDetailsPage/>}/>}/>
        <Route path="/sale" element={<ProtectedRoute element={<SellPage />} />} />
        <Route path="/purchase" element={<ProtectedRoute element={<PurchasePage />} />} />
        <Route path="/product" element={<ProtectedRoute element={<ProductPage />} />} />
        <Route path="/add-product" element={<ProtectedRoute element={<AddEditProductPage />} />} />
        <Route path="/edit-product/:productId" element={<ProtectedRoute element={<AddEditProductPage />} />} />
        <Route path="/user/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        
        
        


        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
