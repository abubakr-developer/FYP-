import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setprofileImage] = useState(
    "https://via.placeholder.com/40"
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log(localStorage.getItem('name'));
    console.log(localStorage.getItem('profileImage'));
    const userName = localStorage.getItem("name");
    const userEmail = localStorage.getItem("email");
    const userprofileImage = localStorage.getItem("profileImage") || "https://via.placeholder.com/40";

    if (!userName || !userEmail) {
      navigate("/login");
      return;
    }

    setName(userName);
    setEmail(userEmail);
    setprofileImage(userprofileImage);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profileImage");
    navigate("/login");
  };
  return (
    <div className="flex flex-col h-screen">
        <Navbar name={name} profileImage={profileImage} />
        <div className="flex flex-1">
          <Sidebar handleLogout={handleLogout} />
          <div className="flex-1 bg-gray-50">
            <Outlet />
          </div>
        </div>
    </div>
  );
};

export default Layout;
