import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function CreateChannel() {
  const [form, setForm] = useState({
    channelName: '',
    description: '',
    channelPic: '',
    channelBanner: ''
  });

  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a channel.");
      return;
    }

    const trimmed = {
      channelName: form.channelName.trim(),
      description: form.description.trim(),
      channelPic: form.channelPic.trim(),
      channelBanner: form.channelBanner.trim()
    };

    if (!trimmed.channelName) {
      alert("Channel name is required.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/channel",
        trimmed,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setUser({ ...user, channelId: data.channelId || data._id });
      alert("Channel created!");
      navigate("/channel");
    } catch (err) {
      alert("Failed to create channel: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#181818] text-white w-full max-w-lg rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">How you'll appear</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={form.channelPic || "https://placehold.co/100x100?text=You"}
              alt="Channel avatar"
              className="w-24 h-24 rounded-full object-cover border border-gray-600"
            />
            <label className="text-blue-500 mt-2 cursor-pointer text-sm font-medium hover:underline">
              <input
                type="url"
                name="channelPic"
                placeholder="Channel picture URL"
                value={form.channelPic}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 text-sm bg-[#121212] border border-gray-700 rounded-md text-white"
              />
            </label>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              name="channelName"
              placeholder="Channel name"
              value={form.channelName}
              onChange={handleChange}
              required
              autoFocus
              className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Channel description"
              rows={2}
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-white resize-none"
            />
          </div>

          {/* Banner */}
          <div>
            <label className="block text-sm font-semibold mb-1">Banner URL (optional)</label>
            <input
              type="url"
              name="channelBanner"
              placeholder="Channel banner URL"
              value={form.channelBanner}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-md text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-md bg-transparent border border-gray-500 text-white hover:bg-[#2c2c2c]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.channelName || loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create channel"}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            By clicking Create channel, you agree to{" "}
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              YouTube's Terms of Service
            </a>.
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateChannel;
