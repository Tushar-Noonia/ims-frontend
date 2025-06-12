import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";

const LoginPage = () => {
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [message,setMessage]= useState("");

    const navigate= useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginData={
                email,
                password,
            }
            const res=await ApiService.login(loginData);
            console.log("Login response:", res);
            if(res.status===200)
            {
                ApiService.saveToken(res.token);
                ApiService.saveRole(res.role);
                setMessage(res.message);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            showMessage(error.response?.data?.message || "Login failed. Please try again.");
        }
    };


    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };


    return (
        <div className="auth-container">
            <h2>Login</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    )
}

export default LoginPage;