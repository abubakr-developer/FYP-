import { useState, useEffect } from "react";
import UniversityNavbar from "@/components/UniversityNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, BookOpen, Award, Calendar, Info, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  universityProfileSchema,
  programSchema,
  scholarshipSchema,
  eventSchema,
  newsSchema,
  validateForm,
} from "@/lib/validation";

// ────────────────────────────────────────────────
// Reusable API helper
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

  // Programs
const [programData, setProgramData] = useState({
  programName: "",
  duration: "",
  eligibilityCriteria: "",
  fee: "",
  seats: "",
});
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  // Scholarships
  const [scholarshipData, setScholarshipData] = useState({
    title: "",
    amount: "",
    deadline: "",
    description: "",
  });
  const [scholarshipFile, setScholarshipFile] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loadingScholarships, setLoadingScholarships] = useState(false);

  // Events
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });
  const [eventFile, setEventFile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // News (still demo)
  const [newsData, setNewsData] = useState({ title: "", content: "" });

  const [errors, setErrors] = useState({});

  // ────────────────────────────────────────────────
  // Fetch data when tab changes
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "programs") loadPrograms();
    if (activeTab === "scholarships") loadScholarships();
    if (activeTab === "events") loadEvents();
  }, [activeTab]);

  const loadPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const data = await apiFetch("/programs");
      setPrograms(Array.isArray(data) ? data : data.programs || data.data || []);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingPrograms(false);
    }
  };

  const loadScholarships = async () => {
    setLoadingScholarships(true);
    try {
      const data = await apiFetch("/scholarships");
      setScholarships(Array.isArray(data) ? data : data.scholarships || data.data || []);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingScholarships(false);
    }
  };

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await apiFetch("/events");
      setEvents(Array.isArray(data) ? data : data.events || data.data || []);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoadingEvents(false);
    }
  };

  const renderError = (field) => {
    if (!errors[field]) return null;
    return (
      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" />
        {errors[field]}
      </p>
    );
  };

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────
  const handleAddProgram = async () => {
    const result = validateForm(programSchema, programData);
    if (!result.success) {
      setErrors(result.errors || {});
      toast({ title: "Validation Error", description: "Please fix the errors", variant: "destructive" });
      return;
    }

    try {
      await apiFetch("/programs", {
        method: "POST",
        body: JSON.stringify(programData),
      });
      toast({ title: "Success", description: "Program added successfully" });
      setProgramData({ name: "", duration: "", eligibilityCriteria: "" });
      setErrors({});
      loadPrograms();
    } catch (err) {
      toast({
        title: "Failed to add program",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleAddScholarship = async () => {
    const parsed = {
      ...scholarshipData,
      amount: scholarshipData.amount ? parseFloat(scholarshipData.amount) : 0,
    };

    const result = validateForm(scholarshipSchema, parsed);
    if (!result.success) {
      setErrors(result.errors || {});
      toast({ title: "Validation Error", description: "Please fix the errors", variant: "destructive" });
      return;
    }

    if (!scholarshipFile) {
      toast({ title: "Missing file", description: "Please select an image", variant: "destructive" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", parsed.title);
      formData.append("amount", parsed.amount);
      formData.append("deadline", parsed.deadline);
      formData.append("description", parsed.description);
      formData.append("image", scholarshipFile);

      await apiFetch("/scholarships", {
        method: "POST",
        body: formData,
        headers: {},
      });

      toast({ title: "Success", description: "Scholarship added successfully" });
      setScholarshipData({ title: "", amount: "", deadline: "", description: "" });
      setScholarshipFile(null);
      setErrors({});
      loadScholarships();
    } catch (err) {
      toast({
        title: "Failed to add scholarship",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleAddEvent = async () => {
    const result = validateForm(eventSchema, eventData);
    if (!result.success) {
      setErrors(result.errors || {});
      toast({ title: "Validation Error", description: "Please fix the errors", variant: "destructive" });
      return;
    }

    if (!eventFile) {
      toast({ title: "Missing file", description: "Please select a poster/image", variant: "destructive" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("location", eventData.location);
      formData.append("description", eventData.description);
      formData.append("poster", eventFile);

      await apiFetch("/events", {
        method: "POST",
        body: formData,
        headers: {},
      });

      toast({ title: "Success", description: "Event created successfully" });
      setEventData({ title: "", date: "", location: "", description: "" });
      setEventFile(null);
      setErrors({});
      loadEvents();
    } catch (err) {
      toast({
        title: "Failed to create event",
        description: err.message,
        variant: "destructive",
      });
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
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
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

            {/* PROGRAMS */}
            <TabsContent value="programs">
              <div className="space-y-8">
                <Card className="border-2">
                  <CardHeader><CardTitle>Add Program</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="space-y-2">
    <Label>Program Name</Label>
    <Input
      placeholder="e.g. Bachelor of Science in Computer Science"
      value={programData.programName}
      onChange={e => setProgramData(p => ({ ...p, programName: e.target.value }))}
      className={errors.programName && "border-destructive"}
    />
    {renderError("programName")}
  </div>

  <div className="space-y-2">
    <Label>Duration</Label>
    <Input
      placeholder="e.g. 4 Years"
      value={programData.duration}
      onChange={e => setProgramData(p => ({ ...p, duration: e.target.value }))}
      className={errors.duration && "border-destructive"}
    />
    {renderError("duration")}
  </div>

  <div className="space-y-2">
    <Label>Fee (PKR)</Label>
    <Input
      type="number"
      placeholder="e.g. 120000"
      value={programData.fee}
      onChange={e => setProgramData(p => ({ ...p, fee: e.target.value }))}
      className={errors.fee && "border-destructive"}
    />
    {renderError("fee")}
  </div>

  <div className="space-y-2">
    <Label>Seats</Label>
    <Input
      type="number"
      placeholder="e.g. 100"
      value={programData.seats}
      onChange={e => setProgramData(p => ({ ...p, seats: e.target.value }))}
      className={errors.seats && "border-destructive"}
    />
    {renderError("seats")}
  </div>
</div>

<div className="space-y-2">
  <Label>Eligibility Criteria</Label>
  <Textarea
    placeholder="e.g. Intermediate with minimum 60% marks, Pre-Engineering group..."
    rows={4}
    value={programData.eligibilityCriteria}
    onChange={e => setProgramData(p => ({ ...p, eligibilityCriteria: e.target.value }))}
    className={errors.eligibilityCriteria && "border-destructive"}
  />
  {renderError("eligibilityCriteria")}
</div>

                    <Button onClick={handleAddProgram} className="w-full" disabled={loadingPrograms}>
                      {loadingPrograms ? "Adding..." : "Add Program"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader><CardTitle>Your Programs</CardTitle></CardHeader>
                  <CardContent>
                    {loadingPrograms ? (
                      <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : programs.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No programs added yet.</p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {programs.map(p => (
                          <Card key={p._id}>
                            <CardContent className="pt-6">
                              <h3 className="font-semibold">{p.name}</h3>
                              <p className="text-sm text-muted-foreground">{p.duration}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SCHOLARSHIPS */}
            <TabsContent value="scholarships">
              <div className="space-y-8">
                <Card className="border-2">
                  <CardHeader><CardTitle>Add Scholarship</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Scholarship title"
                        value={scholarshipData.title}
                        onChange={e => setScholarshipData(p => ({ ...p, title: e.target.value }))}
                        className={errors.title && "border-destructive"}
                      />
                      {renderError("title")}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Amount (PKR)</Label>
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={scholarshipData.amount}
                          onChange={e => setScholarshipData(p => ({ ...p, amount: e.target.value }))}
                          className={errors.amount && "border-destructive"}
                        />
                        {renderError("amount")}
                      </div>
                      <div className="space-y-2">
                        <Label>Deadline</Label>
                        <Input
                          type="date"
                          value={scholarshipData.deadline}
                          onChange={e => setScholarshipData(p => ({ ...p, deadline: e.target.value }))}
                          className={errors.deadline && "border-destructive"}
                        />
                        {renderError("deadline")}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description / Benefits</Label>
                      <Textarea
                        placeholder="Describe eligibility, benefits, application process, etc..."
                        rows={4}
                        value={scholarshipData.description}
                        onChange={e => setScholarshipData(p => ({ ...p, description: e.target.value }))}
                        className={errors.description && "border-destructive"}
                      />
                      {renderError("description")}
                    </div>

                    <div className="space-y-2">
                      <Label>Image / Logo</Label>
                      <Input type="file" accept="image/*" onChange={e => setScholarshipFile(e.target.files?.[0] || null)} />
                    </div>

                    <Button onClick={handleAddScholarship} className="w-full" disabled={loadingScholarships}>
                      {loadingScholarships ? "Adding..." : "Add Scholarship"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader><CardTitle>Your Scholarships</CardTitle></CardHeader>
                  <CardContent>
                    {loadingScholarships ? (
                      <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : scholarships.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No scholarships added yet.</p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {scholarships.map(s => (
                          <Card key={s._id}>
                            <CardContent className="pt-6">
                              <h3 className="font-semibold">{s.title}</h3>
                              <p className="text-sm">PKR {s.amount?.toLocaleString() || "—"}</p>
                              <p className="text-sm text-muted-foreground">Deadline: {s.deadline ? new Date(s.deadline).toLocaleDateString() : "—"}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* EVENTS */}
            <TabsContent value="events">
              <div className="space-y-8">
                <Card className="border-2">
                  <CardHeader><CardTitle>Create Event</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Event Title</Label>
                      <Input
                        placeholder="Event title"
                        value={eventData.title}
                        onChange={e => setEventData(p => ({ ...p, title: e.target.value }))}
                        className={errors.title && "border-destructive"}
                      />
                      {renderError("title")}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={eventData.date}
                          onChange={e => setEventData(p => ({ ...p, date: e.target.value }))}
                          className={errors.date && "border-destructive"}
                        />
                        {renderError("date")}
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="Location"
                          value={eventData.location}
                          onChange={e => setEventData(p => ({ ...p, location: e.target.value }))}
                          className={errors.location && "border-destructive"}
                        />
                        {renderError("location")}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Event details, agenda, speakers, registration info..."
                        rows={4}
                        value={eventData.description}
                        onChange={e => setEventData(p => ({ ...p, description: e.target.value }))}
                        className={errors.description && "border-destructive"}
                      />
                      {renderError("description")}
                    </div>

                    <div className="space-y-2">
                      <Label>Poster / Banner</Label>
                      <Input type="file" accept="image/*" onChange={e => setEventFile(e.target.files?.[0] || null)} />
                    </div>

                    <Button onClick={handleAddEvent} className="w-full" disabled={loadingEvents}>
                      {loadingEvents ? "Creating..." : "Create Event"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader><CardTitle>Your Events</CardTitle></CardHeader>
                  <CardContent>
                    {loadingEvents ? (
                      <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : events.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No events created yet.</p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {events.map(e => (
                          <Card key={e._id}>
                            <CardContent className="pt-6">
                              <h3 className="font-semibold">{e.title}</h3>
                              <p className="text-sm">Date: {e.date ? new Date(e.date).toLocaleDateString() : "—"}</p>
                              <p className="text-sm text-muted-foreground">{e.location}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* NEWS (still demo) */}
            <TabsContent value="news">
              <Card className="border-2">
                <CardHeader><CardTitle>Post News</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="News headline" value={newsData.title} onChange={e => setNewsData(p => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea rows={4} placeholder="Write content..." value={newsData.content} onChange={e => setNewsData(p => ({ ...p, content: e.target.value }))} />
                  </div>
                  <Button onClick={() => toast({ title: "Demo", description: "News publishing coming soon" })} className="w-full">
                    Publish
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}