import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Users, BookOpen, Award, Calendar, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  universityProfileSchema, 
  programSchema, 
  scholarshipSchema, 
  eventSchema, 
  newsSchema,
  validateForm 
} from "@/lib/validation";

export default function UniversityDashboard() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({ name: "", city: "", description: "" });
  const [programData, setProgramData] = useState({ name: "", duration: "" });
  const [scholarshipData, setScholarshipData] = useState({ title: "", amount: "", deadline: "" });
  const [eventData, setEventData] = useState({ title: "", date: "", location: "" });
  const [newsData, setNewsData] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({});

  const handleSubmit = (type, schema, data, resetFn) => {
    // Parse numeric fields if needed
    const parsedData = type === "Scholarship" 
      ? { ...data, amount: data.amount ? parseFloat(data.amount) : 0 }
      : data;

    const result = validateForm(schema, parsedData);
    
    if (!result.success) {
      setErrors(result.errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setErrors({});
    toast({ 
      title: "Demo Mode", 
      description: `${type} would be saved here. Backend storage coming soon!` 
    });
    resetFn();
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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
              <strong>Demo Mode:</strong> This dashboard shows sample statistics. Enable backend to manage real data and track student engagement.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Active Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">1,250</span>
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">25</span>
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">8</span>
                  <Award className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">5</span>
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>University Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>University Name</Label>
                      <Input 
                        placeholder="Enter name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        maxLength={200}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {renderError("name")}
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input 
                        placeholder="City" 
                        value={profileData.city}
                        onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                        maxLength={100}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {renderError("city")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Describe your university..." 
                      rows={4}
                      value={profileData.description}
                      onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                      maxLength={2000}
                      className={errors.description ? "border-destructive" : ""}
                    />
                    {renderError("description")}
                  </div>
                  <Button 
                    onClick={() => handleSubmit(
                      "Profile", 
                      universityProfileSchema, 
                      profileData, 
                      () => {}
                    )} 
                    className="w-full"
                  >
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="programs">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Add Program</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Program Name</Label>
                      <Input 
                        placeholder="e.g., Computer Science"
                        value={programData.name}
                        onChange={(e) => setProgramData(prev => ({ ...prev, name: e.target.value }))}
                        maxLength={200}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {renderError("name")}
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input 
                        placeholder="e.g., 4 Years"
                        value={programData.duration}
                        onChange={(e) => setProgramData(prev => ({ ...prev, duration: e.target.value }))}
                        maxLength={50}
                        className={errors.duration ? "border-destructive" : ""}
                      />
                      {renderError("duration")}
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSubmit(
                      "Program", 
                      programSchema, 
                      programData, 
                      () => setProgramData({ name: "", duration: "" })
                    )} 
                    className="w-full"
                  >
                    Add Program
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scholarships">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Add Scholarship</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      placeholder="Scholarship title"
                      value={scholarshipData.title}
                      onChange={(e) => setScholarshipData(prev => ({ ...prev, title: e.target.value }))}
                      maxLength={200}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {renderError("title")}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount (PKR)</Label>
                      <Input 
                        type="number" 
                        placeholder="Amount"
                        value={scholarshipData.amount}
                        onChange={(e) => setScholarshipData(prev => ({ ...prev, amount: e.target.value }))}
                        min="0"
                        max="10000000"
                        className={errors.amount ? "border-destructive" : ""}
                      />
                      {renderError("amount")}
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Input 
                        type="date"
                        value={scholarshipData.deadline}
                        onChange={(e) => setScholarshipData(prev => ({ ...prev, deadline: e.target.value }))}
                        className={errors.deadline ? "border-destructive" : ""}
                      />
                      {renderError("deadline")}
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSubmit(
                      "Scholarship", 
                      scholarshipSchema, 
                      scholarshipData, 
                      () => setScholarshipData({ title: "", amount: "", deadline: "" })
                    )} 
                    className="w-full"
                  >
                    Add Scholarship
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Create Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Event Title</Label>
                    <Input 
                      placeholder="Event title"
                      value={eventData.title}
                      onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                      maxLength={200}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {renderError("title")}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input 
                        type="date"
                        value={eventData.date}
                        onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                        className={errors.date ? "border-destructive" : ""}
                      />
                      {renderError("date")}
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input 
                        placeholder="Location"
                        value={eventData.location}
                        onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                        maxLength={200}
                        className={errors.location ? "border-destructive" : ""}
                      />
                      {renderError("location")}
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSubmit(
                      "Event", 
                      eventSchema, 
                      eventData, 
                      () => setEventData({ title: "", date: "", location: "" })
                    )} 
                    className="w-full"
                  >
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Post News</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      placeholder="News headline"
                      value={newsData.title}
                      onChange={(e) => setNewsData(prev => ({ ...prev, title: e.target.value }))}
                      maxLength={200}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {renderError("title")}
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea 
                      placeholder="Write content..." 
                      rows={4}
                      value={newsData.content}
                      onChange={(e) => setNewsData(prev => ({ ...prev, content: e.target.value }))}
                      maxLength={5000}
                      className={errors.content ? "border-destructive" : ""}
                    />
                    {renderError("content")}
                  </div>
                  <Button 
                    onClick={() => handleSubmit(
                      "News", 
                      newsSchema, 
                      newsData, 
                      () => setNewsData({ title: "", content: "" })
                    )} 
                    className="w-full"
                  >
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
