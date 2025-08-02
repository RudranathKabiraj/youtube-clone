import React from 'react';
import { Link } from 'react-router-dom';

// Icons
import {
  IoMdHome,
  IoMdTime,
} from 'react-icons/io';
import {
  SiYoutubeshorts,
} from 'react-icons/si';
import {
  MdSubscriptions,
  MdOutlineVideoLibrary,
  MdOutlineWatchLater,
  MdThumbUpAlt,
  MdOutlineExplore,
  MdOutlineShoppingBag,
  MdOutlinePodcasts,
  MdOutlineFeedback,
  MdHelpOutline,
  MdSettings
} from 'react-icons/md';
import {
  RiHistoryLine
} from 'react-icons/ri';
import {
  FaYoutube,
  FaYoutubeSquare,
  FaRegUser
} from 'react-icons/fa';

const SideBar = ({ sidebarOpen }) => {
  const itemClass = 'flex items-center gap-2 sm:gap-4 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer';
  const sectionTitleClass = 'text-xs sm:text-sm text-gray-500 font-semibold px-2 mt-4 mb-1 uppercase';

  return (
    <nav
      className={`h-screen overflow-y-auto bg-white text-black border-r border-gray-200 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-16 sm:w-20 md:w-60 px-1 sm:px-2 md:px-3' : 'w-12 sm:w-16 md:w-20 px-1 sm:px-2'
      } py-4 flex flex-col text-xs sm:text-sm ${sidebarOpen ? '' : 'overflow-hidden'}`}
      style={{ minWidth: sidebarOpen ? '60px' : '48px' }}
    >
      {/* Main Section */}
      <div className="space-y-2">
        <Link to="/" className={itemClass}>
          <IoMdHome size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Home</span>}
        </Link>
        <Link to="/shorts" className={itemClass}>
          <SiYoutubeshorts size={18} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Shorts</span>}
        </Link>
        <Link to="/subscriptions" className={itemClass}>
          <MdSubscriptions size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Subscriptions</span>}
        </Link>
      </div>

      <hr className="my-3 border-gray-200" />

      {/* Library Section */}
      <div className="space-y-2">
        <Link to="/library" className={itemClass}>
          <MdOutlineVideoLibrary size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Library</span>}
        </Link>
        <Link to="/history" className={itemClass}>
          <RiHistoryLine size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">History</span>}
        </Link>
        <Link to="/watch-later" className={itemClass}>
          <MdOutlineWatchLater size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Watch Later</span>}
        </Link>
        <Link to="/liked" className={itemClass}>
          <MdThumbUpAlt size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Liked Videos</span>}
        </Link>
      </div>

      <hr className="my-3 border-gray-200" />

      {/* Subscriptions */}
      {sidebarOpen && <div className={sectionTitleClass}>Subscriptions</div>}
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={itemClass}>
            <FaRegUser size={20} className="shrink-0" />
            {sidebarOpen && <span className="hidden md:block">Channel {i + 1}</span>}
          </div>
        ))}
        {sidebarOpen && (
          <div className={itemClass}>
            <span className="text-blue-600 font-medium hidden md:block">Show more</span>
          </div>
        )}
      </div>

      <hr className="my-3 border-gray-200" />

      {/* Explore */}
      {sidebarOpen && <div className={sectionTitleClass}>Explore</div>}
      <div className="space-y-2">
        <div className={itemClass}>
          <MdOutlineShoppingBag size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Shopping</span>}
        </div>
        {["Music", "Films", "Live", "Gaming", "News", "Sport", "Courses"].map((item) => (
          <div key={item} className={itemClass}>
            <MdOutlineExplore size={20} className="shrink-0" />
            {sidebarOpen && <span className="hidden md:block">{item}</span>}
          </div>
        ))}
        <div className={itemClass}>
          <MdOutlinePodcasts size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Podcasts</span>}
        </div>
      </div>

      <hr className="my-3 border-gray-200" />

      {/* More from YouTube */}
      {sidebarOpen && <div className={sectionTitleClass}>More from YouTube</div>}
      <div className="space-y-2">
        <div className={itemClass}>
          <FaYoutube size={20} className="text-red-500 shrink-0" />
          {sidebarOpen && <span className="hidden md:block">YouTube Premium</span>}
        </div>
        <div className={itemClass}>
          <FaYoutubeSquare size={20} className="text-red-500 shrink-0" />
          {sidebarOpen && <span className="hidden md:block">YouTube Studio</span>}
        </div>
        <div className={itemClass}>
          <FaYoutube size={20} className="text-red-500 shrink-0" />
          {sidebarOpen && <span className="hidden md:block">YouTube Music</span>}
        </div>
        <div className={itemClass}>
          <FaYoutube size={20} className="text-red-500 shrink-0" />
          {sidebarOpen && <span className="hidden md:block">YouTube Kids</span>}
        </div>
      </div>

      <hr className="my-3 border-gray-200" />

      {/* Settings */}
      <div className="space-y-2">
        <Link to="/settings" className={itemClass}>
          <MdSettings size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Settings</span>}
        </Link>
        <Link to="/report-history" className={itemClass}>
          <IoMdTime size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Report History</span>}
        </Link>
        <Link to="/help" className={itemClass}>
          <MdHelpOutline size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Help</span>}
        </Link>
        <Link to="/feedback" className={itemClass}>
          <MdOutlineFeedback size={20} className="shrink-0" />
          {sidebarOpen && <span className="hidden md:block">Send Feedback</span>}
        </Link>
      </div>
    </nav>
  );
};

export default SideBar;
