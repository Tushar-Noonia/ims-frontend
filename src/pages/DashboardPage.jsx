import React, { useState, useEffect } from 'react';
import Layout from '../component/layout';
import ApiService from '../services/ApiService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const [message, setMessage] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedData, setSelectedData] = useState("amount");
    const [transactionData, setTransactionData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionResponse = await ApiService.getAllTransactions();
                if (transactionResponse.status === 200) {
                    setTransactionData(
                        transformTransactionData(
                            transactionResponse.transactions,
                            selectedMonth,
                            selectedYear
                        )
                    );
                    // Show only top 5 transactions
                    setTransactions(transactionResponse.transactions.slice(0, 5));
                }
            } catch (error) {
                showMessage(error.response?.data?.message || "Failed to fetch transaction data. Please try again.");
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [selectedMonth, selectedYear, selectedData]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await ApiService.getAllRequests();
                if (response.status === 200) {
                    // Show only top 5 requests
                    setRequests(response.requests.slice(0, 5));
                }
            } catch (error) {
                showMessage(error.response?.data?.message || "Failed to fetch requests. Please try again.");
            }
        };
        fetchRequests();
    }, []);

    const transformTransactionData = (transactions, month, year) => {
        const dailyData = {};
        const daysInMonths = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonths; day++) {
            dailyData[day] = { day, count: 0, amount: 0, quantity: 0 };
        }
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.createdAt);
            const transactionMonth = transactionDate.getMonth() + 1;
            const transactionYear = transactionDate.getFullYear();
            if (transactionMonth === month && transactionYear === year) {
                const day = transactionDate.getDate();
                dailyData[day].count += 1;
                dailyData[day].amount += transaction.totalPrice;
                dailyData[day].quantity += transaction.totalProducts;
            }
        });
        return Object.values(dailyData);
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value, 10));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value, 10));
    };

    const handleViewAllTransactions = () => {
        navigate("/transactions");
    };

    const handleViewAllRequests = () => {
        navigate("/requests");
    };

    const navigateToTransactionDetailsPage = (transactionId) => {
        navigate(`/transaction/${transactionId}`);
    };

    const navigateToRequestDetailsPage = (requestId) => {
        navigate(`/requests/${requestId}`);
    };

    return (
        <Layout>
            {message && <div className='message'>{message}</div>}
            <div className='dashboard-page'>
                <div className='button-group'>
                    <button onClick={() => setSelectedData("count")}>Total No Of Transactions</button>
                    <button onClick={() => setSelectedData("amount")}>Amount</button>
                    <button onClick={() => setSelectedData("quantity")}>Quantity</button>
                </div>
                <div className='dashboard-content'>
                    <div className='filter-section'>
                        <label>Select Month</label>
                        <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                        <label>Select Year</label>
                        <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                            {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className='chart-section'>
                        <div className='chart-container'>
                            <h3>Daily Transactions</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={transactionData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" label={{ value: "day", position: "insideBottomRight", offset: -5 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type={"monotone"}
                                        dataKey={selectedData}
                                        stroke="#008080" fillOpacity={0.3} fill='#008080' />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Transactions Section */}
                <div className="profile-section-card">
                    <div className="transactions-header">
                        <h2>Recent Transactions</h2>
                    </div>
                    {transactions && transactions.length > 0 ? (
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>TYPE</th>
                                    <th>STATUS</th>
                                    <th>TOTAL PRICE</th>
                                    <th>TOTAL PRODUCTS</th>
                                    <th>DATE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.transactionType}</td>
                                        <td>{transaction.transactionStatus}</td>
                                        <td>{transaction.totalPrice}</td>
                                        <td>{transaction.totalProducts}</td>
                                        <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                                        <td>
                                            <button onClick={() => navigateToTransactionDetailsPage(transaction.id)}>
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: "center" }}>No transactions found.</p>
                    )}
                    <div style={{ textAlign: "center", marginTop: "16px" }}>
                        <button onClick={handleViewAllTransactions}>View All Transactions</button>
                    </div>
                </div>

                {/* Requests Section */}
                <div className="profile-section-card">
                    <div className="transactions-header">
                        <h2>Recent Requests</h2>
                    </div>
                    {requests && requests.length > 0 ? (
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Product Name</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.id}</td>
                                        <td>{request.product?.name || "-"}</td>
                                        <td>{request.description}</td>
                                        <td>{new Date(request.createdAt).toLocaleString()}</td>
                                        <td>
                                            <button onClick={() => navigateToRequestDetailsPage(request.id)}>
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: "center" }}>No requests found.</p>
                    )}
                    <div style={{ textAlign: "center", marginTop: "16px" }}>
                        <button onClick={handleViewAllRequests}>View All Requests</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;