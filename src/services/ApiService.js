import axios from 'axios';
import CryptoJS from 'crypto-js';

export default class ApiService {
    static BASE_URL=process.env.REACT_APP_BASE_URL;
    static ENCRYPTION_KEY=process.env.REACT_APP_ENCRYPTION_KEY;

    //encryption method
    static encryptData(data) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), this.ENCRYPTION_KEY.toString()).toString();
    }

    //decryption method
    static decryptData(data) {
        const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY.toString());
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } 

    //save token
    static saveToken(token) {
        const encryptedToken = this.encryptData(token);
        localStorage.setItem("token", encryptedToken);
    }

    static getToken() {
        const encryptedToken = localStorage.getItem("token");
        //console.log("(api service)this is the token: "+this.decryptData(encryptedToken));
        if (encryptedToken) {
            return this.decryptData(encryptedToken);
        }
        return null;
    }

    static saveRole(role) {
        const encryptedRole = this.encryptData(role);

        localStorage.setItem("role", encryptedRole);
    }

    static getRole() {
        const encryptedRole = localStorage.getItem("role");
        //console.log("(apiservice)this is the token: "+this.decryptData(encryptedRole));
        if (encryptedRole) {
            return this.decryptData(encryptedRole);
        }
        return null;
    }

    static clearAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static getHeader()
    {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }


//AUTH AND USER API CALLS
    static async login(loginData) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginData);
        if (response.data.token) {
            this.saveToken(response.data.token);
            this.saveRole(response.data.role);
        }
        return response.data;
    }

    static async register(registerData) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registerData);
        if (response.data.token) {
            this.saveToken(response.data.token);
            this.saveRole(response.data.role);
        }
        return response.data;
    }

    static async getAllUsers() {
        const response=await axios.get(`${this.BASE_URL}/users/all`, { headers: this.getHeader() });
        return response.data;
    }

    static async getUserById(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/${userId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async getCurrentUser() {
        const response = await axios.get(`${this.BASE_URL}/users/current`, { headers: this.getHeader() });
        return response.data;
    }

    static async updateUser(userId, userData) {
        const response = await axios.put(`${this.BASE_URL}/users/update/${userId}`, userData, { headers: this.getHeader() });
        return response.data;
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async getUserRequests(userId){
        const response=await axios.get(`${this.BASE_URL}/users/userRequests/${userId}`,{headers: this.getHeader()});
        return response.data;
    }

    static async getUserTransactions(userId)
    {
        const response=await axios.get(`${this.BASE_URL}/users/userTransactions/${userId}`,{headers: this.getHeader()});
        return response.data;
    }


    //PRODUCT API CALLS

    static async addProduct(productData) {
        const response = await axios.post(`${this.BASE_URL}/products/add`, productData, 
            { 
                headers: {
                    ...this.getHeader(),
                    'Content-Type': 'multipart/form-data'
                } 
            });
        return response.data;
    }


    static async updateProduct(formData) {

        const response = await axios.put(`${this.BASE_URL}/products/update`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        
        return response.data;
    }


    static async getAllProducts() {
        const response = await axios.get(`${this.BASE_URL}/products/all`, { headers: this.getHeader() });
        return response.data;
    }

    static async getProductById(productId) {
        const response = await axios.get(`${this.BASE_URL}/products/${productId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await axios.delete(`${this.BASE_URL}/products/delete/${productId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async searchProducts(searchValue) {
        const response = await axios.get(`${this.BASE_URL}/products/search/${searchValue}`, { 
            headers: this.getHeader() 
        });
        return response.data;
    }

    static async getProductsByCategory(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/products/category/${categoryId}`, { headers: this.getHeader() });
        return response.data;
    }



    //Category API CALLS

    static async createCategory(categoryData) {
        const response = await axios.post(`${this.BASE_URL}/categories/add`, categoryData, { headers: this.getHeader() });
        return response.data;
    }

    static async getAllCategories() {
        const response = await axios.get(`${this.BASE_URL}/categories/all`, { headers: this.getHeader() });
        return response.data;
    }

    static async getCategoryById(categoryId) {
        const response = await axios.get(`${this.BASE_URL}/categories/${categoryId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async updateCategory(categoryId, categoryData) {
        const response = await axios.put(`${this.BASE_URL}/categories/update/${categoryId}`, categoryData, { headers: this.getHeader() });
        return response.data;
    }

    static async deleteCategory(categoryId) {
        const response = await axios.delete(`${this.BASE_URL}/categories/delete/${categoryId}`, { headers: this.getHeader() });
        return response.data;
    }


    //Supplier API CALLS

    static async createSupplier(supplierData) {
        const response = await axios.post(`${this.BASE_URL}/suppliers/add`, supplierData, { headers: this.getHeader() });
        return response.data;
    }

    static async getAllSuppliers() {
        const response = await axios.get(`${this.BASE_URL}/suppliers/all`, { headers: this.getHeader() });
        return response.data;
    }

    static async getSupplierById(supplierId) {
        const response = await axios.get(`${this.BASE_URL}/suppliers/${supplierId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async updateSupplier(supplierId, supplierData) {
        const response = await axios.put(`${this.BASE_URL}/suppliers/update/${supplierId}`, supplierData, { headers: this.getHeader() });
        return response.data;
    }

    static async deleteSupplier(supplierId) {
        const response = await axios.delete(`${this.BASE_URL}/suppliers/delete/${supplierId}`, { headers: this.getHeader() });
        return response.data;
    }

    

    //Transaction API CALLS

    static async purchaseTransaction(transactionData) {
        const response = await axios.post(`${this.BASE_URL}/transactions/purchase`, transactionData, { headers: this.getHeader() });
        return response.data;
    }

    static async saleTransaction(transactionData) {
        const response = await axios.post(`${this.BASE_URL}/transactions/sell`, transactionData, { headers: this.getHeader() });
        return response.data;
    }

    static async returnToSupplier(transactionData) {
        const response = await axios.post(`${this.BASE_URL}/transactions/return`, transactionData, { headers: this.getHeader() });
        return response.data;
    }
    
    static async getAllTransactions(filter) {
        const response = await axios.get(`${this.BASE_URL}/transactions/all`, { headers: this.getHeader()
            , params: { filter }            
         });
        return response.data;
    }
    
    static async getTransactionById(transactionId) {
        const response = await axios.get(`${this.BASE_URL}/transactions/${transactionId}`, { headers: this.getHeader() });
        return response.data;
    }

    static async getTransactionByMonthAndYear(month, year) {
        const response = await axios.get(`${this.BASE_URL}/transactions/month/by-month-and-year`, { headers: this.getHeader()
            , params: { month:month, year:year }
         });
        return response.data;
    }


    static async updateTransactionStatus(transactionId, status) {
        const response = await axios.put(`${this.BASE_URL}/transactions/update/${transactionId}`,  status , { headers: this.getHeader() });
        return response.data;
    }


    // REQUEST API CALLS

    static async addRequest(requestData) {
        const response = await axios.post(
            `${this.BASE_URL}/requests/add`,
            requestData,
            { headers: this.getHeader() }
        );
        return response.data;
    }

    static async getAllRequests(filter) {
        const response = await axios.get(
            `${this.BASE_URL}/requests/all`,
            {
                headers: this.getHeader(),
                params: { filter }
            }
        );
        return response.data;
    }

    static async getRequestById(requestId) {
        const response = await axios.get(
            `${this.BASE_URL}/requests/${requestId}`,
            { headers: this.getHeader() }
        );
        return response.data;
    }

    static async getRequestByMonthAndYear(month, year) {
        const response = await axios.get(
            `${this.BASE_URL}/requests/by-month-and-year`,
            {
                headers: this.getHeader(),
                params: { month, year }
            }
        );
        return response.data;
    }

    static async updateRequestStatus(requestId, requestStatus) {
        const response = await axios.put(
            `${this.BASE_URL}/requests/update/${requestId}`,
            requestStatus,
            { headers: this.getHeader() }
        );
        return response.data;
    }


    //Authentication API CALLS

    static logout() {
        this.clearAuth();
    }

    static isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    static isAdmin() {
        const role = this.getRole();
        return role === "ADMIN";
    }



}