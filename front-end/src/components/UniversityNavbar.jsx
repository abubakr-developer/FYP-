import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function UniversityNavbar({ setActiveTab }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get logged-in university data from localStorage (same pattern as student)
  const university = JSON.parse(localStorage.getItem("user")) || {};

  // Adjust these keys based on what your university registration/login actually saves
  const universityName =
    university.universityName ||
    university.name ||
    university.institutionName ||
    "University";   // fallback

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // Call your logout endpoint
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include token if your university backend uses JWT in header
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // credentials: "include",   // ← uncomment ONLY if using httpOnly cookies instead of localStorage
      });

      // We clear local data regardless of response status in most JWT setups
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to landing / login page
      navigate("/");

      // Optional hard redirect if you have issues with protected routes:
      // window.location.href = "/";

    } catch (error) {
      console.error("University logout failed:", error);

      // Fail-safe: still clear data and redirect
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
        <Link to="/university-dashboard" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Unisphere
          </span>
        </Link>

        {/* CENTER: Dashboard Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("profile")}
            className="hover:text-primary transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("programs")}
            className="hover:text-primary transition-colors"
          >
            Programs
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
          <button
            onClick={() => setActiveTab("news")}
            className="hover:text-primary transition-colors"
          >
            News
          </button>
        </div>

        {/* RIGHT: University Name + Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">{universityName}</span>
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