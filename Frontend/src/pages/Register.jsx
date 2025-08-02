import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        avatar: '',
        password: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const username = form.username.trim();
        const email = form.email.trim();
        const password = form.password.trim();
        let avatar = form.avatar.trim();

        if (!username || !email || !password) {
            alert("Please fill in all required fields without empty spaces.");
            return;
        }

        if (!avatar) {
            const initial = username.charAt(0).toUpperCase();
            avatar = `https://placehold.co/40x40.png?text=${initial}`;
        }

        try {
            const { data } = await axios.post(
                "http://localhost:8000/api/register",
                { username, email, avatar, password },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            alert("✅ User registered successfully, please login.");
            navigate("/login");

        } catch (err) {
            console.error("❌ Registration failed:", err.response?.data?.message || err.message);
            alert("Registration failed: " + (err.response?.data?.message || "Something went wrong"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                        alt="YouTube Logo"
                        className="h-10"
                    />
                </div>

                <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
                    Create your account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="your username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

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
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                            Avatar URL <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <input
                            id="avatar"
                            name="avatar"
                            type="url"
                            placeholder="https://..."
                            value={form.avatar}
                            onChange={handleChange}
                            autoComplete="photo"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            placeholder="your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-red-600 font-medium hover:underline cursor-pointer"
                    >
                        Sign in
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Register;
