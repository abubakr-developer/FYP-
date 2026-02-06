import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react"; // ← added for loading state (optional but good UX)

export default function StudentNavbar({ setActiveTab }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // optional: disable button during request

  // Get logged-in student from localStorage
  const student = JSON.parse(localStorage.getItem("user")) || {};

  const studentName =
    student.firstName && student.lastName
      ? `${student.firstName} ${student.lastName}`
      : "Student";

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Option A: Using fetch (no extra dependency needed)
      const response = await fetch("/api/auth/logout", {
        method: "POST",           // or "GET" — depends on your backend
        headers: {
          "Content-Type": "application/json",
          // If your backend expects the token in header (common with JWT)
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // credentials: "include",   // uncomment if using cookies instead of localStorage
      });

      // Option B: If you prefer axios (uncomment if installed)
      // import axios from "axios";
      // await axios.post("/api/auth/logout", {}, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      // });

      // Even if backend returns 401/403 or error — we still want to logout locally
      // Many JWT backends don't require a successful response for logout

      // Clear local storage / session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to home page ("/" = landing page)
      navigate("/");

      // Optional: force refresh if you have protected routes listening to storage events
      // window.location.href = "/";   // hard refresh (use only if needed)

    } catch (error) {
      console.error("Logout failed:", error);
      // Still logout locally even if API fails (fail-safe)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container h-16 flex items-center justify-between">

        {/* LEFT: Logo */}
        <Link to="/student-dashboard" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Unisphere
          </span>
        </Link>

        {/* CENTER: Dashboard Tabs */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("profile")}
            className="hover:text-primary transition-colors"
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("recommendations")}
            className="hover:text-primary transition-colors"
          >
            Recommendations
          </button>

          <button
            onClick={() => setActiveTab("scholarships")}
            className="hover:text-primary transition-colors"
          >
            Scholarships
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className="hover:text-primary transition-colors"
          >
            Events
          </button>
        </div>

        {/* RIGHT: Student Info + Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">{studentName}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-4 w-4 mr-1" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>

      </div>
    </nav>
  );
}