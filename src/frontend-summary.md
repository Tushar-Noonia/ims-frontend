# Frontend Summary: Inventory Management System

## 1. Technology Stack

- **Framework:** React (bootstrapped with Create React App)
- **Routing:** React Router (`react-router-dom`)
- **State Management:** React Hooks (`useState`, `useEffect`, etc.)
- **API Communication:** Custom `ApiService` class (handles HTTP requests)
- **PDF Generation:** `@react-pdf/renderer` (for exporting tables)
- **Charts:** `recharts` (for analytics/visualizations)
- **Styling:** Custom CSS (`index.css`, `App.css`), responsive design via media queries
- **Testing:** Jest (default with Create React App)
- **Other:** 
  - SVG icons for UI
  - Pagination components for tables/lists

## 2. Component Structure

**Major Components:**

- [`component/layout.jsx`](component/layout.jsx):  
  Provides the main layout structure, including sidebar and main content area.

- [`component/sidebar.jsx`](component/sidebar.jsx):  
  Sidebar navigation with support for role-based links and responsive collapse.

- [`component/paginationComponent.jsx`](component/paginationComponent.jsx):  
  Handles pagination UI and logic for paginated lists/tables.

- [`component/transactionsTablePDF.jsx`](component/transactionsTablePDF.jsx):  
  Generates a PDF export of the transactions table using `@react-pdf/renderer`.

## 3. Main Routes/Pages and Their Functionality

- **Authentication:**
  - `/login` ([`LoginPage.jsx`](pages/LoginPage.jsx)): User login.
  - `/register` ([`RegisterPage.jsx`](pages/RegisterPage.jsx)): User registration.

- **Dashboard:**
  - `/dashboard` ([`DashboardPage.jsx`](pages/DashboardPage.jsx)):  
    Overview of key stats (transactions, products, requests), analytics charts, and recent activity.

- **Category Management:**
  - `/category` ([`CategoryPage.jsx`](pages/CategoryPage.jsx)):  
    View, add, edit, and delete product categories.

- **Supplier Management:**
  - `/supplier` ([`SupplierPage.jsx`](pages/SupplierPage.jsx)):  
    List and manage suppliers.
  - `/add-supplier`, `/edit-supplier/:supplierId` ([`AddEditSupplierPage.jsx`](pages/AddEditSupplierPage.jsx)):  
    Add or edit supplier details.

- **Product Management:**
  - `/product` ([`ProductPage.jsx`](pages/ProductPage.jsx)):  
    List, search, add, edit, and delete products.
  - `/add-product`, `/edit-product/:productId` ([`AddEditProductPage.jsx`](pages/AddEditProductPage.jsx)):  
    Add or edit product details.
  - `/p-by-category/:categoryId` ([`ProductsByCategory.jsx`](pages/ProductsByCategory.jsx)):  
    List products filtered by category.

- **Inventory Operations:**
  - `/purchase` ([`PurchasePage.jsx`](pages/PurchasePage.jsx)):  
    Add products to inventory (stock acquisition).
  - `/sale` ([`SellPage.jsx`](pages/SellPage.jsx)):  
    Withdraw products from inventory (sales/withdrawal).

- **Requests:**
  - `/requests` ([`RequestsPage.jsx`](pages/RequestsPage.jsx)):  
    List, search, filter, and view inventory requests.
  - `/add-request` ([`AddRequestPage.jsx`](pages/AddRequestPage.jsx)):  
    Submit a new inventory request.
  - `/requests/:requestId` ([`RequestDetailsPage.jsx`](pages/RequestDetailsPage.jsx)):  
    Detailed view and status update for a specific request.

- **Transactions:**
  - `/transactions` ([`TransactionsPage.jsx`](pages/TransactionsPage.jsx)):  
    List, search, filter, and export transactions.
  - `/transaction/:transactionId` ([`TransactionDetailsPage.jsx`](pages/TransactionDetailsPage.jsx)):  
    Detailed view and status update for a specific transaction.

- **User Profile:**
  - `/user/profile` ([`ProfilePage.jsx`](pages/ProfilePage.jsx)):  
    View user info, recent transactions, and requests.

## 4. API Communication

- **Centralized in [`services/ApiService.js`](services/ApiService.js):**
  - Provides static methods for all API calls (CRUD for products, categories, suppliers, requests, transactions, users).
  - Handles authentication tokens and user roles.
  - Used throughout pages/components for data fetching and mutations.

## 5. Authentication & Role-Based Access

- **Guards in [`services/Guard.js`](services/Guard.js):**
  - `ProtectedRoute`: Restricts access to authenticated users.
  - `AdminRoute`: Restricts access to admin users only.
- **Role Checks:**  
  - Admin-only pages (e.g., dashboard, supplier management, transactions) use `AdminRoute`.
  - Other pages use `ProtectedRoute` for authenticated access.
  - Role and authentication status are determined via `ApiService`.

## 6. Custom Hooks or Utilities

- **No custom React hooks** are defined in the visible code, but:
  - Utility functions for formatting (currency, date, status color) are defined within pages/components.
  - Pagination logic is encapsulated in the `PaginationComponent`.

## 7. Additional Features

- **Responsive Design:**  
  - Extensive use of CSS media queries in [`index.css`](index.css) for mobile/tablet/desktop layouts.
  - Sidebar collapses on smaller screens; tables and forms adapt layout.

- **Charts & Analytics:**  
  - Dashboard uses `recharts` for line charts and analytics visualizations.

- **Filters & Search:**  
  - Search and filter functionality on most list pages (products, requests, transactions, suppliers).

- **Alerts & Messages:**  
  - Success and error messages shown via inline alert components/cards.
  - Loading spinners and empty state illustrations for better UX.

- **PDF Export:**  
  - Transactions table can be exported as PDF using `@react-pdf/renderer`.

- **Pagination:**  
  - All major lists (products, requests, transactions) are paginated.

- **Role Badges & Status Indicators:**  
  - Visual badges for user roles, request/transaction status, and types.

---

**For more details, see the source files in the [`src/`](src/)