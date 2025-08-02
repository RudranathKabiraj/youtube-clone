import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";

function Channels() {
    const { id } = useParams();
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [descExpanded, setDescExpanded] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user?.channelId === id) navigate("/channel");

    useEffect(() => {
        setLoading(true);
        setError(null);
        axios
            .get(`http://localhost:8000/api/channel/${id.replace(':', '')}`)
            .then(res => setChannel(res.data))
            .catch(() => setError("Failed to load channel"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!channel) return null;

    const descLimit = 180;
    const showMore = channel.description && channel.description.length > descLimit;
    const descToShow = descExpanded || !showMore
        ? channel.description
        : channel.description.slice(0, descLimit);

    return (
        <div className="flex flex-col flex-1">
            <div className="w-full">
                <img
                    src={channel.channelBanner || "https://placehold.co/600x150.png?text=Banner"}
                    alt="Channel banner"
                    className="w-full h-40 object-cover"
                />
            </div>

            <div className="flex p-6 gap-4 items-start border-b">
                <img
                    src={channel.channelPic || "https://placehold.co/100x100.png?text=?"}
                    alt={channel.channelName}
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex flex-col flex-1">
                    <h2 className="text-2xl font-semibold">{channel.channelName}</h2>
                    <div className="text-sm text-gray-500 space-x-2 mt-1">
                        <span>@{channel.channelName?.toLowerCase().replace(/\s/g, '')}-ic4ou</span>
                        <span>·</span>
                        <span>{channel.subscribers} subscribers</span>
                        <span>·</span>
                        <span>{channel.videos?.length || 0} videos</span>
                    </div>

                    <div className="mt-2 text-gray-700 text-sm">
                        {descToShow}
                        {showMore && !descExpanded && (
                            <span
                                className="text-blue-500 cursor-pointer ml-1"
                                onClick={() => setDescExpanded(true)}
                            >
                                ...more
                            </span>
                        )}
                        {showMore && descExpanded && (
                            <span
                                className="text-blue-500 cursor-pointer ml-1"
                                onClick={() => setDescExpanded(false)}
                            >
                                Show less
                            </span>
                        )}
                    </div>

                    <div className="mt-4">
                        <button className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90 transition">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex space-x-6 border-b px-6 py-3 text-sm font-medium">
                <div className="cursor-pointer hover:text-black text-gray-600">Home</div>
                <div className="cursor-pointer text-black border-b-2 border-black">Videos</div>
                <div className="cursor-pointer hover:text-black text-gray-600">Shorts</div>
                <div className="cursor-pointer hover:text-black text-gray-600">Playlists</div>
                <div className="cursor-pointer hover:text-black text-gray-600">Posts</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {(channel.videos || []).map(video => (
                    <div key={video._id} className="flex flex-col">
                        <Link to={`/video/${video._id}`}>
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-48 object-cover rounded-md"
                            />
                        </Link>
                        <div className="mt-2 text-sm">
                            <div className="font-medium text-gray-900">{video.title}</div>
                            <div className="text-gray-500 text-xs mt-1 space-x-1">
                                <span>{video.views} views</span>
                                <span>·</span>
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
                        </div>
                        <div className="mt-1 text-right text-gray-500 text-xl">
                            <BsThreeDotsVertical className="inline-block cursor-pointer" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Channels;
