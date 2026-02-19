// src/components/AdminNavbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { Shield, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AdminNavbar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get logged-in admin info
  const admin = JSON.parse(localStorage.getItem("adminUser")) || {};
  const adminName =
    admin.firstName && admin.lastName
      ? `${admin.firstName} ${admin.lastName}`
      : "Super Admin";

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/superadmin/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/admin-login");
    } catch (error) {
      console.error("Admin logout failed:", error);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/admin-login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-16 flex items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link to="/admin-dashboard" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
            Admin Portal
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Button
            variant="ghost"
            onClick={() => setActiveTab && setActiveTab("students")}
            className={`hover:text-primary transition-colors ${activeTab === "students" ? "text-primary font-bold" : ""}`}
          >
            Students
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab && setActiveTab("universities")}
            className={`hover:text-primary transition-colors ${activeTab === "universities" ? "text-primary font-bold" : ""}`}
          >
            Universities
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab && setActiveTab("approvals")}
            className={`hover:text-primary transition-colors ${activeTab === "approvals" ? "text-primary font-bold" : ""}`}
          >
            Pending Approvals
          </Button>
        </div>

        {/* User info + Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">{adminName}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-1" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </nav>
  );
}