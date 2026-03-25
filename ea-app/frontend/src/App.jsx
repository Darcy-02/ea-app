import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Landing from "./components/Landing";
import Feed from "./components/Feed";
import Explore from "./components/Explore";
import Profile from "./components/Profile";
import Upload from "./components/Upload";
import Bookmarks from "./components/Bookmarks";
import AdminDashboard from "./components/AdminDashboard";
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import AppNav from "./components/AppNav";
import About from "./components/About";

const authedRoutes = ["/feed", "/explore", "/upload", "/bookmarks", "/admin", "/about"];

const App = () => {
  const { pathname } = useLocation();
  const showNav =
    authedRoutes.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith("/profile");

  return (
    <div className="bg-[#050505] min-h-screen relative">
      <Toaster
        toastOptions={{
          style: { background: "#1a1a1a", color: "#fff", border: "2px solid #FF4D00", borderRadius: "0px", fontFamily: "Space Grotesk", fontWeight: 700, textTransform: "uppercase", fontSize: "12px" },
        }}
      />

      {showNav && <AppNav />}

      <div className={showNav ? "pt-[72px] pb-20 md:pb-0" : ""}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
