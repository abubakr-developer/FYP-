import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import Scholarships from "./pages/Scholarships";
import Events from "./pages/Events";
import Register from "./pages/Student/Register";
import RoleSelection from "./pages/RoleSelection";
import StudentLogin from "./pages/Student/StudentLogin";
import StudentForgotPassword from "./pages/Student/StudentForgotPassword";
import StudentResetPassword from "./pages/Student/StudentResetPassword";
import UniversityLogin from "./pages/University/UniversityLogin";
import AdminLogin from "./pages/Admin/AdminLogin";
import UniversityRegister from "./pages/University/UniversityRegister";
import UniversityDetailedInformation from "./pages/Student/UniversityDetailedInformation";
import NotFound from "./pages/NotFound";

// Protected / Dashboard pages
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentProfile from "./pages/Student/StudentProfile";
import StudentRecommendations from "./pages/Student/StudentRecommendations";
import StudentScholarships from "./pages/Student/StudentScholarships";
import StudentEvents from "./pages/Student/StudentEvents";
import UniversityDashboard from "./pages/University/UniversityDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ── Public Routes (no login required) ── */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/universities/:id" element={<UniversityDetail />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/events" element={<Events />} />

          {/* Auth / Registration */}
          <Route path="/studentlogin" element={<StudentLogin />} />
          <Route path="/student-forgot-password" element={<StudentForgotPassword />} />
          <Route path="/student-reset-password" element={<StudentResetPassword />} />
          <Route path="/university-login" element={<UniversityLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role-selection" element={<RoleSelection isOpen={true} />} />
          <Route path="/university-register" element={<UniversityRegister />} />

          {/* Public University Detail */}
          <Route path="/universitydetailinformation/:id" element={<UniversityDetailedInformation />} />

          {/* ── Protected Routes (require login) ── */}
          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route path="/student-recommendations" element={<StudentRecommendations />} />
            <Route path="/student-scholarships" element={<StudentScholarships />} />
            <Route path="/student-events" element={<StudentEvents />} />
          </Route>

          {/* University Routes */}
          <Route element={<ProtectedRoute allowedRole="university" />}>
            <Route path="/university-dashboard" element={<UniversityDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;