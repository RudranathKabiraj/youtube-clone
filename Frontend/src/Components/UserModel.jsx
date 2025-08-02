import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

// Icons
import { MdOutlineAccountCircle, MdOutlineSwitchAccount, MdLogout, MdOutlineSettings, MdOutlineLanguage, MdOutlineLocationOn } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import { BsSun } from "react-icons/bs";
import { FaRegKeyboard } from "react-icons/fa";

function UserModal({ onClose, setShowModal }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleViewChannel = () => {
    navigate("/channel");
    setShowModal(false);
  };

  const handleCreateChannel = () => {
    navigate("/createChannel");
    setShowModal(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowModal(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-80 bg-white text-gray-900 rounded-xl shadow-xl m-4 border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover border border-gray-300"
          />
          <div>
            <div className="font-semibold">{user.username}</div>
            <div className="text-sm text-gray-500">@{user._id?.toLowerCase().replace(/\s/g, '') || 'user'}</div>
            <div
              className="text-sm text-blue-600 hover:underline cursor-pointer mt-1"
              onClick={user.channelId ? handleViewChannel : handleCreateChannel}
            >
              {user.channelId ? "View your channel" : "Create your channel"}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="text-sm">
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <MdOutlineAccountCircle size={20} />
            Google Account
          </div>
          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <MdOutlineSwitchAccount size={20} />
              Switch account
            </div>
            <FiChevronRight />
          </div>
          <div
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={handleSignOut}
          >
            <MdLogout size={20} />
            Sign out
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Settings */}
        <div className="text-sm">
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <MdOutlineSettings size={20} />
            YouTube Studio
          </div>
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <MdOutlineSettings size={20} />
            Purchases and memberships
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Preferences */}
        <div className="text-sm">
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <MdOutlineSettings size={20} />
            Your data in YouTube
          </div>
          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <BsSun size={18} />
              Appearance: Light
            </div>
            <FiChevronRight />
          </div>
          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <MdOutlineLanguage size={20} />
              Language: English
            </div>
            <FiChevronRight />
          </div>
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <MdOutlineSettings size={20} />
            Restricted Mode: Off
          </div>
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <MdOutlineLocationOn size={20} />
            Location: India
          </div>
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <FaRegKeyboard size={20} />
            Keyboard shortcuts
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
