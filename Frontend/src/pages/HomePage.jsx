import React from 'react';
import VideoList from '../Components/VideoList.jsx';
import { useOutletContext } from 'react-router-dom';

// Homepage: shows video list and handles sidebar state
function Homepage() {
  const { sidebarOpen } = useOutletContext();

  return (
    <div className={`transition-all duration-300`}
    >
        <VideoList sidebarOpen={sidebarOpen} /> {/* call VideoList from here and send sideBar prop */}
   </div>
  );
}

export default Homepage;
