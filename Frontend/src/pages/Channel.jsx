import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx' // import context for logged in user
import YourChannel from '../Components/YourChannel.jsx'; // import your channel
import CreateChannel from '../Components/CreateChannel.jsx'; // import creat channel
import { useOutletContext } from 'react-router-dom' // import outlet for props

// Channel page: shows either YourChannel or CreateChannel based on user state
function Channel() {
    const { sidebarOpen } = useOutletContext(); // get sidebar from context
    const {user} = useAuth(); // get logged in user from global context

    // if user has channel, show channel, else show create channel component
    return (
        <div className='channel-page'>
            {user?.channelId ? <YourChannel />:<CreateChannel />}
        </div>
    )
}

export default Channel // export channel component page