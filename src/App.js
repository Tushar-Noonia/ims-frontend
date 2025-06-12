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
        <Route path="/product" element={<AdminRoute element={<ProductPage />} />} />
        <Route path="/add-product" element={<AdminRoute element={<AddEditProductPage />} />} />
        <Route path="/edit-product/:productId" element={<AdminRoute element={<AddEditProductPage />} />} />
        <Route path="/purchase" element={<AdminRoute element={<PurchasePage />} />} />

        {/* Admin and Manager Protected Paths */}
        <Route path="/sale" element={<ProtectedRoute element={<SellPage />} />} />
        <Route path="/transactions" element={<ProtectedRoute element={<TransactionsPage />} />} />
        <Route path="/transaction/:transactionId" element={<ProtectedRoute element={<TransactionDetailsPage />} />} />
        <Route path="/user/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
