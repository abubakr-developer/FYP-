import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { universities, scholarships, events } from "@/data/mockData";
import { User, TrendingUp, Info, AlertCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { studentProfileSchema, fileUploadSchema, validateForm } from "@/lib/validation";

export default function StudentDashboard() {
  const { toast } = useToast();
  const [percentage, setPercentage] = useState("");
  const [interest, setInterest] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [profileData, setProfileData] = useState({ fullName: "", email: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [fileError, setFileError] = useState("");

  const handleGetRecommendations = () => {
    const perc = parseFloat(percentage);
    if (isNaN(perc) || perc < 0 || perc > 100) {
      toast({ 
        title: "Invalid Percentage", 
        description: "Please enter a valid percentage between 0 and 100.", 
        variant: "destructive" 
      });
      return;
    }
    if (!interest) {
      toast({ 
        title: "Missing Information", 
        description: "Please select your field of interest.", 
        variant: "destructive" 
      });
      return;
    }
    const recommended = universities.filter(uni => uni.minPercentage <= perc);
    setRecommendations(recommended);
    toast({ 
      title: "Recommendations Generated!", 
      description: `Found ${recommended.length} universities matching your criteria.` 
    });
  };

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
    if (profileErrors[id]) {
      setProfileErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleProfileSave = () => {
    const result = validateForm(studentProfileSchema, {
      ...profileData,
      percentage: percentage ? parseFloat(percentage) : 0,
    });
    
    if (!result.success) {
      setProfileErrors(result.errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in your profile.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Demo Mode",
      description: "Profile would be saved here. Backend storage coming soon!",
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError("");
    
    if (!file) return;

    // Validate file
    const result = validateForm(fileUploadSchema, { file });
    if (!result.success) {
      setFileError(result.errors.file || "Invalid file");
      e.target.value = ""; // Reset input
      return;
    }

    toast({
      title: "File Selected",
      description: `${file.name} ready for upload. Backend storage coming soon!`,
    });
  };

  const renderError = (field) => {
    if (!profileErrors[field]) return null;
    return (
      <p className="text-sm text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" />
        {profileErrors[field]}
      </p>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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
              <strong>Demo Mode:</strong> This dashboard shows sample data. Enable backend to save your profile, upload documents, and get personalized recommendations.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="recommendations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      placeholder="Enter your full name" 
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      maxLength={100}
                      className={profileErrors.fullName ? "border-destructive" : ""}
                    />
                    {renderError("fullName")}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={profileData.email}
                      onChange={handleProfileChange}
                      maxLength={255}
                      className={profileErrors.email ? "border-destructive" : ""}
                    />
                    {renderError("email")}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marksheet">Upload Marksheet (PDF only, max 5MB)</Label>
                    <Input 
                      id="marksheet" 
                      type="file" 
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className={fileError ? "border-destructive" : ""}
                    />
                    {fileError && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {fileError}
                      </p>
                    )}
                  </div>
                  <Button className="md:col-span-2" onClick={handleProfileSave}>
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Get Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Your Percentage (0-100)</Label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 85" 
                        value={percentage} 
                        onChange={(e) => setPercentage(e.target.value)}
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Interest</Label>
                      <Select value={interest} onValueChange={setInterest}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleGetRecommendations} className="w-full">
                    Get Recommendations
                  </Button>
                </CardContent>
              </Card>
              {recommendations.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendations.map(uni => (
                    <Card key={uni.id} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg">{uni.name}</CardTitle>
                        <CardDescription>{uni.city} • Min: {uni.minPercentage}%</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to={`/universities/${uni.id}`}>View Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scholarships">
              <div className="grid md:grid-cols-2 gap-6">
                {scholarships.slice(0, 4).map(s => (
                  <Card key={s.id} className="border-2">
                    <CardHeader>
                      <CardTitle>{s.title}</CardTitle>
                      <CardDescription>{s.universityName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-primary font-semibold">{s.amount}</p>
                      <Button className="w-full mt-4">Apply</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="grid md:grid-cols-2 gap-6">
                {events.map(e => (
                  <Card key={e.id} className="border-2">
                    <CardHeader>
                      <CardTitle>{e.title}</CardTitle>
                      <CardDescription>{e.universityName} • {e.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{e.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}
