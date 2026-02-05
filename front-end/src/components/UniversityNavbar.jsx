import { Link } from "react-router-dom";
import { GraduationCap, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UniversityNavbar({ setActiveTab }) {
  // later this will come from auth / context
  const universityName = "FAST University";

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


        {/* RIGHT: Profile */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-primary" />
            {universityName}
          </div>

          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>

      </div>
    </nav>
  );
}
