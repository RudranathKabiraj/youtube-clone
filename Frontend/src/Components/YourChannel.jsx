import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit, MdDelete, MdUpload, MdSave, MdClose } from "react-icons/md";

function YourChannel() {
  const { sidebarOpen } = useOutletContext();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('Videos');
  const [selectedVideos, setSelectedVideos] = useState([]);
  const initialForm = { title: '', videoLink: '', thumbnail: '', description: '', category: '' };
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [showEditChannel, setShowEditChannel] = useState(false);
  const [channelEditForm, setChannelEditForm] = useState({ channelName: "", channelBanner: "", channelPic: "", description: "" });
  const [channelEditLoading, setChannelEditLoading] = useState(false);
  const [showManageVideos, setShowManageVideos] = useState(false);

  useEffect(() => {
    if (!user?.channelId) return;
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:8000/api/channel/${user.channelId}`)
      .then(res => {
        setChannel(res.data);
        setVideos(res.data.videos || []);
      })
      .catch(err => setError("Failed to load channel."))
      .finally(() => setLoading(false));
  }, [user?.channelId]);

  const descLimit = 180;
  const showMore = channel && channel.description && channel.description.length > descLimit;
  const descToShow = channel && channel.description
    ? (descExpanded ? channel.description : channel.description.slice(0, descLimit))
    : "";

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/video/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      setVideos(videos => videos.filter(v => v._id !== id));
      setMenuOpen(null);
      setSelectedVideos(selectedVideos.filter(v => v !== id));
    } catch (err) {
      alert("Failed to delete video");
    }
  };

  const handleEdit = (id) => {
    const video = videos.find(v => v._id === id);
    if (video) {
      setEditVideo(video);
      setForm({
        title: video.title || '',
        videoLink: video.videoLink || '',
        thumbnail: video.thumbnail || '',
        description: video.description || '',
        category: video.category || ''
      });
      setShowEdit(true);
    }
    setMenuOpen(null);
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
      await axios.post("http://localhost:8000/api/video", trimmed, { headers: { Authorization: `Bearer ${user.token}` } });
      const res = await axios.get(`http://localhost:8000/api/channel/${user.channelId}`);
      setChannel(res.data);
      setVideos(res.data.videos || []);
      setShowUpload(false);
      setForm(initialForm);
    } catch (err) {
      alert("Failed to upload video: " + (err.response?.data?.message || err.message));
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editVideo) return;
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
      await axios.put(`http://localhost:8000/api/video/${editVideo._id}`, trimmed, { headers: { Authorization: `Bearer ${user.token}` } });
      const res = await axios.get(`http://localhost:8000/api/channel/${user.channelId}`);
      setChannel(res.data);
      setVideos(res.data.videos || []);
      setShowEdit(false);
      setEditVideo(null);
      setForm(initialForm);
    } catch (err) {
      alert("Failed to update video: " + (err.response?.data?.message || err.message));
    } finally {
      setFormLoading(false);
    }
  };

  const openEditChannelModal = () => {
    setChannelEditForm({
      channelName: channel.channelName || "",
      channelBanner: channel.channelBanner || "",
      channelPic: channel.channelPic || "",
      description: channel.description || ""
    });
    setShowEditChannel(true);
  };

  const handleChannelEditChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => setChannelEditForm(prev => ({ ...prev, [name]: reader.result }));
      reader.readAsDataURL(file);
    } else {
      setChannelEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleChannelEditSave = async (e) => {
    e.preventDefault();
    setChannelEditLoading(true);
    const trimmed = {
      channelName: channelEditForm.channelName.trim(),
      channelBanner: channelEditForm.channelBanner.trim(),
      channelPic: channelEditForm.channelPic.trim(),
      description: channelEditForm.description.trim()
    };
    if (!trimmed.channelName) {
      alert("Channel name is required.");
      setChannelEditLoading(false);
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/updateChannel/${channel._id}`, trimmed, { headers: { Authorization: `Bearer ${user.token}` } });
      const res = await axios.get(`http://localhost:8000/api/channel/${user.channelId}`);
      setChannel(res.data);
      setShowEditChannel(false);
    } catch (err) {
      alert("Failed to update channel: " + (err.response?.data?.message || err.message));
    } finally {
      setChannelEditLoading(false);
    }
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedVideos.length} video(s)?`)) return;
    try {
      await Promise.all(selectedVideos.map(id =>
        axios.delete(`http://localhost:8000/api/video/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
      ));
      const res = await axios.get(`http://localhost:8000/api/channel/${user.channelId}`);
      setChannel(res.data);
      setVideos(res.data.videos || []);
      setSelectedVideos([]);
      setShowManageVideos(false);
    } catch (err) {
      alert("Failed to delete videos");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!channel) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Channel Header */}
      <div className="relative">
        <img src={channel.channelBanner || "https://placehold.co/600x150.png?text=Banner"} alt="Channel banner" className="w-full h-36 object-cover" />
        <div className="flex items-end p-4">
          <div className="w-20 h-20 bg-red-600 rounded-full -mt-10"></div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{channel.channelName}</h1>
            <p className="text-gray-500">@{channel.channelName?.toLowerCase().replace(/\s/g, '')}498 • {channel.subscribers} subscribers • {videos.length} videos</p>
            <p className="text-gray-500 mt-1">More about this channel...</p>
            <div className="flex space-x-2 mt-2">
              <button onClick={openEditChannelModal} className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Customize channel</button>
              <button onClick={() => setShowManageVideos(true)} className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">Manage videos</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        {['Home', 'Videos', 'Shorts', 'Playlists', 'Posts'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 cursor-pointer ${activeTab === tab ? 'border-b-2 border-red-600' : ''}`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Content Sections */}
      {activeTab === 'Videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {videos.map(video => (
            <div key={video._id} className="relative">
              <Link to={`/video/${video._id}`}>
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover rounded" />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-1 text-sm">{video.duration || "14:45"}</div>
              </Link>
              <div className="mt-2">
                <h3 className="text-sm font-semibold">{video.title}</h3>
                <p className="text-xs text-gray-500">{video.views} views • Streamed 4 years ago</p>
              </div>
              <div className="absolute top-2 right-2">
                <BsThreeDotsVertical className="cursor-pointer text-gray-700" onClick={() => setMenuOpen(menuOpen === video._id ? null : video._id)} />
                {menuOpen === video._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleEdit(video._id)}><MdEdit /> Edit</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600" onClick={() => handleDelete(video._id)}><MdDelete /> Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'Home' && <div className="p-4">Home content goes here...</div>}
      {activeTab === 'Shorts' && <div className="p-4">Shorts content goes here...</div>}
      {activeTab === 'Playlists' && <div className="p-4">Playlists content goes here...</div>}
      {activeTab === 'Posts' && <div className="p-4">Posts content goes here...</div>}

      {/* Modals */}
      {showEditChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 text-gray-900">
            <h2 className="text-xl mb-4">Edit Channel Details</h2>
            <form onSubmit={handleChannelEditSave}>
              <input name="channelName" value={channelEditForm.channelName} onChange={handleChannelEditChange} placeholder="Channel name" className="w-full p-2 mb-2 bg-gray-100 rounded" required />
              <textarea name="description" value={channelEditForm.description} onChange={handleChannelEditChange} placeholder="Channel description" className="w-full p-2 mb-2 bg-gray-100 rounded" rows={3} />
              <input name="channelBanner" type="file" accept="image/*" onChange={handleChannelEditChange} className="w-full p-2 mb-2 bg-gray-100 rounded" />
              <input name="channelPic" type="file" accept="image/*" onChange={handleChannelEditChange} className="w-full p-2 mb-2 bg-gray-100 rounded" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowEditChannel(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 text-gray-900">
            <h2 className="text-xl mb-4">Upload Video</h2>
            <form onSubmit={handleUploadSubmit}>
              <input name="title" value={form.title} onChange={handleFormChange} placeholder="Video title" className="w-full p-2 mb-2 bg-gray-100 rounded" required />
              <input name="videoLink" value={form.videoLink} onChange={handleFormChange} placeholder="Video file URL" className="w-full p-2 mb-2 bg-gray-100 rounded" required />
              <input name="thumbnail" value={form.thumbnail} onChange={handleFormChange} placeholder="Thumbnail image URL" className="w-full p-2 mb-2 bg-gray-100 rounded" required />
              <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Video description" className="w-full p-2 mb-2 bg-gray-100 rounded" rows={2} />
              <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" className="w-full p-2 mb-2 bg-gray-100 rounded" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 text-gray-900">
            <h2 className="text-xl mb-4">Edit Video</h2>
            <form onSubmit={handleEditSubmit}>
              <input name="title" value={form.title} onChange={handleFormChange} placeholder="Video title" className="w-full p-2 mb-2 bg-gray-100 rounded" required />
              <input name="videoLink" value={form.videoLink} onChange={handleFormChange} placeholder="Video file URL" className="w-full p-2 mb-2 bg-gray-100 rounded" required />
              <input name="thumbnail" value={form.thumbnail} onChange={handleFormChange} placeholder="Thumbnail image URL" className="w-full p-2 mb-2 bg-gray-100 rounded" required />
              <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Video description" className="w-full p-2 mb-2 bg-gray-100 rounded" rows={2} />
              <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" className="w-full p-2 mb-2 bg-gray-100 rounded" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => { setShowEdit(false); setEditVideo(null); }} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showManageVideos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 text-gray-900">
            <h2 className="text-xl mb-4">Manage Videos</h2>
            <div className="mb-4">
              {videos.map(video => (
                <div key={video._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video._id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedVideos([...selectedVideos, video._id]);
                      else setSelectedVideos(selectedVideos.filter(id => id !== video._id));
                    }}
                    className="mr-2"
                  />
                  <span>{video.title}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete Selected</button>
              <button onClick={() => setShowManageVideos(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YourChannel;