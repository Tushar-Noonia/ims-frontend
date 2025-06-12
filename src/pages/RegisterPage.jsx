import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";

const RegisterPage = () => {
    const [name,setName]= useState("");
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [phoneNumber,setPhoneNumber]= useState("");
    const [message,setMessage]= useState("");

    const navigate= useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const registerData={
                name,
                email,
                phoneNumber,
                password,
            }
            await ApiService.register(registerData);
            setMessage("Registration successful! Redirecting to login...");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            showMessage(error.response?.data?.message || "Registration failed. Please try again.");
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
            <h2>Register</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    )
}

export default RegisterPage;