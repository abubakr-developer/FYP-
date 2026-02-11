import { useState } from "react";
import UniversityNavbar from "@/components/UniversityNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, BookOpen, Award, Calendar, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { universityProfileSchema, validateForm } from "@/lib/validation";
import ProgramsTab from "@/pages/University/ProgramsTab"; 
import ScholarshipsTab from "@//pages/University/ScholarshipsTab";
import EventsTab from "@/pages/University/EventsTab"; 

// ────────────────────────────────────────────────
// Reusable API helper (unchanged)
// ────────────────────────────────────────────────
const API_BASE = "/api/university";

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  if (!options.body || !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

// ────────────────────────────────────────────────
export default function UniversityDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile (still demo)
  const [profileData, setProfileData] = useState({ name: "", city: "", description: "" });

  // For stats (use dummy or fetched lengths; assuming fetched from tabs, but for simplicity use state if needed)
  const [programs, setPrograms] = useState([]); // Optional: if you want to share for stats
  const [scholarships, setScholarships] = useState([]);
  const [events, setEvents] = useState([]);
  // Note: To update stats, you can pass setters to tabs if needed, but for now use placeholders

  // ────────────────────────────────────────────────
  // JSX
  // ────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <UniversityNavbar setActiveTab={setActiveTab} />
      <section className="py-8 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">University Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your university profile and content</p>
        </div>
      </section>

      <section className="py-8 px-4 flex-1">
        <div className="container max-w-6xl mx-auto">
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Connected to real backend endpoints. Authentication via JWT required.
            </AlertDescription>
          </Alert>

          {/* Stats cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-2">
              <CardHeader className="pb-3"><CardTitle className="text-sm text-muted-foreground">Active Students</CardTitle></CardHeader>
              <CardContent><div className="flex items-center justify-between"><span className="text-2xl font-bold">1,250</span><Users className="h-5 w-5 text-primary" /></div></CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="pb-3"><CardTitle className="text-sm text-muted-foreground">Programs</CardTitle></CardHeader>
              <CardContent><div className="flex items-center justify-between"><span className="text-2xl font-bold">{programs.length || "25"}</span><BookOpen className="h-5 w-5 text-primary" /></div></CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="pb-3"><CardTitle className="text-sm text-muted-foreground">Scholarships</CardTitle></CardHeader>
              <CardContent><div className="flex items-center justify-between"><span className="text-2xl font-bold">{scholarships.length || "8"}</span><Award className="h-5 w-5 text-primary" /></div></CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="pb-3"><CardTitle className="text-sm text-muted-foreground">Events</CardTitle></CardHeader>
              <CardContent><div className="flex items-center justify-between"><span className="text-2xl font-bold">{events.length || "5"}</span><Calendar className="h-5 w-5 text-primary" /></div></CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4"> {/* Removed news */}
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            {/* PROFILE (demo) */}
            <TabsContent value="profile">
              <Card className="border-2">
                <CardHeader><CardTitle>University Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>University Name</Label>
                      <Input value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={profileData.city} onChange={e => setProfileData(p => ({ ...p, city: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea rows={4} value={profileData.description} onChange={e => setProfileData(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <Button onClick={() => toast({ title: "Demo", description: "Profile update coming soon" })} className="w-full">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="programs">
              <ProgramsTab />
            </TabsContent>

            <TabsContent value="scholarships">
              <ScholarshipsTab />
            </TabsContent>

            <TabsContent value="events">
              <EventsTab />
            </TabsContent>

          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}