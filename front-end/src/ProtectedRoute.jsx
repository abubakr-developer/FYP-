import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const location = useLocation();

  // Helper to check if token exists and is not a string "null"/"undefined"
  const getToken = (key) => {
    const val = localStorage.getItem(key);
    return val && val !== "null" && val !== "undefined" ? val : null;
  };

  const studentToken = getToken("token");
  const universityToken = getToken("universityToken");
  const adminToken = getToken("adminToken");

  const isLoggedIn = !!(studentToken || universityToken || adminToken);

  // Check if the user has the specific token required for the requested route
  if (allowedRole === "student") {
    if (studentToken) return <Outlet />;
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Navigate to="/studentlogin" state={{ from: location }} replace />;
  }

  if (allowedRole === "university") {
    if (universityToken) return <Outlet />;
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Navigate to="/university-login" state={{ from: location }} replace />;
  }

  if (allowedRole === "admin") {
    if (adminToken) return <Outlet />;
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // If no specific role is required (generic protection), allow any logged-in user
  if (!allowedRole && isLoggedIn) {
    return <Outlet />;
  }
 
  return <Navigate to="/role-selection" replace />;
};

export default ProtectedRoute;