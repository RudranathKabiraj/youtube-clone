import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function Video({ _id, title, channel, views, thumbnail, uploadDate }) {
  return (
    <div className="w-full">
      {/* Thumbnail */}
      <Link to={`/video/${_id}`}>
        <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition duration-300 hover:brightness-90"
          />
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <Link to={`/channels/${channel._id}`}>
          <img
            src={channel.channelPic}
            alt={channel.channelName}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        </Link>

        {/* Textual Info */}
        <div className="flex flex-col overflow-hidden">
          {/* Title */}
          <Link
            to={`/video/${_id}`}
            className="text-sm font-medium text-gray-900 dark:text-black  line-clamp-2"
          >
            {title}
          </Link>

          {/* Channel Name */}
          <Link
            to={`/channels/${channel._id}`}
            className="text-xs text-gray-600 dark:text-gray-400 hover:underline truncate"
          >
            {channel.channelName}
          </Link>

          {/* Views + Date */}
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {views} views
            {uploadDate && (
              <span className="ml-1">
                • {formatDistanceToNow(new Date(uploadDate), {
                  addSuffix: true,
                }).replace('about ', '')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
