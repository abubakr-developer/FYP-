import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UniversityNavbar from "@/components/UniversityNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Award, Calendar, Info, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProgramsTab from "@/pages/University/ProgramsTab"; 
import ScholarshipsTab from "@/pages/University/ScholarshipsTab";
import EventsTab from "@/pages/University/EventsTab"; 

// ────────────────────────────────────────────────
// Reusable API helper (unchanged)
// ────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api/university`;

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("universityToken");

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
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("universityToken");
      window.location.href = "/university-login";
    }
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

// ────────────────────────────────────────────────
export default function UniversityDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    institutionName: "",
    city: "",
    address: "",
    description: "",
    website: "",
    admissionWebsite: "",
  });

  // Dynamic stats
  const [stats, setStats] = useState({
    programs: 0,
    scholarships: 0,
    events: 0,
  });

  // Protect route + load profile & stats
  useEffect(() => {
    const token = localStorage.getItem("universityToken");
    if (!token) {
      navigate("/university-login");
      toast({
        title: "Authentication Required",
        description: "Please login to access the dashboard.",
        variant: "destructive",
      });
      return;
    }

    const loadData = async () => {
      // Load profile (when profile tab is active)
      if (activeTab === "profile") {
        setLoadingProfile(true);
        try {
          const data = await apiFetch("/profile");
          if (data.success && data.university) {
            const uni = data.university;
            setProfileData({
              institutionName: uni.institutionName || "",
              city: uni.city || "",
              address: uni.address || "",
              description: uni.description || "",
              website: uni.website || "",
              admissionWebsite: uni.admissionWebsite || "",
            });
          }
        } catch (err) {
          console.error("Failed to load profile:", err);
          toast({
            title: "Error",
            description: "Could not load profile data.",
            variant: "destructive",
          });
        } finally {
          setLoadingProfile(false);
        }
      }

      // Load stats (once, on mount)
      setLoadingStats(true);
      try {
        const [programsRes, scholarshipsRes, eventsRes] = await Promise.all([
          apiFetch("/programs"),
          apiFetch("/scholarships"),
          apiFetch("/events"),
        ]);

        setStats({
          programs: Array.isArray(programsRes) 
            ? programsRes.length 
            : programsRes.programs?.length || 0,
          scholarships: Array.isArray(scholarshipsRes) 
            ? scholarshipsRes.length 
            : scholarshipsRes.scholarships?.length || 0,
          events: Array.isArray(eventsRes) 
            ? eventsRes.length 
            : eventsRes.events?.length || 0,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
        toast({
          title: "Warning",
          description: "Could not load dashboard stats.",
          variant: "default",
        });
        setStats({ programs: 0, scholarships: 0, events: 0 });
      } finally {
        setLoadingStats(false);
      }
    };

    loadData();
  }, [activeTab, navigate, toast]);

  // Save only basic profile fields
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const profileOnly = {
        institutionName: profileData.institutionName,
        city: profileData.city,
        address: profileData.address,
        description: profileData.description,
      };

      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify(profileOnly),
      });

      toast({
        title: "Success",
        description: "Profile information updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Save only links
  const handleSaveLinks = async () => {
    setSavingLinks(true);
    try {
      const linksOnly = {
        website: profileData.website,
        admissionWebsite: profileData.admissionWebsite,
      };

      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify(linksOnly),
      });

      toast({
        title: "Success",
        description: "Website & admission links updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update links",
        variant: "destructive",
      });
    } finally {
      setSavingLinks(false);
    }
  };

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

          {/* Dynamic Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Programs</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="flex items-center justify-between">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-2xl font-bold">—</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.programs}</span>
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="flex items-center justify-between">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-2xl font-bold">—</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.scholarships}</span>
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Events</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="flex items-center justify-between">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-2xl font-bold">—</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.events}</span>
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="events">Events & News </TabsTrigger>
            </TabsList>

            {/* PROFILE TAB */}
            <TabsContent value="profile">
              {loadingProfile ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>University Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-10">
                    {/* ── Basic Profile Section ── */}
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="institutionName">University Name *</Label>
                          <Input
                            id="institutionName"
                            value={profileData.institutionName}
                            onChange={(e) => setProfileData(p => ({ ...p, institutionName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={profileData.city}
                            onChange={(e) => setProfileData(p => ({ ...p, city: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) => setProfileData(p => ({ ...p, address: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description / About</Label>
                        <Textarea
                          id="description"
                          rows={5}
                          value={profileData.description}
                          onChange={(e) => setProfileData(p => ({ ...p, description: e.target.value }))}
                          placeholder="Tell students about your university..."
                        />
                      </div>

                      <div className="pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="w-full md:w-auto"
                        >
                          {savingProfile ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving Profile...
                            </>
                          ) : (
                            "Save Profile Information"
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* ── Links Section ── */}
                    <div className="border-t pt-10">
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                        <ExternalLink className="h-6 w-6 text-primary" />
                        Website & Admission Links
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="website">General University Website</Label>
                          <Input
                            id="website"
                            type="url"
                            placeholder="https://www.youruniversity.edu.pk"
                            value={profileData.website}
                            onChange={(e) => setProfileData(p => ({ ...p, website: e.target.value }))}
                          />
                          <p className="text-sm text-muted-foreground">
                            Your main university website (optional)
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="admissionWebsite">Admission / Application Portal</Label>
                          <Input
                            id="admissionWebsite"
                            type="url"
                            placeholder="https://admissions.youruniversity.edu.pk/apply"
                            value={profileData.admissionWebsite}
                            onChange={(e) => setProfileData(p => ({ ...p, admissionWebsite: e.target.value }))}
                          />
                          <p className="text-sm text-muted-foreground">
                            Direct link for student applications (highly recommended)
                          </p>
                        </div>
                      </div>

                      <div className="pt-6">
                        <Button
                          onClick={handleSaveLinks}
                          disabled={savingLinks}
                          variant="outline"
                          className="w-full md:w-auto"
                        >
                          {savingLinks ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving Links...
                            </>
                          ) : (
                            "Save Website & Admission Links"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="programs">
              <ProgramsTab apiFetch={apiFetch} />
            </TabsContent>

            <TabsContent value="scholarships">
              <ScholarshipsTab apiFetch={apiFetch} />
            </TabsContent>

            <TabsContent value="events">
              <EventsTab apiFetch={apiFetch} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}