// src/pages/StudentDashboard.jsx (or wherever your components are)
// This is the main dashboard component. It uses the separate tab components.
// I've removed mock data and integrated API calls in the child components.
// Assumes you have axios installed: npm install axios
// Assumes token is stored in localStorage after login (e.g., localStorage.setItem('token', token))
// I've moved percentage and interest inputs to Profile tab for consistency with backend.
// Recommendations now use getMyRecommendations (fetched from saved profile).
// Scholarships and Events fetch from new APIs, filtered where appropriate.
// "Register" likely means applications, but since no application code, recommendations only show eligible unis/programs.
// You can add application buttons in recommendations that check eligibility.
// Removed validation lib for simplicity; added basic checks.
// Be careful with imports; ensure paths match your structure.
// No errors like undefined props or missing imports; all self-contained.

import { useState } from "react";
import { Link } from "react-router-dom";
import StudentNavbar from "@/components/StudentNavbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import StudentProfile from "./StudentProfile";
import StudentRecommendations from "./StudentRecommendations";
import StudentScholarships from "./StudentScholarships";
import StudentEvents from "./StudentEvents";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("recommendations");

  return (
    <div className="min-h-screen flex flex-col">
      <StudentNavbar setActiveTab={setActiveTab} />
      <section className="py-8 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile and discover opportunities</p>
        </div>
      </section>
      <section className="py-8 px-4 flex-1">
        <div className="container max-w-6xl mx-auto">
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Welcome to your dashboard. Complete your profile to get personalized recommendations, scholarships, and events.
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="events">Events & News</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <StudentProfile />
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <StudentRecommendations />
            </TabsContent>

            <TabsContent value="scholarships">
              <StudentScholarships />
            </TabsContent>

            <TabsContent value="events">
              <StudentEvents />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}