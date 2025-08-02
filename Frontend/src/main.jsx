import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // import router provider
import { AuthProvider } from "./contexts/AuthContext.jsx"; // import logged in user
import { StrictMode, lazy, Suspense } from "react"; // import LAZY LOADING and suspense
import { BsYoutube } from "react-icons/bs"; // import youtube icon from react-icons library
import NotFound from "./pages/NotFound.jsx"; // import not found 404 page
import "./App.css";

// Lazy load all main pages/components for performance
const App = lazy(() => import("./App.jsx"));
const VideoPlayer = lazy(() => import("./pages/VideoPlayer.jsx"));
const Homepage = lazy(() => import("./pages/Homepage.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const CreateChannel = lazy(() => import("./Components/CreateChannel.jsx"));
const Channel = lazy(() => import("./pages/Channel.jsx"));
const Channels = lazy(() => import("./pages/Channels.jsx"));

// Custom loading fallback styled like YouTube
const LoadingFallback = () => (
  <div style={{minHeight: "60vh",display: "flex",flexDirection: "column",alignItems: "center",justifyContent: "center",background: "#fff",}}>
    <div style={{display: "flex",alignItems: "center",marginBottom: 18,}}>
      <BsYoutube color="#FF0000" size={"3rem"} />
      <span style={{fontWeight: 700,fontSize: "2rem",color: "#222",letterSpacing: "-0.04em",fontFamily: "Arial, sans-serif",}}>
        YouTube
      </span>
    </div>
    <div style={{width: 120,height: 4,borderRadius: 2,background: "#e5e5e5",overflow: "hidden",position: "relative",}}>
      <div style={{width: 60,height: 4,background: "#FF0000",borderRadius: 2,position: "absolute",left: 0,top: 0,animation: "ytbar 1.2s cubic-bezier(.4,0,.2,1) infinite",}}/>
      <style>
        {`@keyframes ytbar {
          0% { left: -60px; width: 60px; }
          50% { left: 60px; width: 60px; }
          100% { left: 120px; width: 60px; }
        }`}
      </style>
    </div>
    <div style={{marginTop: 24,fontSize: "1.1rem",color: "#606060",fontWeight: 500,letterSpacing: "0.01em",}}>
      Loading...
    </div>
  </div>
);

// Main router configuration with outlet's children and errorElement for 404
const router = createBrowserRouter([
  {
    path: "/", // root route for App
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    ),
  
 children: [
  {
    index: true, // ✅ default page at "/"
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Homepage />
      </Suspense>
    ),
  },
  {
    path: "/video/:videoId",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <VideoPlayer />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/createChannel",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CreateChannel />
      </Suspense>
    ),
  },
  {
    path: "/channel",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Channel />
      </Suspense>
    ),
  },
  {
    path: "/channels/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Channels />
      </Suspense>
    ),
  },
],

    errorElement: <NotFound />, // not found 404
  },
], {
  // basename: "/online-library-system/"
});

// Render the app with AuthProvider and router
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);