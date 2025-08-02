import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';

function Login() {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:8000/api/login",
                form,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            setUser(data);
            navigate("/");
        } catch (err) {
            console.error("❌ Login failed:", err.response?.data?.message || err.message);
            alert("Login failed: " + (err.response?.data?.message || "Something went wrong"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                {/* YouTube Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                        alt="YouTube Logo"
                        className="h-10"
                    />
                </div>

                <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">Sign in</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <span
                        onClick={() => navigate('/register')}
                        className="text-blue-600 font-medium hover:underline cursor-pointer"
                    >
                        Sign up
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;
