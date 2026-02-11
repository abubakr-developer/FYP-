import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import Scholarships from "./pages/Scholarships";
import Events from "./pages/Events";
import Register from "./pages/Student/Register";
import RoleSelection from "./pages/RoleSelection";
import StudentDashboard from "./pages/StudentDashboard";
import UniversityDashboard from "./pages/University/UniversityDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import StudentLogin from "./pages/Student/StudentLogin";
import UniversityLogin from "./pages/University/UniversityLogin";
import AdminLogin from "./pages/Admin/AdminLogin";
import UniversityRegister from "./pages/University/UniversityRegister"; 
import ProgramsTab from "./pages/University/ProgramsTab";
import ScholarshipsTab from "./pages/University/ScholarshipsTab";
import EventsTab from "./pages/University/EventsTab";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}  />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/universities/:id" element={<UniversityDetail />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/events" element={<Events />} />
          <Route path="/studentlogin" element={<StudentLogin />} />
          <Route path="/university-login" element={<UniversityLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/university-dashboard" element={<UniversityDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/university-register" element={<UniversityRegister />} />
          <Route path="/programs" element={<ProgramsTab />} />
          <Route path="/scholarships" element={<ScholarshipsTab />} />
          <Route path="/events" element={<EventsTab />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
