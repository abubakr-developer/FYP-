import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const studentToken = localStorage.getItem("token");
  const universityToken = localStorage.getItem("universityToken");
  const adminToken = localStorage.getItem("adminToken");


  // Check if the user has the specific token required for the requested route
  if (allowedRole === "student" && studentToken) {
    return <Outlet />;
  }
  if (allowedRole === "university" && universityToken) {
    return <Outlet />;
  }
  if (allowedRole === "admin" && adminToken) {
    return <Outlet />;
  }

  // If no specific role is required (generic protection), allow any logged-in user
  if (!allowedRole && (studentToken || universityToken || adminToken)) {
    return <Outlet />;
  }

  // If they are not logged in at all, send to role selection
  if (!studentToken && !universityToken && !adminToken) {
    return <Navigate to="/role-selection" replace />;
  }

  // If they are logged in but don't have the right role, send to Home
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;