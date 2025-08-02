import React from 'react'
import { Link } from 'react-router-dom' 
import { BsYoutube } from 'react-icons/bs' // import youtube icon from react-icons

// Not Found errorElement page component for 'User Experience' (Link back to Home)
function NotFound() {

  // return JSX
  return (
    <div className="notfound-container">
      <div className="notfound-logo-row">
        <BsYoutube color='#FF0000' size={'3rem'} />
        <span className="notfound-youtube">YouTube</span>
      </div>
      <div className="notfound-404">404</div>
      <div className="notfound-message">This page isn't available. Sorry about that.</div>

      {/* Link back to Homepage */}
      <Link to="/" className="notfound-home-link">
        Go to YouTube Home
      </Link>
    </div>
  )
}

export default NotFound; // export NotFound page component