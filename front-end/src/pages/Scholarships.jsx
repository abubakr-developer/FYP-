import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Percent, Calendar, CheckCircle, Award, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Scholarships() {
  const { toast } = useToast();

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/student/public/scholarships`);

        if (!res.ok) {
          throw new Error("Failed to load scholarships");
        }

        const data = await res.json();
        const schList = data.success ? data.scholarships || [] : [];

        setScholarships(schList);
      } catch (err) {
        console.error("Scholarships fetch error:", err);
        setError("Could not load scholarships. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load scholarship list",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Extract unique types for filter
  const types = ["all", ...new Set(scholarships.map(s => s.type || "Unknown").filter(Boolean))];

  // Apply filters
  const filteredScholarships = scholarships.filter(sch => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (sch.title || "").toLowerCase().includes(searchLower) ||
      (sch.universityName || "").toLowerCase().includes(searchLower) ||
      (sch.description || "").toLowerCase().includes(searchLower);

    const matchesType = typeFilter === "all" || 
      (sch.type || "").toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading scholarships...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero + Filters */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Find <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Scholarships</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Discover {scholarships.length} real financial aid opportunities from approved universities
          </p>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, university or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scholarships List */}
      <section className="py-12 px-4 flex-1">
        <div className="container max-w-6xl mx-auto">
          {filteredScholarships.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl font-medium text-muted-foreground">
                No scholarships found matching your search.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredScholarships.map((sch) => (
                <Card 
  key={sch._id || sch.id} 
  className="border-2 hover:shadow-xl transition-all hover:scale-[1.02] duration-300 flex flex-col h-full"
>
  <CardHeader className="pb-4">
    <div className="flex items-start justify-between gap-4 mb-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Award className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <CardTitle className="text-lg leading-tight truncate">
            {sch.title}
          </CardTitle>
          <CardDescription className="text-base font-medium mt-1 truncate">
            {sch.universityName}
          </CardDescription>
        </div>
      </div>

      <Badge 
        className="shrink-0"
        variant={
          sch.type?.toLowerCase().includes("merit") ? "default" :
          sch.type?.toLowerCase().includes("need")  ? "secondary" :
          sch.type?.toLowerCase().includes("full")  ? "destructive" :
          "outline"
        }
      >
        {sch.type || "Unknown"}
      </Badge>
    </div>
  </CardHeader>

  <CardContent className="space-y-5 flex-1 flex flex-col">
    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
      {sch.description || "No description provided."}
    </p>

    {/* Key information - organized in clean vertical groups */}
    <div className="space-y-4 pt-3 border-t">
      {/* Scholarship Amount */}
      <div className="flex items-start gap-3">
        <Percent className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Scholarship</p>
          <p className="text-sm text-muted-foreground">
            {sch.percentage 
              ? `${sch.percentage}% of tuition` 
              : sch.amount 
                ? `${sch.amount} ${sch.currency || ''}` 
                : "N/A"}
          </p>
        </div>
      </div>

      {/* Deadline - vertical style */}
      <div className="flex items-start gap-3">
        <Calendar className="h-5 w-5 text-accent mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Application Deadline</p>
          <p className="text-sm text-muted-foreground">
            {sch.deadline 
              ? new Date(sch.deadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : "Not specified"}
          </p>
        </div>
      </div>

      {/* Eligibility - vertical style */}
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Basic Eligibility</p>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {sch.eligibility || "Please check the official university website for detailed requirements."}
          </p>
        </div>
      </div>
    </div>

    {/* Optional: Action button area */}
    {sch.link && (
      <div className="mt-auto pt-4">
        <Button 
          variant="outline" 
          className="w-full gap-2"
          asChild
        >
          <a href={sch.link} target="_blank" rel="noopener noreferrer">
            View Details <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    )}
  </CardContent>
</Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}