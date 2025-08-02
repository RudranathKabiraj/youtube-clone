import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { STATIC_RECOMMENDED } from "../assets/recommendedVideos.js"; // import recommended videos from Assets
import { useAuth } from "../contexts/AuthContext.jsx"; // import logged in user from context
import { formatDistanceToNow } from "date-fns";
import axios from "axios"; // import axios for calling APIs

// import icons from react-icons library
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdShare } from "react-icons/io";
import { MdDownload } from "react-icons/md";

// Video player page: shows video, channel info, comments, recommended videos
function VideoPlayer() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [allVideos, setAllVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  // Fetch video and comments
  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      axios.get("http://localhost:8000/api/videos"),
      axios.get(`http://localhost:8000/api/video/${videoId}`),
      axios.get(`http://localhost:8000/api/comment/${videoId}`),
    ])
      .then(([videos, videoRes, commentRes]) => {
        setAllVideos(videos.data);
        setVideo(videoRes.data);
        setLikeCount(videoRes.data.likes || 0);
        setDislikeCount(videoRes.data.dislikes || 0);
        const sortedComments = (commentRes.data || []).slice().sort((a, b) => {
          const aTime = new Date(a.timestamp || a.createdAt).getTime();
          const bTime = new Date(b.timestamp || b.createdAt).getTime();
          return bTime - aTime;
        });
        setComments(
          sortedComments.map((c) => ({
            _id: c._id,
            username: c.user?.username || "Unknown",
            avatar: c.user?.avatar || "https://placehold.co/40x40.png?text=?",
            text: c.text,
            timestamp: c.timestamp || c.createdAt,
            userId: c.user?._id,
          }))
        );

        if (user) {
          setLiked(videoRes.data.likedBy?.includes(user._id));
          setDisliked(videoRes.data.dislikedBy?.includes(user._id));
        } else {
          setLiked(false);
          setDisliked(false);
        }
      })
      .catch((err) => {
        setError("Failed to load video.");
      })
      .finally(() => setLoading(false));
  }, [videoId, user]);

  // Like/dislike logic (persist to backend)
  const handleLike = async () => {
    if (!user) return;
    try {
      if (liked) {
        const res = await axios.patch(
          `http://localhost:8000/api/video/${videoId}/unlike`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setLiked(false);
        setLikeCount(res.data.likes);
        setDislikeCount(res.data.dislikes);
      } else {
        const res = await axios.patch(
          `http://localhost:8000/api/video/${videoId}/like`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setLiked(true);
        setDisliked(false);
        setLikeCount(res.data.likes);
        setDislikeCount(res.data.dislikes);
      }
    } catch (err) {
      alert("Failed to update like");
    }
  };

  const handleDislike = async () => {
    if (!user) return;
    try {
      if (disliked) {
        const res = await axios.patch(
          `http://localhost:8000/api/video/${videoId}/undislike`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setDisliked(false);
        setLikeCount(res.data.likes);
        setDislikeCount(res.data.dislikes);
      } else {
        const res = await axios.patch(
          `http://localhost:8000/api/video/${videoId}/dislike`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setDisliked(true);
        setLiked(false);
        setLikeCount(res.data.likes);
        setDislikeCount(res.data.dislikes);
      }
    } catch (err) {
      alert("Failed to update dislike");
    }
  };

  // Add comment logic (POST to backend, then fetch comments)
  const handleComment = async () => {
    if (!user || !comment.trim()) return;
    try {
      await axios.post(
        "http://localhost:8000/api/comment",
        { text: comment, videoId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Fetch updated comments from backend
      const res = await axios.get(
        `http://localhost:8000/api/comment/${videoId}`
      );

      // Sort comments by timestamp/createdAt descending (latest first)
      const sortedComments = (res.data || []).slice().sort((a, b) => {
        const aTime = new Date(a.timestamp || a.createdAt).getTime();
        const bTime = new Date(b.timestamp || b.createdAt).getTime();
        return bTime - aTime;
      });
      setComments(
        sortedComments.map((c) => ({
          _id: c._id,
          username: c.user?.username || "Unknown",
          avatar: c.user?.avatar || "https://placehold.co/40x40.png?text=?",
          text: c.text,
          timestamp: c.timestamp || c.createdAt,
          userId: c.user?._id,
        }))
      );
      setComment("");
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  // Delete comment logic (DELETE to backend, then fetch comments)
  const handleDelete = async (id) => {
    if (!user) return;
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/comment/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Always fetch updated comments from backend after delete
      const res = await axios.get(
        `http://localhost:8000/api/comment/${videoId}`
      );
      // Sort comments by timestamp/createdAt descending (latest first)
      const sortedComments = (res.data || []).slice().sort((a, b) => {
        const aTime = new Date(a.timestamp || a.createdAt).getTime();
        const bTime = new Date(b.timestamp || b.createdAt).getTime();
        return bTime - aTime;
      });
      setComments(
        sortedComments.map((c) => ({
          _id: c._id,
          username: c.user?.username || "Unknown",
          avatar: c.user?.avatar || "https://placehold.co/40x40.png?text=?",
          text: c.text,
          timestamp: c.timestamp || c.createdAt,
          userId: c.user?._id,
        }))
      );
      setMenuOpen(null);
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  // Edit comment logic (PATCH to backend, then fetch comments)
  const handleEdit = (comment) => {
    setEditId(comment._id);
    setEditText(comment.text);
    setMenuOpen(null);
  };

  const handleEditSave = async (id) => {
    if (!user || !editText.trim()) return;
    try {
      await axios.patch(
        `http://localhost:8000/api/comment/${id}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Fetch updated comments from backend
      const res = await axios.get(
        `http://localhost:8000/api/comment/${videoId}`
      );
      // Sort comments by timestamp/createdAt descending (latest first)
      const sortedComments = (res.data || []).slice().sort((a, b) => {
        const aTime = new Date(a.timestamp || a.createdAt).getTime();
        const bTime = new Date(b.timestamp || b.createdAt).getTime();
        return bTime - aTime;
      });
      setComments(
        sortedComments.map((c) => ({
          _id: c._id,
          username: c.user?.username || "Unknown",
          avatar: c.user?.avatar || "https://placehold.co/40x40.png?text=?",
          text: c.text,
          timestamp: c.timestamp || c.createdAt,
          userId: c.user?._id,
        }))
      );
      setEditId(null);
      setEditText("");
    } catch (err) {
      alert("Failed to edit comment");
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditText("");
  };

  // Description expand and collapse logic
  const descLimit = 180;
  const showMore =
    video && video.description && video.description.length > descLimit;
  const descToShow =
    video && video.description
      ? descExpanded
        ? video.description
        : video.description.slice(0, descLimit)
      : "";

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error) return <div style={{ padding: 32, color: "red" }}>{error}</div>;
  if (!video) return null;

  // Check if the current user is the owner of the video's channel
  const isOwnVideo = user && video.channel?.owner === user._id;

  // return JSX
  return (
    <div className="w-full px-4 py-5 pb-20 flex flex-col lg:flex-row lg:items-start gap-6 max-w-screen-xl mx-auto">
      <div className="w-full lg:w-[70%]">
        <div className="flex-1">
          {/* Video player */}
          <div className="relative w-full aspect-video mb-4 overflow-hidden rounded-xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${video.videoLink}?autoplay=1&rel=0&mute=0&playsinline=1`}
              className="w-full h-full"
              title={video.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
          {/* Video title */}
          <h1 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3">
            {video.title}
          </h1>

          {/* Channel + Subscribe row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4">
            <div className="flex items-center gap-4">
              {/* Channel pic */}
              <Link to={`/channels/${video?.channel?._id}`}>
                <img
                  src={video.channel?.channelPic}
                  alt={video.channel?.channelName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>

              {/* Channel name & subscribers */}
              <Link
                to={`/channels/${video?.channel?._id}`}
                className="flex flex-col"
              >
                <span className="text-sm font-medium text-black dark:text-white">
                  {video.channel?.channelName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {video.channel?.subscribers?.toLocaleString() || 0} subscribers
                </span>
              </Link>
            </div>

            {/* Subscribe button, hidden if user is the channel owner */}
            {!isOwnVideo && (
              <button
                onClick={() => setSubscribed(!subscribed)}
                className={`text-sm font-medium px-4 py-2 rounded-full transition 
                  ${subscribed 
                    ? 'bg-gray-300 text-black hover:bg-gray-400' 
                    : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>

          {user && (
            <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-2">
              <button
                onClick={handleLike}
                disabled={!user}
                title={!user ? "Login to like" : ""}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition 
                  ${
                    liked
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }
                  disabled:opacity-50`}
              >
                {liked ? (
                  <AiFillLike className="text-lg" />
                ) : (
                  <AiOutlineLike className="text-lg" />
                )}
                <span>{likeCount}</span>
              </button>

              <button
                onClick={handleDislike}
                disabled={!user}
                title={!user ? "Login to dislike" : ""}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition 
                  ${
                    disliked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }
                  disabled:opacity-50`}
              >
                {disliked ? (
                  <AiFillDislike className="text-lg" />
                ) : (
                  <AiOutlineDislike className="text-lg" />
                )}
                <span>{dislikeCount}</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                <IoMdShare className="text-lg" />
                <span>Share</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                <MdDownload className="text-lg" />
                <span>Download</span>
              </button>

              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                <BsThreeDotsVertical className="text-xl" />
              </button>
            </div>
          )}
        </div>

        {/* Video Description Section */}
        <div className="mt-4 p-4 rounded-xl bg-gray-100  text-sm dark:text-black">
          {/* Meta: Views and Date */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-900 mb-2">
            <span>{(video.views || 0).toLocaleString()} views</span>
            <span>•</span>
            <span>
              {video.uploadDate
                ? new Date(video.uploadDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>

          {/* Description Text */}
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {descToShow}
            {showMore && !descExpanded && (
              <span
                className="text-blue-600 ml-1 cursor-pointer hover:underline"
                onClick={() => setDescExpanded(true)}
              >
                ...more
              </span>
            )}
            {showMore && descExpanded && (
              <span
                className="text-blue-600 ml-2 cursor-pointer hover:underline"
                onClick={() => setDescExpanded(false)}
              >
                Show less
              </span>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="mt-6 w-full max-w-5xl px-4 sm:px-6 lg:px-0">
          {/* Comments Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {comments.length} Comments
          </h2>

          {/* Add Comment Box */}
          <div className="flex items-start gap-3 mb-6">
            <img
              src={user?.avatar || "https://placehold.co/40.png?text=?"}
              alt={user?.username || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 space-y-2">
              <input
                className="w-full px-4 py-2 rounded-full bg-gray-100  text-sm focus:outline-none focus:ring focus:ring-blue-500"
                placeholder={user ? "Add a comment..." : "Login to comment"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                disabled={!user}
              />
              <div>
                <button
                  className="mt-1 px-4 py-1.5 text-sm rounded-full bg-blue-600 text-white disabled:opacity-50"
                  onClick={handleComment}
                  disabled={!user || !comment.trim()}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comment List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div className="flex items-start gap-3" key={comment._id}>
                {/* Avatar */}
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  {/* Comment Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm  dark:text-black">
                      <span className="font-medium">{comment.username}</span>
                      <span className="text-gray-900 dark:text-gray-900 text-xs">
                        {comment.timestamp
                          ? new Date(comment.timestamp).toLocaleDateString()
                          : ""}
                      </span>
                    </div>

                    {/* Comment Dropdown (Edit/Delete) */}
                    {user && comment.userId === user._id && (
                      <div className="relative">
                        <button
                          className="text-gray-700"
                          onClick={() =>
                            setMenuOpen(
                              menuOpen === comment._id ? null : comment._id
                            )
                          }
                        >
                          <BsThreeDotsVertical />
                        </button>
                        {menuOpen === comment._id && (
                          <div className="absolute right-0 mt-2 w-28 bg-white  border rounded shadow-md z-10 text-sm">
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-500 dark:hover:bg-neutral-100"
                              onClick={() => handleEdit(comment)}
                            >
                              Edit
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                              onClick={() => handleDelete(comment._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Comment Body or Edit Field */}
                  <div className="mt-1 text-sm text-gray-700 dark:text-gray-900  whitespace-pre-wrap">
                    {editId === comment._id ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                        <input
                          className="flex-1 px-3 py-1.5 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md disabled:opacity-50"
                            onClick={() => handleEditSave(comment._id)}
                            disabled={!editText.trim()}
                          >
                            Save
                          </button>
                          <button
                            className="px-4 py-1.5 bg-gray-200 dark:bg-neutral-600 text-gray-800 dark:text-white text-sm rounded-md"
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      comment.text
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Video Section */}
      <div className="w-full lg:w-[30%] px-4 lg:px-0 mt-6 lg:mt-0">
        <h3 className="text-base font-medium text-gray-900 mb-4">Up next</h3>

        <div className="space-y-3">
          {allVideos.map((v) => (
            <Link
              to={`/video/${v._id}`}
              key={v._id}
              className="flex items-start gap-3 hover:bg-gray-100 p-2 rounded-lg transition"
            >
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-40 h-24 object-cover rounded-md bg-gray-200 flex-shrink-0"
              />
              <div className="flex flex-col flex-1">
                <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                  {v.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">Channel Name</p>
                <p className="text-xs text-gray-600">10K views • 2 days ago</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;