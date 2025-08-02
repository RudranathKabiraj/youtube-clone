import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import UserModal from './UserModel.jsx';
import axios from 'axios';

import { RxHamburgerMenu } from 'react-icons/rx';
import { CiSearch } from 'react-icons/ci';
import { FaBell } from 'react-icons/fa';
import { RiVideoUploadLine } from 'react-icons/ri';
import { BsMic, BsMicMute } from 'react-icons/bs';

function Header({ sidebarOpen, setSidebarOpen, searchedVal, setSearchedVal, onSearch }) {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const [form, setForm] = useState({
        title: '',
        videoLink: '',
        thumbnail: '',
        description: '',
        category: ''
    });

    const handleSearchInput = (e) => {
        setSearchedVal(e.target.value); // Do NOT search here
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(); // Trigger only on Enter or search button click
    };

    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchedVal(prev => (prev + ' ' + transcript).trim()); // Just update input, don't search
        };
        recognition.onerror = () => setListening(false);

        recognition.start();
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const trimmed = {
            title: form.title.trim(),
            videoLink: form.videoLink.trim(),
            thumbnail: form.thumbnail.trim(),
            description: form.description.trim(),
            category: form.category.trim()
        };

        if (!trimmed.title || !trimmed.videoLink || !trimmed.thumbnail) {
            alert("Please fill in all required fields.");
            setFormLoading(false);
            return;
        }

        try {
            await axios.post(
                "http://localhost:8000/api/video",
                trimmed,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert("Video uploaded!");
            setShowUpload(false);
            setForm({
                title: '',
                videoLink: '',
                thumbnail: '',
                description: '',
                category: ''
            });
        } catch (err) {
            alert("Failed to upload video: " + (err.response?.data?.message || err.message));
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <>
            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-[3000]">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg mx-4 sm:mx-0">
                        <h2 className="text-xl font-semibold mb-4 text-black">Upload Video</h2>
                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                            <input className="w-full px-3 sm:px-4 py-2 rounded border text-sm sm:text-base" name="title" type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required autoFocus />
                            <input className="w-full px-3 sm:px-4 py-2 rounded border text-sm sm:text-base" name="videoLink" type="url" placeholder="Video Link" value={form.videoLink} onChange={e => setForm({ ...form, videoLink: e.target.value })} required />
                            <input className="w-full px-3 sm:px-4 py-2 rounded border text-sm sm:text-base" name="thumbnail" type="url" placeholder="Thumbnail URL" value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} required />
                            <textarea className="w-full px-3 sm:px-4 py-2 rounded border text-sm sm:text-base" name="description" placeholder="Description" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            <input className="w-full px-3 sm:px-4 py-2 rounded border text-sm sm:text-base" name="category" type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                            <div className="flex justify-end gap-2 sm:gap-4">
                                <button type="button" onClick={() => setShowUpload(false)} className="px-3 sm:px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm sm:text-base" disabled={formLoading}>Cancel</button>
                                <button type="submit" disabled={!form.title || !form.videoLink || !form.thumbnail || formLoading} className="px-3 sm:px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base disabled:opacity-50">
                                    {formLoading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white text-black shadow-sm flex items-center justify-between px-2 sm:px-4 h-12 sm:h-14 border-b border-gray-200">
                {/* Left: Menu + Logo */}
                <div className="flex items-center gap-2 sm:gap-4 min-w-[80px] sm:min-w-[120px]">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-lg sm:text-xl hover:bg-gray-100 p-1 sm:p-2 rounded-full">
                        <RxHamburgerMenu />
                    </button>
                    <Link to="/" className="flex items-center gap-1">
                        <img src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg" alt="YouTube" className="h-4 sm:h-5 md:h-6" />
                    </Link>
                </div>

                {/* Center: Search */}
                <form onSubmit={handleSearchSubmit} className="flex flex-1 justify-center max-w-xs sm:max-w-md md:max-w-2xl">
                    <div className="flex w-full max-w-xs sm:max-w-md md:max-w-xl border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
                        <div className="flex items-center px-3 text-gray-500">
                            <CiSearch className="text-lg sm:text-xl" />
                        </div>
                        <input
                            type="text"
                            value={searchedVal}
                            onChange={handleSearchInput}
                            placeholder="Search"
                            className="w-full px-2 sm:px-4 py-1 text-xs sm:text-sm outline-none text-gray-800 bg-transparent"
                        />
                        {searchedVal && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchedVal('');
                                    setSearchActive(false);
                                }}
                                className="px-2 text-gray-400 hover:text-gray-600"
                            >
                                &#10005; {/* Unicode X or use <RxCross2 /> from react-icons */}
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-2 sm:px-4 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                        >
                            <CiSearch className="text-lg sm:text-xl" />
                        </button>
                    </div>
                    <button
                        type="button"
                        className="ml-1 sm:ml-2 p-1 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                        onClick={handleMicClick}
                    >
                        {listening ? (
                            <BsMicMute className="text-base sm:text-lg text-red-500" />
                        ) : (
                            <BsMic className="text-base sm:text-lg" />
                        )}
                    </button>
                </form>

                {/* Right: Upload + Notifications + User */}
                <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
                    {user?.channelId && (
                        <button onClick={() => setShowUpload(true)} className="hover:bg-gray-100 p-1 sm:p-2 rounded-full text-lg sm:text-xl">
                            <RiVideoUploadLine />
                        </button>
                    )}
                    {user && (
                        <button className="hover:bg-gray-100 p-1 sm:p-2 rounded-full text-lg sm:text-xl">
                            <FaBell />
                        </button>
                    )}
                    {user ? (
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt="User"
                                onClick={() => setShowModal(v => !v)}
                                className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover cursor-pointer"
                            />
                            {showModal && (
                                <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-[3000]">
                                    <div className="bg-white rounded-lg p-2 sm:p-4 w-48 sm:w-64">
                                        <UserModal setShowModal={setShowModal} onClose={() => setShowModal(false)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="px-4 py-1.5 text-xs sm:text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            >
                                Register
                            </Link>
                        </div>

                    )}
                </div>
            </header>
        </>
    );
}

export default Header;